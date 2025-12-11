from flask import Blueprint, jsonify, session
from pymongo import MongoClient

student = Blueprint("student", __name__)

client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]
users_collection = mongo_db["users"]

@student.route("/student/profile", methods=["GET"])
def student_profile():
    if "username" not in session:
        return jsonify({"success": False, "message": "Not logged in"}), 401

    username = session["username"]
    user = users_collection.find_one({"username": username})

    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    return jsonify({
        "success": True,
        "user": {
            "name": user.get("name"),
            "username": user.get("username"),
            "assigned_mentor": user.get("assigned_mentor", ""),
            "phno": user.get("phno", ""),
            "photo": user.get("photo", "")
        }
    })
