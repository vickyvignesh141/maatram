from flask import Blueprint, jsonify
from pymongo import MongoClient

studetails_bp = Blueprint("studetails_bp", __name__)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
users_collection = db["users"]

@studetails_bp.route("/mentor/view-student/<username>", methods=["GET"])
def mentor_view_student(username):
    """
    Fetch student details without authentication.
    """
    # Fetch student by username
    student = users_collection.find_one({"username": username})

    if not student:
        return jsonify({"success": False, "msg": "Student not found"}), 404

    # Build a safe student response
    student_data = {
        "id": str(student.get("_id", "")),  # convert ObjectId to string
        "name": student.get("name", ""),
        "username": student.get("username", ""),
        "email": student.get("email", ""),
        "phoneNumber": student.get("phoneNumber", student.get("phno", "")),
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
        "profileImage": student.get("profileImage", student.get("photo", "")),
        "resumeImage": student.get("resumeImage", ""),
        "assignedMentor": student.get("assignedMentor", student.get("assigned_mentor", ""))
    }

    return jsonify({"success": True, "data": student_data})
