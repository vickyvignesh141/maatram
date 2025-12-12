from flask import Flask
from flask_cors import CORS
from blueprints.login import auth_bp

app = Flask(__name__)
CORS(app)

# Register Blueprint
app.register_blueprint(auth_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
