from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from groq import Groq
from datetime import datetime
import json, re, os
from dotenv import load_dotenv

load_dotenv()

subject_bp = Blueprint("subject_test", __name__)

# -------------------- MongoDB --------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance_mongo"]
test_collection = db["subject_tests"]

# -------------------- Groq --------------------
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def call_llm(prompt, temperature=0.3):
    res = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature
    )
    return res.choices[0].message.content.strip()


# ==================================================
# 1️ Generate MCQs (NO DIAGNOSTIC)
# ==================================================
@subject_bp.route("/subject-test/mcq", methods=["POST"])
def generate_mcqs():
    data = request.json
    subject = data.get("subject")
    level = data.get("level")

    if not subject or not level:
        return jsonify({"success": False, "msg": "Subject and level required"}), 400

    if level not in ["Beginner", "Intermediate", "Hard"]:
        level = "Beginner"

    prompt = f"""
You are a professional exam question designer.

Create exactly 10 MCQs ONLY about {subject}.
Difficulty: {level}

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No explanation text
- JSON must start with [ and end with ]

FORMAT:
[
  {{
    "question": "Question text",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correct": "A"
  }}
]
"""

    raw = call_llm(prompt)
    raw = re.sub(r"```json|```", "", raw).strip()

    start, end = raw.find("["), raw.rfind("]")
    if start == -1 or end == -1:
        return jsonify({"success": False, "error": "Invalid AI response"}), 500

    try:
        mcqs = json.loads(raw[start:end + 1])
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    return jsonify({
        "success": True,
        "mcqs": mcqs
    })


# ==================================================
# 2️ Submit Test & Store Result
# ==================================================
# from datetime import datetime

@subject_bp.route("/subject-test/submit", methods=["POST"])
def submit_test():
    data = request.json

    student_id = data.get("student_id")
    subject = data.get("subject")
    level = data.get("level")
    mcqs = data.get("mcqs")
    user_answers = data.get("answers")

    if not all([student_id, subject, level, mcqs, user_answers]):
        return jsonify({"success": False, "msg": "Incomplete submission"}), 400

    score = 0
    for i, q in enumerate(mcqs):
        if user_answers.get(str(i)) == q.get("correct"):
            score += 1

    percentage = round((score / len(mcqs)) * 100, 2)

    # ✅ Date & Time
    now = datetime.utcnow()

    test_collection.insert_one({
        "student_id": student_id,
        "subject": subject,
        "level": level,
        "score": score,
        "percentage": percentage,

        # ⏱ DATE & TIME
        "date": now.strftime("%d-%m-%Y"),
        "time": now.strftime("%I:%M %p"),
        "created_at": now
    })

    return jsonify({
        "success": True,
        "score": score,
        "percentage": percentage
    })

@subject_bp.route("/subject-test/history/<student_id>", methods=["GET"])
def get_test_history(student_id):
    tests = list(test_collection.find(
        {"student_id": student_id},
        {"_id": 0}
    ).sort("created_at", -1))

    return jsonify({
        "success": True,
        "history": tests
    })

