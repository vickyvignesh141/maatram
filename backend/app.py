from flask import Flask, session
from flask_cors import CORS
from blueprints.login import login
from blueprints.student import student

app = Flask(__name__)

# Allow React frontend to send cookies
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Secret key for sessions
app.secret_key = "Vicky@987"
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_HTTPONLY'] = False

# Register Blueprints
app.register_blueprint(login, url_prefix="/api")
app.register_blueprint(student, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
