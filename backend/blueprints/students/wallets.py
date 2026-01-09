from flask import Blueprint, request, jsonify, send_from_directory
from pymongo import MongoClient
from werkzeug.utils import secure_filename
from datetime import datetime
import os, uuid

wallet_bp = Blueprint("wallets", __name__, url_prefix="/api")

# ================= CONFIG =================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_ROOT = os.path.join(BASE_DIR, "..", "uploads", "certificates")

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}
MAX_FILE_SIZE_MB = 5

# ================= MONGO =================
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
wallet_collection = db["studentwallet"]

# ================= HELPERS =================
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def ensure_user_folder(username):
    """
    Auto-creates folder if not exists.
    No manual folder creation needed.
    """
    user_path = os.path.join(UPLOAD_ROOT, username)
    os.makedirs(user_path, exist_ok=True)
    return user_path


# ================= UPLOAD =================
@wallet_bp.route("/student/<username>/certificate", methods=["POST"])
def upload_certificate(username):
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file provided"}), 400

    file = request.files["file"]
    name = request.form.get("name")

    if not file or not name:
        return jsonify({"success": False, "message": "Missing data"}), 400

    if not allowed_file(file.filename):
        return jsonify({"success": False, "message": "Invalid file type"}), 400

    # File size check
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    if size > MAX_FILE_SIZE_MB * 1024 * 1024:
        return jsonify({"success": False, "message": "File too large"}), 400

    user_folder = ensure_user_folder(username)

    ext = file.filename.rsplit(".", 1)[1]
    filename = secure_filename(f"{uuid.uuid4().hex}.{ext}")
    file.save(os.path.join(user_folder, filename))

    cert = {
        "id": uuid.uuid4().hex,
        "name": name,
        "file": filename,
        "uploaded_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    wallet_collection.update_one(
        {"username": username},
        {"$push": {"certificates": cert}},
        upsert=True
    )

    return jsonify({"success": True, "certificate": cert})


# ================= GET =================
@wallet_bp.route("/student/<username>/certificates", methods=["GET"])
def get_certificates(username):
    wallet = wallet_collection.find_one({"username": username}, {"_id": 0})
    return jsonify({"certificates": wallet.get("certificates", []) if wallet else []})


# ================= VIEW =================
@wallet_bp.route("/certificate/<username>/<filename>")
def view_certificate(username, filename):
    user_folder = ensure_user_folder(username)
    return send_from_directory(
        user_folder,
        filename,
        as_attachment=False
    )


# ================= DELETE =================
@wallet_bp.route("/student/<username>/certificate/<cert_id>", methods=["DELETE"])
def delete_certificate(username, cert_id):
    wallet = wallet_collection.find_one({"username": username})
    if not wallet:
        return jsonify({"success": False, "message": "Not found"}), 404

    cert = next((c for c in wallet["certificates"] if c["id"] == cert_id), None)
    if not cert:
        return jsonify({"success": False, "message": "Certificate not found"}), 404

    file_path = os.path.join(UPLOAD_ROOT, username, cert["file"])
    if os.path.exists(file_path):
        os.remove(file_path)

    wallet_collection.update_one(
        {"username": username},
        {"$pull": {"certificates": {"id": cert_id}}}
    )

    return jsonify({"success": True, "message": "Deleted"})



    
# ================= GET SEMESTERS =================
@wallet_bp.route("/student/<username>/academics/semesters", methods=["GET"])
def get_semesters(username):
    wallet = wallet_collection.find_one(
        {"username": username},
        {"_id": 0, "academics.semesters": 1}
    )

    if not wallet:
        return jsonify([])

    return jsonify(wallet.get("academics", {}).get("semesters", []))

# ================= ADD SEMESTER =================

@wallet_bp.route("/student/<username>/academics/semester", methods=["POST"])
def add_semester(username):
    data = request.json
    semester = {
        "id": uuid.uuid4().hex,
        "semester": int(data["semester"]),
        "internals": [],
        "final_result": None
    }

    wallet_collection.update_one(
        {"username": username},
        {"$push": {"academics.semesters": semester}},
        upsert=True
    )
    return jsonify(semester)

# ================= ADD INTERNAL =================

@wallet_bp.route("/student/<username>/academics/internal", methods=["POST"])
def add_internal(username):
    data = request.json

    internal = {
        "id": uuid.uuid4().hex,
        "name": data["name"],
        "subjects": []
    }

    wallet_collection.update_one(
        {
          "username": username,
          "academics.semesters.id": data["semester_id"]
        },
        {
          "$push": {
            "academics.semesters.$.internals": internal
          }
        }
    )
    return jsonify(internal)

# ================= ADD SUBJECT =================

@wallet_bp.route("/student/<username>/academics/subject", methods=["POST"])
def add_subject(username):
    data = request.json

    subject = {
        "id": uuid.uuid4().hex,
        "name": data["name"],
        "marks": None
    }

    wallet_collection.update_one(
        {
          "username": username,
          "academics.semesters.id": data["semester_id"],
          "academics.semesters.internals.id": data["internal_id"]
        },
        {
          "$push": {
            "academics.semesters.$[].internals.$[i].subjects": subject
          }
        },
        array_filters=[{"i.id": data["internal_id"]}]
    )

    return jsonify(subject)


# ================= ADD OR EDIT MARK =================
@wallet_bp.route("/student/<username>/academics/marks", methods=["PUT"])
def update_marks(username):
    data = request.json

    wallet_collection.update_one(
        {"username": username},
        {"$set": {
            "academics.semesters.$[].internals.$[].subjects.$[s].marks": int(data["marks"])
        }},
        array_filters=[{"s.id": data["subject_id"]}]
    )

    return jsonify({"success": True})
# ================= SAVE SEM MARK =================

@wallet_bp.route("/student/<username>/academics/final", methods=["POST"])
def save_final_result(username):
    data = request.json

    final = {
        "total": data["total"],
        "percentage": data["percentage"],
        "grade": data["grade"],
        "gpa": data["gpa"]
    }

    wallet_collection.update_one(
        {"username": username, "academics.semesters.id": data["semester_id"]},
        {"$set": {"academics.semesters.$.final_result": final}}
    )

    return jsonify(final)

