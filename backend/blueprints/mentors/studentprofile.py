from flask import Blueprint, jsonify, request,session
from pymongo import MongoClient
from bson import ObjectId

studetails_bp = Blueprint("studetails_bp", __name__)

# ================== MongoDB ==================
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]

users_collection = db["users"]      # students
mentors_collection = db["mentors"]  # mentors


# ================== API ==================
@studetails_bp.route("/mentor/view-student/<username>", methods=["GET"])
def mentor_view_student(username):
    """
    Mentor can view ONLY their assigned student's profile
    """

    # 1️⃣ Get mentor from header
    mentor_username = request.headers.get("Authorization")

    if not mentor_username:
        return jsonify({
            "success": False,
            "msg": "Mentor not logged in"
        }), 401

    # 2️⃣ Validate mentor
    mentor = mentors_collection.find_one({"username": mentor_username})
    if not mentor:
        return jsonify({
            "success": False,
            "msg": "Invalid mentor"
        }), 403

    # 3️⃣ Find assigned student
    student = users_collection.find_one({
        "username": username,
        "$or": [
            {"assignedMentor": mentor_username},
            {"assigned_mentor": mentor_username}
        ]
    })

    if not student:
        return jsonify({
            "success": False,
            "msg": "Student not assigned to this mentor"
        }), 403

    # 4️⃣ Build response safely
    student_data = {
        "id": str(student.get("_id", "")),
        "name": student.get("name", ""),
        "username": student.get("username", ""),
        "email": student.get("email", ""),
        "phoneNumber": student.get("phoneNumber") or student.get("phno", ""),
        "dateOfBirth": student.get("dateOfBirth", ""),
        "address": student.get("address", ""),
        "collegeName": student.get("collegeName", ""),
        "department": student.get("department", ""),
        "program": student.get("program", ""),
        "batchYear": student.get("batchYear", ""),
        "currentYear": student.get("currentYear", ""),
        "semester": student.get("semester", ""),
        "linkedinId": student.get("linkedinId", ""),
        "githubId": student.get("githubId", ""),
        "otherProfile": student.get("otherProfile", ""),
        "profileImage": student.get("profileImage", ""),
        "resumeImage": student.get("resumeImage", ""),
        "assignedMentor": student.get("assignedMentor") or student.get("assigned_mentor", "")
    }

    return jsonify({
        "success": True,
        "data": student_data
    })
