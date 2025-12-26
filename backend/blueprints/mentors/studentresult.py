from flask import Blueprint, jsonify
from pymongo import MongoClient

# Blueprint
result_bp = Blueprint("studentresult", __name__)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]

users_collection = db["users"]
subject_collection = db["subject_tests"]

# ✅ Mentor → single student progress + graph data
@result_bp.route("/mentor/student/<student_id>/progress", methods=["GET"])
def get_student_progress(student_id):
    # Use 'student_id' from DB
    tests = list(
        subject_collection.find(
            {
                "$or": [
                    {"student_id": student_id},
                    {"username": student_id}
                ]
            },
            {"_id": 0}
        )
    )



    # Prepare graph data
    graph_data = {}
    if tests:
        subjects = [test["subject"] for test in tests]
        scores = [test["score"] for test in tests]
        percentages = [test["percentage"] for test in tests]
        graph_data = {
            "subjects": subjects,
            "scores": scores,
            "percentages": percentages
        }

    return jsonify({
        "success": True,
        "student_id": student_id,
        "tests": tests,
        "graph": graph_data
    })