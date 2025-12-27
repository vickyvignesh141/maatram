from flask import Blueprint, jsonify, send_from_directory
from pymongo import MongoClient
import os
import zipfile
import io

certificate_bp = Blueprint("certificate_bp", __name__, url_prefix="/api")

# ================= MONGODB =================
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
studentwallet = db["studentwallet"]

# ================= PATH CONFIG =================
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

UPLOAD_ROOT = os.path.abspath(
    os.path.join(BASE_DIR, "..", "uploads", "certificates")
)

# ================= HELPERS =================
def get_user_folder(username):
    return os.path.join(UPLOAD_ROOT, username)

def file_belongs_to_student(student, filename):
    return any(cert.get("file") == filename for cert in student.get("certificates", []))


# =====================================================
# 1️⃣ LIST CERTIFICATES
# =====================================================
@certificate_bp.route("/mentor/student/<username>/certificates", methods=["GET"])
def get_certificates(username):
    student = studentwallet.find_one(
        {"username": username},
        {"_id": 0, "certificates": 1}
    )

    if not student:
        return jsonify({"message": "Student not found"}), 404

    return jsonify({"certificates": student.get("certificates", [])})


# =====================================================
# 2️⃣ VIEW CERTIFICATE (Browser)
# =====================================================
@certificate_bp.route(
    "/mentor/student/<username>/certificates/view/<filename>",
    methods=["GET"]
)
def view_certificate(username, filename):
    student = studentwallet.find_one({"username": username})
    if not student or not file_belongs_to_student(student, filename):
        return jsonify({"message": "Certificate not found"}), 404

    user_folder = get_user_folder(username)

    if not os.path.exists(os.path.join(user_folder, filename)):
        return jsonify({"message": "File missing on server"}), 404

    return send_from_directory(
        directory=user_folder,
        path=filename,
        as_attachment=False
    )


# =====================================================
# 3️⃣ DOWNLOAD CERTIFICATE
# =====================================================
@certificate_bp.route(
    "/mentor/student/<username>/certificates/download/<filename>",
    methods=["GET"]
)
def download_certificate(username, filename):
    student = studentwallet.find_one({"username": username})
    if not student or not file_belongs_to_student(student, filename):
        return jsonify({"message": "Certificate not found"}), 404

    user_folder = get_user_folder(username)

    if not os.path.exists(os.path.join(user_folder, filename)):
        return jsonify({"message": "File missing on server"}), 404

    return send_from_directory(
        directory=user_folder,
        path=filename,
        as_attachment=True
    )


# =====================================================
# 4️⃣ EXPORT ALL CERTIFICATES (ZIP)
# =====================================================
