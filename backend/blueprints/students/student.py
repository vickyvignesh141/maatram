from flask import Blueprint, jsonify, session
from pymongo import MongoClient

student = Blueprint("student", __name__)

client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]
users_collection = mongo_db["users"]
tests_col = mongo_db["subject_tests"]

# Get student info
@student.route("/get_student/<username>", methods=["GET"])
def get_student(username):
    user = users_collection.find_one({"username": username}, {"_id": 0})
    if user:
        return jsonify({"success": True, "data": user}), 200
    return jsonify({"success": False, "msg": "Student not found"}), 404


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
