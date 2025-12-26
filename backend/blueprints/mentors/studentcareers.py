from flask import Blueprint, jsonify
from pymongo import MongoClient

careers_bp = Blueprint("studentcareer", __name__)

client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
career_collection = db["career_progress"]

@careers_bp.route("/mentor/student/<username>/career", methods=["GET"])
def get_student_career(username):
    student = career_collection.find_one({"username": username})

    if not student:
        return jsonify({
            "success": False,
            "message": "No career data found for this student"
        }), 404

    student.pop("_id", None)

    return jsonify({
        "success": True,
        "username": username,
        "career_data": student
    })
