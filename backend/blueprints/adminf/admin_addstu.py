from flask import Blueprint, request, jsonify
from pymongo import MongoClient

addstu_bp = Blueprint("addstu_bp", __name__)

client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
student_collection = db["users"]

@addstu_bp.route("/add_student", methods=["POST"])
def add_student():
    try:
        data = request.get_json()

        # Auto-increment id
        last_student = student_collection.find_one(sort=[("id", -1)])
        new_id = last_student["id"] + 1 if last_student else 1

        student = {
            "id": new_id,
            "name": data.get("name"),
            "username": data.get("maatramId"),      # Maatram ID
            "password": data.get("dob"),             # DOB stored as password
            "phno": data.get("phone"),
            "assigned_mentor": None
        }

        if not student["name"] or not student["username"]:
            return jsonify({"message": "Required fields missing"}), 400

        student_collection.insert_one(student)

        return jsonify({
            "status": "success",
            "message": "Student added successfully",
            "student_id": new_id
        }), 201

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
