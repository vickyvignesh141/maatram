import React from "react";
import "./Dashboard.css"; // Make sure to create this CSS file
import { Phone, Mail, MapPin, Clock } from "lucide-react"; // Lucide icons

export default function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-top">

          <div className="header-titles">
            <h1 className="header-title">Student Profiling Platform</h1>
            <h2 className="header-subtitle">Dreams become real when effort meets consistency</h2>
          </div>

          <div className="auth-buttons">
            <a href="/login" className="btn-login">Login</a>
            {/* <a href="/register" className="btn-register">Register</a> */}
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="dashboard-main">
        <div className="cards-container">
          <div className="info-card">
            <h2 className="card-heading">Guiding Every Student Toward the Right Career Path</h2>
            <p className="card-text">
              Education is not just about getting a degree — it’s about discovering who you are, what you love, and how you can make an impact.
              Student Profiling Platform is a next-generation AI-powered student profiling platform that helps every student find their right direction in life.
              Our system analyzes academic performance, skills, financial conditions, and interests to guide each student toward a career that truly suits them.
            </p>
          </div>

          <div className="info-card">
            <h2 className="card-heading"> Our Mission</h2>
            <p className="card-text">
              Our mission is to ensure that every deserving student receives the right career guidance at the right time.
              We aim to bridge the gap between education and employability through technology, mentorship, and real-time insights.
              By combining AI-based recommendations with human mentorship, Student Profiling Platform empowers students to make informed career decisions.
            </p>
          </div>

          <div className="info-card">
            <h2 className="card-heading"> Why Student Profiling Platform Was Born</h2>
            <p className="card-text">
              Many students in India face the same challenge — scoring good marks but not knowing what comes next.
              Student Profiling Platform was born to solve this confusion. Our platform uses AI algorithms to evaluate a student’s performance, interests, and goals to recommend the best career paths.
            </p>
          </div>

         
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <h3>Contact Us</h3>
        <p><Phone size={16} /> <b>Reach Us:</b> +91 9345011987 / 6380211987 </p>
        <p><Mail size={16} /> <b>Email:</b> enquiry@studentcarrer.com</p>
        <p><MapPin size={16} /> <b>Address:</b> NO 8 velammal engineering college,Chennai. </p>
      </footer>
    </div>
  );
}
