from flask import Blueprint, jsonify, send_file
from pymongo import MongoClient
import os
import zipfile
import io

certificate_bp = Blueprint("certificate_bp", __name__, url_prefix="/api")

# ================= MONGODB =================
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
studentwallet = db["studentwallet"]

# ================= UPLOAD ROOT =================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_ROOT = os.path.abspath(
    os.path.join(BASE_DIR, "..", "..", "uploads", "certificates")
)
# backend/uploads/certificates/

# ================= HELPERS =================
def get_user_folder(username):
    """
    uploads/certificates/<username>
    """
    return os.path.join(UPLOAD_ROOT, username)


def file_belongs_to_student(student, filename):
    return any(cert.get("file") == filename for cert in student.get("certificates", []))


# =====================================================
# 1️⃣ Mentor → View Student Certificates (LIST)
# =====================================================
@certificate_bp.route("/mentor/student/<username>/certificates", methods=["GET"])
def get_certificates(username):
    student = studentwallet.find_one(
        {"username": username},
        {"_id": 0, "certificates": 1}
    )

    if not student:
        return jsonify({"message": "Student not found"}), 404

    return jsonify({"certificates": student.get("certificates", [])}), 200


# =====================================================
# 2️⃣ Mentor → VIEW Certificate (Browser)
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
    file_path = os.path.join(user_folder, filename)

    if not os.path.exists(file_path):
        return jsonify({
            "message": "File not found on server",
            "path": file_path
        }), 404

    return send_file(file_path, as_attachment=False)


# =====================================================
# 3️⃣ Mentor → DOWNLOAD Certificate
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
    file_path = os.path.join(user_folder, filename)

    if not os.path.exists(file_path):
        return jsonify({
            "message": "File not found on server",
            "path": file_path
        }), 404

    return send_file(file_path, as_attachment=True)


# =====================================================
# 4️⃣ Mentor → EXPORT ALL Certificates (ZIP)
# =====================================================
@certificate_bp.route(
    "/mentor/student/<username>/certificates/export",
    methods=["GET"]
)
def export_certificates(username):
    student = studentwallet.find_one({"username": username})
    if not student or not student.get("certificates"):
        return jsonify({"message": "No certificates found"}), 404

    user_folder = get_user_folder(username)
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        for cert in student["certificates"]:
            file_path = os.path.join(user_folder, cert["file"])
            if os.path.exists(file_path):
                zipf.write(file_path, arcname=cert["file"])

    zip_buffer.seek(0)

    return send_file(
        zip_buffer,
        as_attachment=True,
        download_name=f"{username}_certificates.zip",
        mimetype="application/zip"
    )
