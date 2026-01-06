from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import uuid

student_bookmark = Blueprint("student_bookmark", __name__)

# MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
notes_col = db["student_notes"]


@student_bookmark.route("/student/bookmark/add", methods=["POST"])
def add_note():
    data = request.json

    if not data.get("username") or not data.get("title"):
        return jsonify({"success": False, "message": "Missing fields"}), 400

    now = datetime.utcnow()

    note = {
        "note_id": str(uuid.uuid4()),
        "username": data["username"],
        "title": data["title"],
        "description": data.get("description", ""),
        "tags": data.get("tags", []),
        "date": now.strftime("%Y-%m-%d"),   # 🔒 SERVER DATE
        "created_at": now,
        "updated_at": now
    }

    notes_col.insert_one(note)

    return jsonify({"success": True, "message": "Note added"})


@student_bookmark.route("/student/bookmark/update", methods=["PUT"])
def update_note():
    data = request.json

    if not data.get("note_id") or not data.get("username"):
        return jsonify({"success": False, "message": "Missing fields"}), 400

    update_data = {
        "title": data.get("title"),
        "description": data.get("description", ""),
        "tags": data.get("tags", []),
        "updated_at": datetime.utcnow()   # 🔒 SERVER TIME
    }

    notes_col.update_one(
        {"note_id": data["note_id"], "username": data["username"]},
        {"$set": update_data}
    )

    return jsonify({"success": True, "message": "Note updated"})



@student_bookmark.route("/student/bookmark/delete", methods=["DELETE"])
def delete_note():
    data = request.json

    notes_col.delete_one({
        "note_id": data["note_id"],
        "username": data["username"]
    })

    return jsonify({"success": True, "message": "Note deleted"})


@student_bookmark.route("/student/bookmark/<username>", methods=["GET"])
def get_notes(username):
    notes = list(notes_col.find({"username": username}, {"_id": 0}))

    # Convert datetime to string
    for n in notes:
        n["created_at"] = n["created_at"].isoformat()
        n["updated_at"] = n["updated_at"].isoformat()

    return jsonify({
        "success": True,
        "notes": notes
    })
