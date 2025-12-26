from flask import Blueprint, jsonify
from pymongo import MongoClient

adminstu_bp = Blueprint("adminstu", __name__)

# MongoDB setup (SAME AS admin.py)
client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]

users_collection = mongo_db["users"]

@adminstu_bp.route("/admin/users", methods=["GET"])
def get_all_users():
    users = users_collection.find({}, {"_id": 0})  # exclude _id if not needed

    users_list = []
    for user in users:
        users_list.append({
            "id": user.get("id"),
            "name": user.get("name"),
            "username": user.get("username"),
            "phno": user.get("phno"),
            "assigned_mentor": user.get("assigned_mentor"),
            "photo": user.get("photo")
        })

    return jsonify({"success": True, "data": users_list}), 200
