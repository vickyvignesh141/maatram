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
