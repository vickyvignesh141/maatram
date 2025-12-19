from flask import Blueprint, jsonify, session
from pymongo import MongoClient

mentor_bp = Blueprint("mentor", __name__)

client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]
users_collection = mongo_db["users"]
mentors_collection = mongo_db["mentors"]
admin_collection = mongo_db["admin"]


# Get student info
@mentor_bp.route("/get_mentor/<username>", methods=["GET"])
def get_student(username):
    user = mentors_collection.find_one({"username": username}, {"_id": 0})
    if user:
        return jsonify({"success": True, "data": user}), 200
    return jsonify({"success": False, "msg": "Student not found"}), 404


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
    })


