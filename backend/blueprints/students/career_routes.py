import os
import json
import re
from flask import Blueprint, request, jsonify
from groq import Groq
from typing import List, Dict, Any
import logging
from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient


client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]
progress_collection = mongo_db["career_progress"]
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
career_bp = Blueprint('career', __name__, url_prefix='/api/career')
load_dotenv()

# Configuration
# PROGRESS_FILE = r"C:\Users\prave\OneDrive\Documents\maatram\progress.json"
QUESTIONS = [
    "What subjects do you enjoy the most in school?",
    "What hobbies or activities do you like?",
    "Do you prefer working with people, technology, or ideas?",
    "Do you like creative or analytical tasks more?",
    "What are your strengths or skills?",
    "Do you have any career ideas in mind already?",
    "Currently pursuing degree and course?"
]

FALLBACK_TOPICS = {
    "Research and Development Engineer": ["Materials Science", "CAD Design", "Prototyping", "Research Methods", "Python/MATLAB"],
    "Product Designer": ["Design Fundamentals", "CAD/Sketching", "User Research", "Prototyping", "Materials"],
    "Innovation Consultant": ["Design Thinking", "Problem Framing", "Market Research", "Rapid Prototyping", "Presentation Skills"],
    "Software Engineer": ["Data Structures", "Algorithms", "Database Systems", "Web Development", "System Design"],
    "Data Scientist": ["Statistics", "Machine Learning", "Python/R Programming", "Data Visualization", "SQL"],
    "Doctor": ["Biology", "Chemistry", "Anatomy", "Physiology", "Medical Ethics"],
    "Teacher": ["Educational Psychology", "Curriculum Design", "Classroom Management", "Subject Expertise", "Communication"],
    "Business Analyst": ["Business Intelligence", "Data Analysis", "Requirement Gathering", "Process Modeling", "SQL/Excel"],
    "Graphic Designer": ["Color Theory", "Typography", "Design Software", "User Interface Design", "Branding"]
}

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class CareerAgent:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        self.client = Groq(api_key=self.groq_api_key)
    
    def safe_split_topics(self, text: str) -> List[str]:
        """Safely split topics from a comma-separated string"""
        if not text:
            return []
        if "," in text:
            parts = [p.strip() for p in text.split(",") if p.strip()]
        elif "\n" in text:
            parts = [p.strip() for p in text.split("\n") if p.strip()]
        elif ";" in text:
            parts = [p.strip() for p in text.split(";") if p.strip()]
        else:
            parts = [text.strip()]
        return parts
    
    def get_career_recommendations(self, student_responses: Dict[str, str]) -> Dict[str, Any]:
        """Generate career recommendations based on student responses"""
        prompt = """You are a professional career counselor. A student answered these questions:

{responses}

Based on this, provide:
1. Three suitable career paths with brief explanations
2. Top recommended career with detailed reasoning
3. Learning path overview for the top career

Format your response as JSON with this structure:
{{
    "career_options": [
        {{"name": "Career Name", "description": "Why it fits", "match_score": 85}},
        {{"name": "Career Name", "description": "Why it fits", "match_score": 78}},
        {{"name": "Career Name", "description": "Why it fits", "match_score": 92}}
    ],
    "top_recommendation": {{
        "career": "Career Name",
        "reasoning": "Detailed explanation",
        "short_term_plan": "6-12 month plan steps"
    }},
    "suggested_topics": ["Topic1", "Topic2", "Topic3", "Topic4", "Topic5","Topic6"]
}}""".format(responses="\n".join([f"{q}: {a}" for q, a in student_responses.items()]))
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful career guidance assistant. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7
            )
            
            content = response.choices[0].message.content.strip()
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                # Fallback parsing
                return self.parse_career_response(content)
                
        except Exception as e:
            logger.error(f"Groq API error: {e}")
            return self.get_fallback_recommendations(student_responses)
    
    def parse_career_response(self, text: str) -> Dict[str, Any]:
        """Parse career response when JSON parsing fails"""
        # Simplified parsing logic
        careers = re.findall(r'\d+\.\s*\**(.*?)\**', text)
        
        if careers:
            career_options = []
            for i, career in enumerate(careers[:3]):
                career_options.append({
                    "name": career.strip(),
                    "description": f"Based on your interests and skills",
                    "match_score": 90 - (i * 5)
                })
            
            # Find top recommendation
            top_match = re.search(r'Top Recommended Career[:\-\s]*\**(.+?)\**', text, re.IGNORECASE)
            top_career = top_match.group(1).strip() if top_match else career_options[0]['name']
            
            return {
                "career_options": career_options,
                "top_recommendation": {
                    "career": top_career,
                    "reasoning": "This career aligns best with your interests and strengths",
                    "short_term_plan": "Start with foundation courses, build projects, and seek mentorship"
                },
                "suggested_topics": self.suggest_topics_for_career(top_career)
            }
        
        return self.get_fallback_recommendations({})
    
    def get_fallback_recommendations(self, responses: Dict[str, str]) -> Dict[str, Any]:
        """Provide fallback recommendations when API fails"""
        return {
            "career_options": [
                {"name": "Software Engineer", "description": "Great for problem solvers who enjoy technology", "match_score": 85},
                {"name": "Data Analyst", "description": "Ideal for analytical minds who enjoy working with data", "match_score": 78},
                {"name": "Product Manager", "description": "Perfect for those who enjoy both technology and working with people", "match_score": 72}
            ],
            "top_recommendation": {
                "career": "Software Engineer",
                "reasoning": "Based on your technical interests and problem-solving skills",
                "short_term_plan": "Learn programming fundamentals, build small projects, contribute to open source"
            },
            "suggested_topics": ["Programming Basics", "Data Structures", "Algorithms", "Web Development", "Version Control"]
        }
    
    def suggest_topics_for_career(self, career_name: str) -> List[str]:
        """Get suggested topics for a specific career"""
        # Check fallback topics first
        for key in FALLBACK_TOPICS:
            if key.lower() in career_name.lower():
                return FALLBACK_TOPICS[key]
        
        # Try to get from Groq
        prompt = f"List 5 essential learning topics someone should study to become a {career_name}. Return only a simple comma-separated list."
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a concise career skills advisor."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.3
            )
            content = response.choices[0].message.content.strip()
            topics = self.safe_split_topics(content)
            return topics[:5] if topics else []
        except Exception as e:
            logger.error(f"Topic suggestion error: {e}")
            # Generic fallback topics
            return ["Foundation Courses", "Specialized Skills", "Tools & Software", "Practical Projects", "Industry Knowledge"]
    
    def generate_study_plan(self, career: str, topics: List[str], 
                           known_topics: List[str], daily_hours: float, 
                           weekly_hours: float) -> Dict[str, Any]:
        """Generate a personalized study plan"""
        missing_topics = [t for t in topics if t not in known_topics]
        
        if not missing_topics:
            return {
                "status": "advanced",
                "message": "You already know all suggested topics! Consider advanced learning paths.",
                "topics": topics,
                "known_topics": known_topics
            }
        
        # Calculate time distribution
        time_per_topic_daily = round(daily_hours / len(missing_topics), 2) if daily_hours > 0 else 0
        time_per_topic_weekly = round(weekly_hours / len(missing_topics), 2) if weekly_hours > 0 else 0
        
        daily_schedule = {}
        for topic in missing_topics:
            daily_schedule[topic] = {
                "hours_per_day": time_per_topic_daily,
                "focus_areas": f"Study {topic} fundamentals and practice exercises"
            }
        
        # Generate weekly schedule
        weekly_schedule = {}
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        for day in days:
            weekly_schedule[day] = {
                "total_hours": daily_hours,
                "topics": missing_topics,
                "breakdown": {topic: time_per_topic_daily for topic in missing_topics}
            }
        
        return {
            "status": "beginner",
            "career": career,
            "missing_topics": missing_topics,
            "known_topics": known_topics,
            "daily_schedule": daily_schedule,
            "weekly_schedule": weekly_schedule,
            "total_weekly_hours": weekly_hours,
            "estimated_completion": f"{len(missing_topics) * 2} weeks for fundamentals",
            "recommendations": [
                "Start with 30-minute focused sessions",
                "Mix theory with practical exercises",
                "Review progress weekly",
                "Join online communities for support"
            ]
        }
    
    def generate_starter_guide(self, career: str, missing_topics: List[str]) -> str:
        """Generate a starter guide for the career path"""
        prompt = f"""Create a concise step-by-step 6-12 month starter guide for someone learning these topics to become a {career}: {', '.join(missing_topics)}.
        
        Include:
        1. Month-by-month learning phases
        2. Key milestones
        3. Recommended resources
        4. Project ideas
        5. Assessment checkpoints"""
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a practical study coach."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.5
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Starter guide error: {e}")
            return f"Start by mastering {missing_topics[0]}, then progressively learn other topics. Build projects and seek mentorship."

# Initialize career agent
career_agent = CareerAgent()

# Helper functions for progress tracking
def load_progress(student_id: str) -> Dict[str, Any]:
    doc = progress_collection.find_one(
        {"student_id": student_id},
        {"_id": 0}
    )
    return doc if doc else {}

def save_progress(student_id: str, progress: Dict[str, Any]) -> None:
    progress_collection.update_one(
        {"student_id": student_id},
        {"$set": progress},
        upsert=True
    )


# API Routes
@career_bp.route('/questions', methods=['GET'])
def get_questions():
    """Get career assessment questions"""
    return jsonify({
        "success": True,
        "questions": QUESTIONS
    })

@career_bp.route('/assess', methods=['POST'])
def assess_career():
    try:
        data = request.json
        student_id = data.get('student_id')
        responses = data.get('responses')

        if not student_id or not responses:
            return jsonify({"success": False, "message": "Missing data"}), 400

        recommendations = career_agent.get_career_recommendations(responses)

        progress_collection.update_one(
            {"student_id": student_id},
            {"$set": {
                "student_id": student_id,
                "initial_assessment": {
                    "responses": responses,
                    "recommendations": recommendations,
                    "assessment_date": datetime.now().isoformat()
                }
            }},
            upsert=True
        )

        return jsonify({"success": True, "data": recommendations})

    except Exception as e:
        logger.error(e)
        return jsonify({"success": False, "message": "Assessment failed"}), 500

@career_bp.route('/select-career', methods=['POST'])
def select_career():
    try:
        data = request.json
        student_id = data.get("student_id")
        career = data.get("career")
        known_topics = data.get("known_topics", [])
        daily_hours = float(data.get("daily_hours", 2))
        weekly_hours = float(data.get("weekly_hours", 10))

        topics = career_agent.suggest_topics_for_career(career)
        study_plan = career_agent.generate_study_plan(
            career, topics, known_topics, daily_hours, weekly_hours
        )

        starter_guide = None
        if study_plan["status"] == "beginner":
            starter_guide = career_agent.generate_starter_guide(
                career, study_plan["missing_topics"]
            )
        # Initialize topic progress
        topic_progress = {}
        now = datetime.now().isoformat()

        for topic in topics:
            topic_progress[topic] = {
                "percentage": 0,
                "last_updated": now
            }

        progress_collection.update_one(
            {"student_id": student_id},
            {
                "$set": {
                    "selected_career": {
                        "career": career,
                        "selected_date": datetime.now().isoformat(),
                        "topics": topics,
                        "known_topics": known_topics,
                        "study_plan": study_plan,
                        "starter_guide": starter_guide
                    },
                    "topic_progress": topic_progress
                }
            },
            upsert=True
        )


        return jsonify({
            "success": True,
            "data": {
                "topics": topics,
                "study_plan": study_plan,
                "starter_guide": starter_guide
            }
        })

    except Exception as e:
        logger.error(e)
        return jsonify({"success": False, "message": "Career selection failed"}), 500

@career_bp.route('/update-progress', methods=['POST'])
def update_progress():
    try:
        data = request.json
        student_id = data.get("student_id")
        topic = data.get("topic")
        percentage = int(data.get("percentage", 0))

        if not student_id or not topic:
            return jsonify({"success": False, "message": "Missing data"}), 400

        percentage = max(0, min(100, percentage))

        progress_collection.update_one(
            {"student_id": student_id},
            {
                "$set": {
                    f"topic_progress.{topic}": {
                        "percentage": percentage,
                        "last_updated": datetime.now().isoformat()
                    }
                }
            },
            upsert=True
        )

        return jsonify({
            "success": True,
            "message": f"{topic} updated to {percentage}%"
        })

    except Exception as e:
        logger.error(e)
        return jsonify({"success": False, "message": "Progress update failed"}), 500

@career_bp.route('/progress/<student_id>', methods=['GET'])
def get_progress(student_id):
    data = progress_collection.find_one(
        {"student_id": student_id},
        {"_id": 0}
    )
    return jsonify({"success": True, "data": data or {}})

@career_bp.route('/reset/<student_id>', methods=['POST'])
def reset_progress(student_id):
    """Reset career progress for a student"""
    try:
        save_progress(student_id, {})
        
        return jsonify({
            "success": True,
            "message": "Career progress reset successfully"
        })
        
    except Exception as e:
        logger.error(f"Reset progress error: {e}")
        return jsonify({
            "success": False,
            "message": "Failed to reset progress"
        }), 500

# Register blueprint in your main app.py
# from routes.career_agent import career_bp
# app.register_blueprint(career_bp)