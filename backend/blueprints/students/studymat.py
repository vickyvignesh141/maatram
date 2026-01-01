from flask import Blueprint, request, jsonify
from ddgs import DDGS
import re

studymat_bp = Blueprint("study_bp", __name__)


def get_dynamic_certification_courses(subject):
    results = []
    query = f"{subject} certification course online 2024 2025"

    with DDGS() as ddgs:
        for r in ddgs.text(query, max_results=30):
            title = r["title"].lower()
            link = r["href"]

            # relevance filter
            if subject.lower() not in title:
                continue

            # basic quality filter
            if not link.startswith("http"):
                continue

            if len(results) < 3:
                results.append({
                    "title": r["title"],
                    "link": link
                })

    return results


def get_dynamic_youtube_courses(subject):
    results = []
    query = f"site:youtube.com {subject} full course 2024 2025"

    with DDGS() as ddgs:
        for r in ddgs.text(query, max_results=40):
            title = r["title"].lower()
            link = r["href"]

            # must be relevant
            if subject.lower() not in title:
                continue

            # avoid short or non-course videos
            if not re.search(r"full|complete|course|tutorial", title):
                continue

            if len(results) < 3:
                results.append({
                    "title": r["title"],
                    "link": link
                })

    return results


@studymat_bp.route("/guide", methods=["GET"])
def show_study_guide():
    subject = request.args.get("subject")

    if not subject:
        return jsonify({"error": "subject query parameter is required"}), 400

    courses = get_dynamic_certification_courses(subject)
    videos = get_dynamic_youtube_courses(subject)

    return jsonify({
        "subject": subject,
        "certification_courses": courses,
        "youtube_courses": videos
    })
