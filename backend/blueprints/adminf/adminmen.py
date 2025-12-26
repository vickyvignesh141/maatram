from flask import Blueprint, jsonify
from pymongo import MongoClient

adminmen_bp = Blueprint("adminmentor", __name__)

# MongoDB setup (same style as your project)
client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]

mentors_collection = mongo_db["mentors"]
users_collection = mongo_db["users"]   # students collection

@adminmen_bp.route("/admin/mentors", methods=["GET"])
def get_all_mentors():
    mentors = mentors_collection.find({}, {"_id": 0})

    mentors_list = []

    for mentor in mentors:
        mentor_username = mentor.get("username")

        # 🔹 COUNT students assigned to this mentor
        student_count = users_collection.count_documents({
            "assigned_mentor": mentor_username
        })

        mentors_list.append({
            "id": mentor.get("id"),
            "name": mentor.get("name"),
            "username": mentor.get("username"),
            "phone": mentor.get("phone"),
            "student_count": student_count   # 👈 NEW FIELD
        })

    return jsonify({
        "success": True,
        "data": mentors_list
    }), 200
