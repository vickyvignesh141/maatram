from flask import Blueprint, request, jsonify
from pymongo import MongoClient

addmen_bp = Blueprint("addmen_bp", __name__)

client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
mentor_collection = db["mentors"]

@addmen_bp.route("/add_mentor", methods=["POST"])
def add_mentor():
    try:
        data = request.get_json()

        mentor = {
            "mentor_name": data.get("name"),   # ✅ FIX HERE
            "dob": data.get("dob"),
            "maatram_id": data.get("maatramId"),
            "phone": data.get("phone"),
            "email": data.get("email")
        }

        if not mentor["mentor_name"]:
            return jsonify({"message": "Mentor name is required"}), 400

        mentor_collection.insert_one(mentor)

        return jsonify({
            "status": "success",
            "message": "Mentor added successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
