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

def is_valid_text(text: str) -> bool:
    if not text or not isinstance(text, str):
        return False

    text = text.strip()

    if len(text) < 3:
        return False

    # must contain letters
    if not re.search(r"[a-zA-Z]", text):
        return False

    # reject gibberish (vowel ratio)
    letters = re.findall(r"[a-zA-Z]", text.lower())
    if letters:
        vowels = sum(1 for c in letters if c in "aeiou")
        if vowels / len(letters) < 0.25:
            return False

    # reject repeated junk
    if re.fullmatch(r"(.)\1{3,}", text):
        return False

    return True

def is_legitimate_subject(subject: str) -> bool:
    prompt = f"""
Answer ONLY with YES or NO.

Is "{subject}" a real academic or professional subject that can be taught or tested?
Examples of valid subjects:
- Mathematics
- Physics
- Python Programming
- Data Structures
- Organic Chemistry
- History

Invalid:
- asdfgh
- bdffns
- randomword
"""

    try:
        response = call_llm(prompt, temperature=0)
        return response.strip().upper().startswith("YES")
    except:
        return False



# ==================================================
# 1️ Generate MCQs (NO DIAGNOSTIC)
# ==================================================
@subject_bp.route("/subject-test/mcq", methods=["POST"])
def generate_mcqs():
    try:
        data = request.json or {}
        subject = data.get("subject", "").strip()
        level = data.get("level", "").strip() or "Beginner"

        if not subject:
            return jsonify({
                "success": False,
                "msg": "Subject is required"
            }), 400

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

        # Call LLM
        raw = call_llm(prompt)
        raw = re.sub(r"```json|```", "", raw).strip()

        start, end = raw.find("["), raw.rfind("]")
        if start == -1 or end == -1:
            raise ValueError("Invalid JSON from LLM")

        mcqs = json.loads(raw[start:end + 1])

        # If LLM returned empty or invalid, fallback to default
        if not mcqs or not isinstance(mcqs, list):
            raise ValueError("Empty MCQs")

    except Exception as e:
        print("MCQ ERROR:", e)
        # Fallback placeholder MCQs
        mcqs = [
            {
                "question": f"Placeholder question 1 about {subject}",
                "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
                "correct": "A"
            },
            {
                "question": f"Placeholder question 2 about {subject}",
                "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
                "correct": "B"
            },
            # ... up to 10 questions
        ]
        while len(mcqs) < 10:
            idx = len(mcqs) + 1
            mcqs.append({
                "question": f"Placeholder question {idx} about {subject}",
                "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
                "correct": "A"
            })

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

