from flask import Blueprint, jsonify, session
from pymongo import MongoClient

student = Blueprint("student", __name__)

client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]
users_collection = mongo_db["users"]

# Get student info
@student.route("/get_student/<username>", methods=["GET"])
def get_student(username):
    user = users_collection.find_one({"username": username}, {"_id": 0})
    if user:
        return jsonify({"success": True, "data": user}), 200
    return jsonify({"success": False, "msg": "Student not found"}), 404
