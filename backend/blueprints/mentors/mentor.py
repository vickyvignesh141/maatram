# routes/mentor.py
from flask import Blueprint, jsonify, request, send_from_directory
from pymongo import MongoClient
from werkzeug.utils import secure_filename
import os
import uuid

mentor_bp = Blueprint("mentor", __name__)

# ================== MONGO ==================
client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]

users_collection = mongo_db["users"]        # students
mentors_collection = mongo_db["mentors"]    # mentors
admin_collection = mongo_db["admin"]

# ================== PATH CONFIG ==================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(BASE_DIR, "..")

PROFILE_UPLOAD_ROOT = os.path.join(
    PROJECT_ROOT, "uploads", "profile_images", "mentors"
)

ALLOWED_IMAGE_EXT = {"png", "jpg", "jpeg"}

# ================== HELPERS ==================
def allowed_file(filename, allowed_ext):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_ext


def make_dirs(path):
    os.makedirs(path, exist_ok=True)
    return path


def save_uploaded_file(file_storage, mentor_id):
    """
    Save mentor profile image to:
    uploads/profile_images/mentors/<mentor_id>/<uuid>.<ext>
    """
    if not file_storage:
        return None

    filename = secure_filename(file_storage.filename)
    if not filename or not allowed_file(filename, ALLOWED_IMAGE_EXT):
        return None

    ext = filename.rsplit(".", 1)[1].lower()
    unique_name = f"{uuid.uuid4().hex}.{ext}"

    save_dir = os.path.join(PROFILE_UPLOAD_ROOT, mentor_id)
    make_dirs(save_dir)

    full_path = os.path.join(save_dir, unique_name)
    file_storage.save(full_path)

    return f"uploads/profile_images/mentors/{mentor_id}/{unique_name}".replace("\\", "/")


# =====================================================
# ====================== ROUTES =======================
# =====================================================

# ✅ GET BASIC MENTOR (legacy)
@mentor_bp.route("/get_mentor/<username>", methods=["GET"])
def get_mentor(username):
    mentor = mentors_collection.find_one({"username": username}, {"_id": 0})
    if mentor:
        return jsonify({"success": True, "data": mentor}), 200
    return jsonify({"success": False, "msg": "Mentor not found"}), 404


# ✅ GET FULL MENTOR PROFILE
@mentor_bp.route("/mentor_profile/<username>", methods=["GET"])
def get_mentor_profile(username):
    profile = mentors_collection.find_one({"username": username}, {"_id": 0})
    if not profile:
        return jsonify({"success": False, "msg": "Profile not found"}), 404

    return jsonify({"success": True, "data": profile}), 200


# ✅ SAVE / UPDATE MENTOR PROFILE
@mentor_bp.route("/mentor_profile", methods=["POST"])
def save_mentor_profile():
    data = request.form.to_dict()

    username = data.get("username") or data.get("mentorId")
    if not username:
        return jsonify({"success": False, "msg": "Mentor username required"}), 400

    # fetch existing mentor
    mentor = mentors_collection.find_one({"username": username})

    # ================= PROFILE IMAGE =================
    profile_image = request.files.get("profileImage")
    if profile_image:
        saved_profile = save_uploaded_file(profile_image, username)
        if not saved_profile:
            return jsonify({
                "success": False,
                "msg": "Invalid profile image"
            }), 400
        data["profileImage"] = saved_profile

    # ================= CLEAN DATA =================
    data.pop("mentorId", None)   # frontend-only
    data["username"] = username # ensure username exists

    # ================= UPSERT =================
    mentors_collection.update_one(
        {"username": username},
        {"$set": data},
        upsert=True
    )

    return jsonify({
        "success": True,
        "msg": "Mentor profile saved successfully",
        "data": data
    }), 200


# ✅ SERVE UPLOADED FILES (same as student.py)
@mentor_bp.route("/uploads/<path:filepath>", methods=["GET"])
def serve_upload(filepath):
    if ".." in filepath or filepath.startswith("/") or filepath.startswith("\\"):
        return jsonify({"success": False, "msg": "Invalid path"}), 400

    uploads_root = os.path.join(PROJECT_ROOT)
    try:
        return send_from_directory(uploads_root, filepath, as_attachment=False)
    except Exception:
        return jsonify({"success": False, "msg": "File not found"}), 404


# ✅ GET STUDENTS ASSIGNED TO A MENTOR
@mentor_bp.route("/students/<mentor_username>", methods=["GET"])
def get_students_by_mentor(mentor_username):
    students = list(
        users_collection.find(
            {"assigned_mentor": mentor_username},
            {
                "_id": 0,
                "id": 1,
                "name": 1,
                "username": 1,
                "phno": 1
            }
        )
    )

    return jsonify({
        "success": True,
        "students": students
    }), 200


@mentor_bp.route("/mentor_profile/<username>", methods=["DELETE"])
def delete_mentor_profile(username):
    mentor = mentors_collection.find_one({"username": username})

    if not mentor:
        return jsonify({"success": False, "msg": "Mentor not found"}), 404

    # ===== DELETE PROFILE IMAGE FOLDER =====
    image_dir = os.path.join(PROJECT_ROOT, "uploads", "profile_images", "mentors", username)
    if os.path.exists(image_dir):
        for file in os.listdir(image_dir):
            try:
                os.remove(os.path.join(image_dir, file))
            except Exception:
                pass
        os.rmdir(image_dir)

    # ===== UNASSIGN STUDENTS =====
    users_collection.update_many(
        {"assigned_mentor": username},
        {"$unset": {"assigned_mentor": ""}}
    )

    # ===== DELETE MENTOR =====
    mentors_collection.delete_one({"username": username})

    return jsonify({
        "success": True,
        "msg": "Mentor profile deleted successfully"
    }), 200
