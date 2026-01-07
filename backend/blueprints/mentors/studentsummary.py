from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import json
import os
from groq import Groq
from dotenv import load_dotenv

# -------------------- ENV --------------------
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# -------------------- BLUEPRINT --------------------
summary_bp = Blueprint("summary_bp", __name__, url_prefix="/summary")

# -------------------- DB --------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]

users = db.users                  # student profile
career = db.career_progress       # career info
tests = db.subject_tests          # test marks
wallet = db.studentwallet         # certificates
summaries = db.student_summaries  # AI summaries

# -------------------- GROQ --------------------
groq_client = Groq(api_key=GROQ_API_KEY)
MODEL = "llama-3.3-70b-versatile"

def generate_ai_summary(prompt: str) -> dict:
    response = groq_client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an academic mentor assistant. "
                    "Summarize student data clearly for mentors. "
                    "Respond ONLY in valid JSON."
                )
            },
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=700
    )
    return json.loads(response.choices[0].message.content)

# -------------------- SUMMARY AGENT --------------------
def generate_student_summary(username: str):
    profile = users.find_one({"username": username}, {"_id": 0})
    career_data = list(career.find({"username": username}, {"_id": 0}))
    test_data = list(tests.find({"username": username}, {"_id": 0}))
    cert_data = list(wallet.find({"username": username}, {"_id": 0}))

    prompt = f"""
Student Profile:
{profile}

Career Progress:
{career_data}

Test Marks:
{test_data}

Certificates:
{cert_data}

Return JSON:
{{
  "profile_summary": "",
  "career_summary": "",
  "performance_summary": "",
  "certificates_summary": "",
  "overall_summary": ""
}}
"""

    summary = generate_ai_summary(prompt)

    summaries.update_one(
        {"username": username},
        {"$set": {
            **summary,
            "last_updated": datetime.utcnow()
        }},
        upsert=True
    )

# -------------------- ROUTES --------------------

@summary_bp.route("/student-update", methods=["POST"])
def student_update():
    data = request.json
    username = data["username"]

    users.update_one(
        {"username": username},
        {"$set": data},
        upsert=True
    )

    # 🔥 Auto-generate summary
    generate_student_summary(username)

    return jsonify({"message": "Student updated & summary generated"})


@summary_bp.route("/mentor-view/<username>", methods=["GET"])
def mentor_view(username):
    summary = summaries.find_one(
        {"username": username},
        {"_id": 0}
    )
    return jsonify(summary)
