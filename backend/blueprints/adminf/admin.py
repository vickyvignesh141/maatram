from flask import Blueprint, request, jsonify,session
from pymongo import MongoClient

admin_bp = Blueprint("admin", __name__)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]

users_collection = mongo_db["users"]
mentors_collection = mongo_db["mentors"]
admin_collection = mongo_db["admin"]

@admin_bp.route("/get_admin/<username>", methods=["GET"])
def get_student(username):
    user = admin_collection.find_one({"username": username}, {"_id": 0})
    if user:
        return jsonify({"success": True, "data": user}), 200
    return jsonify({"success": False, "msg": "Admin not found"}), 404
