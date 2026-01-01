from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime

student_notes_bp = Blueprint(
    "student_notes",
    __name__,
    url_prefix="/api"
)

client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
users_collection = db["users"]


@student_notes_bp.route("/student/bookmark/<username>", methods=["GET"])
def get_notes(username):
    user = users_collection.find_one(
        {"username": username},
        {"_id": 0, "notes": 1}
    )

    return jsonify({
        "success": True,
        "notes": user.get("notes", []) if user else []
    })


@student_notes_bp.route("/student/bookmark/add", methods=["POST"])
def add_note():
    data = request.json

    username = data.get("username")
    title = data.get("title")
    description = data.get("description", "")
    date = data.get("date")
    tags = data.get("tags", [])

    if not all([username, title, date]):
        return jsonify({
            "success": False,
            "msg": "Username, title and date are required"
        }), 400

    note = {
        "note_id": int(datetime.utcnow().timestamp() * 1000),
        "title": title,
        "description": description,
        "date": date,
        "tags": tags,
        "created_at": datetime.utcnow()
    }

    result = users_collection.update_one(
        {"username": username},
        {"$push": {"notes": note}}
    )

    if result.matched_count == 0:
        return jsonify({
            "success": False,
            "msg": "User not found"
        }), 404

    return jsonify({
        "success": True,
        "msg": "Note added successfully"
    })


@student_notes_bp.route("/student/bookmark/update", methods=["PUT"])
def update_note():
    data = request.json

    username = data.get("username")
    note_id = data.get("note_id")
    title = data.get("title")
    description = data.get("description", "")
    date = data.get("date")
    tags = data.get("tags", [])

    if not all([username, note_id, title, date]):
        return jsonify({"success": False, "msg": "Incomplete data"}), 400

    users_collection.update_one(
        {
            "username": username,
            "notes.note_id": note_id
        },
        {
            "$set": {
                "notes.$.title": title,
                "notes.$.description": description,
                "notes.$.date": date,
                "notes.$.tags": tags,
                "notes.$.updated_at": datetime.utcnow()
            }
        }
    )

    return jsonify({"success": True, "msg": "Note updated"})


@student_notes_bp.route("/student/bookmark/delete", methods=["DELETE"])
def delete_note():
    data = request.json

    username = data.get("username")
    note_id = data.get("note_id")

    if not all([username, note_id]):
        return jsonify({"success": False, "msg": "Missing data"}), 400

    users_collection.update_one(
        {"username": username},
        {"$pull": {"notes": {"note_id": note_id}}}
    )

    return jsonify({"success": True, "msg": "Note deleted"})
