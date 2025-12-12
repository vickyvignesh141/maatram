from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]

users_collection = mongo_db["users"]
mentors_collection = mongo_db["mentors"]
admin_collection = mongo_db["admin"]


# Helper function to validate login
def verify_login(collection, username, password):
    user = collection.find_one({"username": username})
    
    if user and user.get("password") == password:
        return True
    return False


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")
    user_type = data.get("userType")

    if not username or not password or not user_type:
        return jsonify({"success": False, "msg": "Missing fields"}), 400

    # Select collection based on user type
    if user_type == "Student":
        col = users_collection
    elif user_type == "Mentor":
        col = mentors_collection
    elif user_type == "Admin":
        col = admin_collection
    else:
        return jsonify({"success": False, "msg": "Invalid user type"}), 400

    # Verify login
    if verify_login(col, username, password):
        return jsonify({"success": True, "msg": "Login successful"}), 200
    else:
        return jsonify({"success": False, "msg": "Invalid credentials"}), 401
    
@app.route("/get_student/<username>", methods=["GET"])
def get_student(username):
    user = users_collection.find_one({"username": username}, {"_id": 0})
    
    if user:
        return jsonify({"success": True, "data": user}), 200
    else:
        return jsonify({"success": False, "msg": "Student not found"}), 404



if __name__ == "__main__":
    app.run(debug=True)
