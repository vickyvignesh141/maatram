# routes/student.py
from flask import Blueprint, jsonify, request, send_from_directory
from pymongo import MongoClient
from werkzeug.utils import secure_filename
import os
import uuid

student = Blueprint("student", __name__)  # no url_prefix so routes match your frontend paths

# ===== MONGO =====
client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]
users_collection = mongo_db["users"]
tests_col = mongo_db["subject_tests"]

# ===== CONFIG =====
BASE_DIR = os.path.dirname(os.path.abspath(__file__))         # e.g. /path/to/project/routes
PROJECT_ROOT = os.path.join(BASE_DIR, "..")                   # project root (one level up)
PROFILE_UPLOAD_ROOT = os.path.join(PROJECT_ROOT, "uploads", "profile_images")
RESUME_UPLOAD_ROOT = os.path.join(PROJECT_ROOT, "uploads", "resumes")

ALLOWED_IMAGE_EXT = {"png", "jpg", "jpeg"}
ALLOWED_DOC_EXT = {"pdf", "doc", "docx"}
MAX_FILE_SIZE_MB = 5  # optional, not enforced here but you can add checks if desired

# ===== HELPERS =====
def allowed_file(filename, allowed_ext):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_ext

def make_dirs(path):
    os.makedirs(path, exist_ok=True)
    return path

def save_uploaded_file(file_storage, upload_folder, username, allowed_ext):
    """
    Save uploaded file to uploads/<type>/<username>/<uuid>.<ext>
    Returns relative path (forward-slash) to store in DB, e.g. 'uploads/profile_images/john/abcd1234.jpg'
    """
    if not file_storage:
        return None
    filename = secure_filename(file_storage.filename)
    if not filename or not allowed_file(filename, allowed_ext):
        return None

    ext = filename.rsplit(".", 1)[1].lower()
    unique_name = f"{uuid.uuid4().hex}.{ext}"

    # relative path stored in DB should use forward slashes for URLs
    relative_path = f"uploads/{upload_folder}/{username}/{unique_name}"
    save_dir = os.path.join(PROJECT_ROOT, "uploads", upload_folder, username)
    make_dirs(save_dir)
    full_path = os.path.join(save_dir, unique_name)
    file_storage.save(full_path)

    return relative_path.replace("\\", "/")  # normalize on Windows


# ===== ROUTES =====

# Get basic student (legacy)
@student.route("/get_student/<username>", methods=["GET"])
def get_student(username):
    user = users_collection.find_one({"username": username}, {"_id": 0})
    if user:
        return jsonify({"success": True, "data": user}), 200
    return jsonify({"success": False, "msg": "Student not found"}), 404


# Get full student profile
@student.route("/student_profile/<username>", methods=["GET"])
def get_student_profile(username):
    profile = users_collection.find_one({"username": username}, {"_id": 0})
    if not profile:
        return jsonify({"success": False, "msg": "Profile not found"}), 404
    return jsonify({"success": True, "data": profile}), 200


# Save / update student profile (handles profile image & resume files)
# Save / update student profile (handles profile image & resume files)
@student.route("/student_profile", methods=["POST"])
def save_student_profile():
    data = request.form.to_dict()
    username = data.get("username")
    if not username:
        return jsonify({"success": False, "msg": "Username required"}), 400

    # Fetch existing user
    user = users_collection.find_one({"username": username})

    # ==== DELETE RESUME IF REQUESTED ====
    remove_resume = data.get("removeResume") == "true"
    if remove_resume and user and user.get("resumeImage"):
        resume_path = os.path.join(PROJECT_ROOT, user["resumeImage"])
        if os.path.exists(resume_path):
            os.remove(resume_path)

        # Remove field in MongoDB
        users_collection.update_one(
            {"username": username},
            {"$unset": {"resumeImage": ""}}
        )

    # ==== UPLOAD PROFILE IMAGE ====
    profile_image = request.files.get("profileImage")
    if profile_image:
        saved_profile = save_uploaded_file(profile_image, "profile_images", username, ALLOWED_IMAGE_EXT)
        if not saved_profile:
            return jsonify({"success": False, "msg": "Invalid profile image"}), 400
        data["profileImage"] = saved_profile

    # ==== UPLOAD RESUME ====
    resume = request.files.get("resumeImage")
    if resume:
        saved_resume = save_uploaded_file(resume, "resumes", username, ALLOWED_DOC_EXT)
        if not saved_resume:
            return jsonify({"success": False, "msg": "Invalid resume file"}), 400
        data["resumeImage"] = saved_resume

    # ==== UPDATE OTHER FIELDS ====
    # Remove 'removeResume' key if present
    data.pop("removeResume", None)

    # Save all fields to MongoDB (upsert: create if not exists)
    users_collection.update_one(
        {"username": username},
        {"$set": data},
        upsert=True
    )

    return jsonify({"success": True, "msg": "Profile saved successfully", "data": data}), 200


# Serve uploaded files (images/resumes) at: GET /uploads/<path:filepath>
# Example: GET /uploads/profile_images/john/abcd1234.jpg
@student.route("/uploads/<path:filepath>", methods=["GET"])
def serve_upload(filepath):
    # basic sanitization
    if ".." in filepath or filepath.startswith("/") or filepath.startswith("\\"):
        return jsonify({"success": False, "msg": "Invalid path"}), 400

    # ensure it points under the uploads folder
    uploads_root = os.path.join(PROJECT_ROOT)
    # send_from_directory will safely resolve the path
    try:
        return send_from_directory(uploads_root, filepath, as_attachment=False)
    except Exception:
        return jsonify({"success": False, "msg": "File not found"}), 404


@student.route("/student/progress/<student_id>", methods=["GET"])
def student_progress(student_id):
    tests = list(
        tests_col.find(
            {"student_id": student_id},
            {
                "_id": 0,
                "subject": 1,
                "percentage": 1,
                "date": 1,
                "level": 1,     # ✅ ADD THIS
                "score": 1      # ✅ ADD THIS (optional but useful)
            }
        ).sort("created_at", 1)  # better sorting
    )

    return jsonify({
        "success": True,
        "progress": tests
    }), 200