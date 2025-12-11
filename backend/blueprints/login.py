from flask import Blueprint, request, jsonify, session
from pymongo import MongoClient

login = Blueprint("login", __name__)

# -------------------------------
# MongoDB Setup
# -------------------------------
client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]

users_collection = mongo_db["users"]
mentors_collection = mongo_db["mentors"]
admin_collection = mongo_db["admin"]

# -------------------------------
# LOGIN ROUTE
# -------------------------------
@login.route('/login', methods=['POST'])
def login_user():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("dob")  # as per your code
    user_type = data.get("user_type")

    if not username or not password or not user_type:
        return jsonify({"success": False, "message": "All fields required"}), 400

    try:
        user = None
        redirect_url = "/"

        # ---------------------------
        # STUDENT LOGIN
        # ---------------------------
        if user_type == "student":
            user = users_collection.find_one({"username": username, "password": password})
            redirect_url = "/student"

        # ---------------------------
        # MENTOR LOGIN
        # ---------------------------
        elif user_type == "mentor":
            user = mentors_collection.find_one({"username": username, "password": password})
            redirect_url = "/mentor"

        # ---------------------------
        # ADMIN LOGIN
        # ---------------------------
        elif user_type == "admin":
            user = admin_collection.find_one({"username": username, "password": password})
            redirect_url = "/admin"

        # ---------------------------
        if user:
            # Save session
            session['username'] = user.get("username")
            session['user_type'] = user_type
            session['name'] = user.get("name")
            session['phno'] = user.get("phno") or user.get("phone", "")

            return jsonify({
                "success": True,
                "message": f"{user_type.capitalize()} login successful",
                "redirect": redirect_url,
                "user": {
                    "name": user.get("name"),
                    "username": user.get("username"),
                    "phno": user.get("phno") or user.get("phone", ""),
                    "type": user_type
                }
            })

        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    except Exception as e:
        print("MongoDB error:", e)
        return jsonify({"success": False, "message": "Database query failed"}), 500
