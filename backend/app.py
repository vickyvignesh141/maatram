from flask import Flask
from flask_cors import CORS
from blueprints.login import auth_bp
from blueprints.student import student
from blueprints.career_routes import career_bp
from blueprints.subject_test import subject_bp

from blueprints.mentor import mentor_bp

app = Flask(__name__)
CORS(app)

# Register Blueprint
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(student, url_prefix="/api")
app.register_blueprint(career_bp, url_prefix="/api/career")
app.register_blueprint(subject_bp, url_prefix="/api")
app.register_blueprint(mentor_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
