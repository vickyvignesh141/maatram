from flask import Blueprint, request, jsonify
from pymongo import MongoClient

mentor_assign_bp = Blueprint("mentor_assign", __name__)

# ---------------- MongoDB Connection ----------------
client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]

users_collection = mongo_db["users"]
mentors_collection = mongo_db["mentors"]

MAX_STUDENTS = 25  # maximum students per mentor

# ---------------------------------------------------
# Get all mentors with assigned count
# ---------------------------------------------------
@mentor_assign_bp.route("/mentors", methods=["GET"])
def get_all_mentors():
    mentors = []

    for mentor in mentors_collection.find({}, {"password": 0}):
        username = mentor.get("username")

        # ✅ COUNT BOTH assignedMentor & assigned_mentor
        student_count = users_collection.count_documents({
            "$or": [
                {"assignedMentor": username},
                {"assigned_mentor": username}
            ]
        })

        # ✅ FETCH assigned students correctly
        assigned_students = [
            u["username"]
            for u in users_collection.find(
                {
                    "$or": [
                        {"assignedMentor": username},
                        {"assigned_mentor": username}
                    ]
                },
                {"username": 1, "_id": 0}
            )
        ]

        mentor_data = {
            "username": username,
            "name": mentor.get("name", ""),
            "email": mentor.get("email", ""),
            "currentStudents": student_count,
            "maxStudents": MAX_STUDENTS,
            "students": assigned_students,
        }

        mentors.append(mentor_data)

    return jsonify({"success": True, "mentors": mentors})


# ---------------------------------------------------
# Get unassigned students
# ---------------------------------------------------
@mentor_assign_bp.route("/students/unassigned", methods=["GET"])
def get_unassigned_students():
    students = list(
        users_collection.find(
            {
                "$or": [
                    {"assignedMentor": ""},
                    {"assignedMentor": None},
                    {"assigned_mentor": ""},
                    {"assigned_mentor": None}
                ]
            },
            {"_id": 0, "username": 1, "name": 1, "collegeName": 1}
        )
    )

    # Normalize fields for frontend
    for s in students:
        s["college"] = s.pop("collegeName", "")
        s["studentId"] = s["username"]
        s["id"] = s["username"]

    return jsonify({"success": True, "students": students})


# ---------------------------------------------------
# Assign students to mentor
# ---------------------------------------------------
@mentor_assign_bp.route("/assign", methods=["POST"])
def assign_students_to_mentor():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"success": False, "message": "JSON body required"}), 400

    mentor_username = data.get("mentorUsername")
    student_usernames = data.get("studentUsernames", [])

    if not mentor_username or not isinstance(student_usernames, list):
        return jsonify({"success": False, "message": "Invalid data"}), 400

    mentor = mentors_collection.find_one({"username": mentor_username})
    if not mentor:
        return jsonify({"success": False, "message": "Mentor not found"}), 404

    # ✅ Correct capacity check
    current_students = users_collection.count_documents({
        "$or": [
            {"assignedMentor": mentor_username},
            {"assigned_mentor": mentor_username}
        ]
    })

    if current_students + len(student_usernames) > MAX_STUDENTS:
        return jsonify({
            "success": False,
            "message": "Mentor capacity exceeded"
        }), 400

    # ✅ UPDATE BOTH FIELDS
    users_collection.update_many(
        {"username": {"$in": student_usernames}},
        {"$set": {
            "assignedMentor": mentor_username,
            "assigned_mentor": mentor_username
        }}
    )

    return jsonify({
        "success": True,
        "message": "Students assigned successfully"
    })


# ---------------------------------------------------
# Unassign student
# ---------------------------------------------------
@mentor_assign_bp.route("/unassign", methods=["POST"])
def unassign_student():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"success": False, "message": "JSON body required"}), 400

    mentor_username = data.get("mentorUsername")
    student_username = data.get("studentUsername")

    if not mentor_username or not student_username:
        return jsonify({"success": False, "message": "Invalid data"}), 400

    # ✅ CLEAR BOTH FIELDS
    users_collection.update_one(
        {"username": student_username},
        {"$set": {
            "assignedMentor": "",
            "assigned_mentor": ""
        }}
    )

    return jsonify({
        "success": True,
        "message": "Student unassigned successfully"
    })
