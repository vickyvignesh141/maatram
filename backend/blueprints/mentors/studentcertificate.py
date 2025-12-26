from flask import Blueprint, jsonify, request, send_from_directory
from pymongo import MongoClient
import os
from werkzeug.utils import secure_filename

certificate_bp = Blueprint("studentcertificate", __name__)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
users_collection = db["users"]

# Upload folder
UPLOAD_FOLDER = "uploads/certificates"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ----------------- VIEW CERTIFICATES -----------------
@certificate_bp.route("/mentor/student/<username>/certificates", methods=["GET"])
def view_student_certificates(username):
    student = users_collection.find_one(
        {"username": username},
        {"_id": 0, "certificates": 1}
    )
    if student is None:
        return jsonify({"message": "Student not found"}), 404

    return jsonify({"certificates": student.get("certificates", [])}), 200


# ----------------- UPLOAD CERTIFICATE -----------------
@certificate_bp.route("/mentor/student/<username>/certificates", methods=["POST"])
def upload_certificate(username):
    if "file" not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # Save in DB
        users_collection.update_one(
            {"username": username},
            {"$push": {"certificates": filename}}
        )

        return jsonify({"message": "File uploaded successfully", "filename": filename}), 201

    return jsonify({"message": "File type not allowed"}), 400


# ----------------- DELETE CERTIFICATE -----------------
@certificate_bp.route("/mentor/student/<username>/certificates/<filename>", methods=["DELETE"])
def delete_certificate(username, filename):
    student = users_collection.find_one({"username": username})
    if student is None:
        return jsonify({"message": "Student not found"}), 404

    if "certificates" not in student or filename not in student["certificates"]:
        return jsonify({"message": "Certificate not found"}), 404

    # Remove from DB
    users_collection.update_one(
        {"username": username},
        {"$pull": {"certificates": filename}}
    )

    # Remove from filesystem
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(filepath):
        os.remove(filepath)

    return jsonify({"message": "Certificate deleted successfully"}), 200


# ----------------- DOWNLOAD / VIEW FILE -----------------
@certificate_bp.route("/mentor/student/<username>/certificates/download/<filename>", methods=["GET"])
def download_certificate(username, filename):
    student = users_collection.find_one({"username": username})
    if student is None or filename not in student.get("certificates", []):
        return jsonify({"message": "Certificate not found"}), 404

    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)
