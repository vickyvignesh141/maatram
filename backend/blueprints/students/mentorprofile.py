from flask import Blueprint, jsonify
from pymongo import MongoClient

# ================== Blueprint ==================
mendetails_bp = Blueprint("mendetails_bp", __name__)

# ================== MongoDB ==================
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
mentors_collection = db["mentors"]

# ================== API ==================
@mendetails_bp.route("/mentor_profile/<mentor_username>", methods=["GET"])
def get_mentor_profile(mentor_username):
    """
    Fetch a mentor's profile by username.
    Public access, no authentication required.
    """
    mentor = mentors_collection.find_one({"username": mentor_username})

    if not mentor:
        return jsonify({
            "success": False,
            "msg": f"Mentor with username '{mentor_username}' not found"
        }), 404

    # Prepare mentor data safely
    mentor_data = {
        "name": mentor.get("name", "Not Provided"),
        "username": mentor.get("username", "Not Provided"),
        "email": mentor.get("email", "Not Provided"),
        "phoneNumber": mentor.get("phoneNumber", "Not Provided"),
        "dateOfBirth": mentor.get("dateOfBirth", "Not Provided"),
        "collegeName": mentor.get("collegeName", "Not Provided"),
        "workingCompany": mentor.get("workingCompany", "Not Provided"),
        "role": mentor.get("role") or mentor.get("customRole", "Not Provided"),
        "companyAddress": mentor.get("companyAddress", "Not Provided"),
        "homeAddress": mentor.get("homeAddress", "Not Provided"),
        "yearOfPassedOut": mentor.get("yearOfPassedOut", "Not Provided"),
        "yearsOfExperience": mentor.get("yearsOfExperience", "Not Provided"),
        "expertise": mentor.get("expertise", "Not Provided"),
        "linkedinId": mentor.get("linkedinId", ""),
        "githubId": mentor.get("githubId", ""),
        "portfolioLink": mentor.get("portfolioLink", ""),
        "profileImage": mentor.get("profileImage", "")
    }

    return jsonify({
        "success": True,
        "data": mentor_data
    }), 200
