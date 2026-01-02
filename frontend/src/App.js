// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";

import StudentDashboard from "./pages/student/Studentdashboard";
import StudentCareer from "./pages/student/components/career_command";
import StudentQuiz from "./pages/student/components/Quiz";
import StudyMaterial from "./pages/student/components/studymaterial";
import StudentProgress from "./pages/student/components/studentprogress";
import StudentWallet from "./pages/student/components/Wallets";
import Studentbooklet from "./pages/student/components/Stu_Bookmark";


import MentorDashboard from "./pages/mentor/Mentordashboard";
import MentorStudents from "./pages/mentor/components/TotalStudents"
import ResultStudent from "./pages/mentor/components/StudentResult"
import CareerStudent from "./pages/mentor/components/StudentCareer"
import CertificateStudent from "./pages/mentor/components/StudentCertificate"
import MenStudentdetails from "./pages/mentor/components/Men_Studetails"

import StudentProfile from "./pages/student/components/StudentProfile"

// import MentorDashboard from "./pages/mentor/Mentordashboard";
// import MentorStudents from "./pages/mentor/components/TotalStudents"
import MentorProfile from "./pages/mentor/components/MentorProfile";


import GetAdmin from "./pages/admin/admindashboard";
import AdminStudent from "./pages/admin/components/Admin_stu"
import AdminMentor from "./pages/admin/components/admin_men"
import AdminMentorStudent from "./pages/admin/components/admin_MenStu"
import AdminClgMan from "./pages/admin/components/admin_clgmng"
import AdminAnalytics from "./pages/admin/components/Admin_Viewanly"
import Adminreport from "./pages/admin/components/admin_report"
import Adminaddstu from "./pages/admin/components/add_stu"
import Adminaddmen from "./pages/admin/components/admin_addmen"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/career-command" element={<StudentCareer />} />
        <Route path="/student/quiz" element={<StudentQuiz />} />
        <Route path="/student/study-material" element={<StudyMaterial />} />
        <Route path="/student/update-progress" element={<StudentProgress />} />
        <Route path="/student/wallet" element={<StudentWallet />} />
        <Route path="/student/bookmarks" element={<Studentbooklet />} />




        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/mentor/totalstudents" element={<MentorStudents />} /> 
        <Route path="/mentor/student/:student_id/progress" element={<ResultStudent />}/>
        <Route path="/mentor/student/:username/career" element={<CareerStudent />}/>
        <Route path="/mentor/student/:username/certifications" element={<CertificateStudent />}/>
        <Route path="/mentor/student/:username/profile" element={<MenStudentdetails />}/>
       



        <Route path="/student/profile" element={<StudentProfile/>}/>
       

        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/mentor/totalstudents" element={<MentorStudents />} />
        <Route path="/mentor/profile" element={<MentorProfile />} />
        

        
        <Route path="/admin/dashboard" element={<GetAdmin/>}/>
        <Route path="/admin/students" element={<AdminStudent/>}/>
        <Route path="/admin/mentors" element={<AdminMentor/>}/>
        <Route path="/admin/assignments" element={<AdminMentorStudent/>}/>
        <Route path="/admin/colleges" element={<AdminClgMan/>}/>
        <Route path="admin/analytics" element={<AdminAnalytics/>}/>
        <Route path="admin/reports" element={<Adminreport/>}/>
        <Route path="/admin/students/add" element={<Adminaddstu/>}/>
        <Route path="/admin/mentors/add" element={<Adminaddmen/>}/>
        


        {/* Add more pages here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
