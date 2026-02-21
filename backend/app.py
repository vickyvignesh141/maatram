from flask import Flask, send_from_directory
from flask_cors import CORS
import os

from blueprints.login import auth_bp
from blueprints.students.student import student
from blueprints.students.career_routes import career_bp
from blueprints.students.subject_test import subject_bp
from blueprints.students.wallets import wallet_bp
from blueprints.students.bookmark import student_bookmark
from blueprints.students.studymat import studymat_bp
from blueprints.students.mentorprofile import mendetails_bp



from blueprints.adminf.admin import admin_bp
from blueprints.adminf.adminstu import adminstu_bp
from blueprints.adminf.adminmen import adminmen_bp
from blueprints.adminf.admin_addmen import addmen_bp
from blueprints.adminf.admin_addstu import addstu_bp
from blueprints.adminf.admin_stumenassign import mentor_assign_bp

from blueprints.mentors.mentor import mentor_bp
from blueprints.mentors.studentresult import result_bp
from blueprints.mentors.studentcareers import careers_bp
from blueprints.mentors.studentcertificate import certificate_bp
from blueprints.mentors.studentprofile import studetails_bp
from blueprints.mentors.studentsummary import summary_bp


app = Flask(__name__)
CORS(app)

# ================= REGISTER BLUEPRINTS =================
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(student, url_prefix="/api")
app.register_blueprint(career_bp, url_prefix="/api/career")
app.register_blueprint(subject_bp, url_prefix="/api")
app.register_blueprint(wallet_bp, url_prefix="/api")
app.register_blueprint(student_bookmark, url_prefix="/api")
app.register_blueprint(studymat_bp, url_prefix="/study")
app.register_blueprint(mendetails_bp, url_prefix="/api")

app.register_blueprint(mentor_bp, url_prefix="/api")
app.register_blueprint(result_bp, url_prefix="/api")
app.register_blueprint(careers_bp, url_prefix="/api")
app.register_blueprint(certificate_bp, url_prefix="/api")
app.register_blueprint(studetails_bp, url_prefix="/api")




app.register_blueprint(admin_bp,url_prefix="/api")
app.register_blueprint(adminstu_bp,url_prefix="/api")
app.register_blueprint(adminmen_bp,url_prefix="/api")
app.register_blueprint(addmen_bp,url_prefix="/api")
app.register_blueprint(addstu_bp,url_prefix="/api")
app.register_blueprint(summary_bp,url_prefix="/api")
app.register_blueprint(mentor_assign_bp, url_prefix="/api/admin")


if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0", port=5000)
    


