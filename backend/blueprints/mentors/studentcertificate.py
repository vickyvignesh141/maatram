from flask import Blueprint, jsonify, send_from_directory, Response, send_file
from pymongo import MongoClient
import os
import io
import csv
import zipfile

certificate_bp = Blueprint("certificate_bp", __name__, url_prefix="/api")

# ================= MONGODB =================
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
studentwallet = db["studentwallet"]

# ================= PATH CONFIG =================
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", "uploads", "certificates"))

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
@certificate_bp.route("/mentor/student/<username>/certificates/view/<filename>", methods=["GET"])
def view_certificate(username, filename):
    student = studentwallet.find_one({"username": username})
    if not student or not file_belongs_to_student(student, filename):
        return jsonify({"message": "Certificate not found"}), 404

    user_folder = get_user_folder(username)
    file_path = os.path.join(user_folder, filename)
    if not os.path.exists(file_path):
        return jsonify({"message": "File missing on server"}), 404

    return send_from_directory(directory=user_folder, path=filename, as_attachment=False)


# =====================================================
# 3️⃣ DOWNLOAD CERTIFICATE
# =====================================================
@certificate_bp.route("/mentor/student/<username>/certificates/download/<filename>", methods=["GET"])
def download_certificate(username, filename):
    student = studentwallet.find_one({"username": username})
    if not student or not file_belongs_to_student(student, filename):
        return jsonify({"message": "Certificate not found"}), 404

    user_folder = get_user_folder(username)
    file_path = os.path.join(user_folder, filename)
    if not os.path.exists(file_path):
        return jsonify({"message": "File missing on server"}), 404

    return send_from_directory(directory=user_folder, path=filename, as_attachment=True)


# =====================================================
# 4️⃣ EXPORT ALL CERTIFICATES (ZIP)
# =====================================================
@certificate_bp.route("/mentor/student/<username>/certificates/download_all", methods=["GET"])
def download_all_certificates(username):
    student = studentwallet.find_one({"username": username})
    if not student or not student.get("certificates"):
        return jsonify({"message": "No certificates found"}), 404

    user_folder = get_user_folder(username)
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w") as zip_file:
        for cert in student.get("certificates", []):
            filename = cert.get("file")
            file_path = os.path.join(user_folder, filename)
            if os.path.exists(file_path):
                zip_file.write(file_path, arcname=filename)

    zip_buffer.seek(0)
    return send_file(
        zip_buffer,
        mimetype="application/zip",
        download_name=f"{username}_certificates.zip",
        as_attachment=True
    )


# =====================================================
# 5️⃣ VIEW STUDENT ACADEMICS
# =====================================================
@certificate_bp.route("/mentor/student/<username>/academics", methods=["GET"])
def get_academics(username):
    student = studentwallet.find_one(
        {"username": username},
        {"_id": 0, "academics": 1}
    )
    if not student:
        return jsonify({"message": "Student not found"}), 404

    return jsonify({"academics": student.get("academics", {})})


# =====================================================
# 6️⃣ DOWNLOAD ACADEMICS CSV
# =====================================================
@certificate_bp.route("/mentor/student/<username>/academics/download", methods=["GET"])
def download_academics(username):
    student = studentwallet.find_one(
        {"username": username},
        {"_id": 0, "username": 1, "academics": 1}
    )
    if not student:
        return jsonify({"message": "Student not found"}), 404

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["Semester", "Internal", "Subject", "Marks"])

    for semester in student.get("academics", {}).get("semesters", []):
        sem_num = semester.get("semester")
        for internal in semester.get("internals", []):
            internal_name = internal.get("name")
            for subject in internal.get("subjects", []):
                writer.writerow([sem_num, internal_name, subject.get("name"), subject.get("marks")])

    output.seek(0)
    return Response(
        output,
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename={username}_academics.csv"}
    )
