from flask import Blueprint, request, jsonify
from ddgs import DDGS
import re
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

# ===============================
# MongoDB Configuration
# ===============================
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
study_guide_collection = db["study_guides"]

# ===============================
# Blueprint
# ===============================
studymat_bp = Blueprint("study_bp", __name__)

# ===============================
# Helper: Certification Courses
# ===============================
def get_dynamic_certification_courses(subject):
    results = []
    query = f"{subject} certification course online 2024 2025"

    with DDGS() as ddgs:
        for r in ddgs.text(query, max_results=30):
            title = r["title"].lower()
            link = r["href"]

            if subject.lower() not in title:
                continue
            if not link.startswith("http"):
                continue

            if len(results) < 3:
                results.append({
                    "title": r["title"],
                    "link": link
                })

    return results


# ===============================
# Helper: YouTube Courses
# ===============================
def get_dynamic_youtube_courses(subject):
    results = []
    query = f"site:youtube.com {subject} full course 2024 2025"

    with DDGS() as ddgs:
        for r in ddgs.text(query, max_results=40):
            title = r["title"].lower()
            link = r["href"]

            if subject.lower() not in title:
                continue
            if not re.search(r"full|complete|course|tutorial", title):
                continue

            if len(results) < 3:
                results.append({
                    "title": r["title"],
                    "link": link
                })

    return results


# ===============================
# 1️⃣ Generate + Save Study Guide
# ===============================
@studymat_bp.route("/guide", methods=["GET"])
def show_study_guide():
    subject = request.args.get("subject")
    username = request.args.get("username")

    if not subject or not username:
        return jsonify({
            "error": "subject and username are required"
        }), 400

    subject = subject.lower().strip()

    courses = get_dynamic_certification_courses(subject)
    videos = get_dynamic_youtube_courses(subject)

    guide_data = {
        "username": username,
        "subject": subject,
        "certification_courses": courses,
        "youtube_courses": videos,
        "createdAt": datetime.utcnow()
    }

    # Save only once per user + subject
    existing = study_guide_collection.find_one({
        "username": username,
        "subject": subject
    })

    if not existing:
        study_guide_collection.insert_one(guide_data)

    return jsonify({
        "username": username,
        "subject": subject,
        "certification_courses": courses,
        "youtube_courses": videos
    })


# ===============================
# 2️⃣ Get Saved Guides (User-wise)
# ===============================
@studymat_bp.route("/saved-guides", methods=["GET"])
def get_saved_guides():
    username = request.args.get("username")

    if not username:
        return jsonify({"error": "username is required"}), 400

    guides = []
    for guide in study_guide_collection.find({"username": username}):
        guide["_id"] = str(guide["_id"])
        guides.append(guide)

    return jsonify(guides)


# ===============================
# 3️⃣ Delete Study Guide
# ===============================
@studymat_bp.route("/saved-guides/<id>", methods=["DELETE"])
def delete_saved_guide(id):
    username = request.args.get("username")

    if not username:
        return jsonify({"error": "username is required"}), 400

    try:
        result = study_guide_collection.delete_one({
            "_id": ObjectId(id),
            "username": username
        })

        if result.deleted_count == 0:
            return jsonify({"error": "Guide not found"}), 404

        return jsonify({"message": "Guide deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
