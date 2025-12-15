// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import StudentDashboard from "./pages/student/Studentdashboard";
import StudentCareer from "./pages/student/components/career_command";
import StudentQuiz from "./pages/student/components/Quiz";
import StudyMaterial from "./pages/student/components/studymaterial";


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
        

        {/* Add more pages here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
