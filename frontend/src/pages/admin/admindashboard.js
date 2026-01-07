import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import baseurl from "../../baseurl";
import Admintop from "../nav/admintop";
import "./AdminDashboard.css";
import {
  Users,
  UserCog,
  Link,
  Building2,
  Calendar,
  Award,
  TrendingUp,
  ArrowRight,
  UserPlus,
  BarChart3,
  FileText,
  recharts,
  List,
  UserCheck // Added new icon
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      setTimeout(() => {
        setColleges([
          { id: 1, name: "IIT Bombay", students: 35, mentors: 4, city: "Mumbai" },
          { id: 2, name: "NIT Trichy", students: 28, mentors: 3, city: "Tiruchirappalli" },
          { id: 3, name: "BITS Pilani", students: 22, mentors: 2, city: "Pilani" },
          { id: 4, name: "IIM Ahmedabad", students: 18, mentors: 2, city: "Ahmedabad" },
          { id: 5, name: "IISc Bangalore", students: 25, mentors: 3, city: "Bangalore" }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  const handleAddNew = (type) => {
    if (type === "student") navigate("/admin/students/add");
    if (type === "mentor") navigate("/admin/mentors/add");
  };

  return (
    <div className="admin-dashboard">
      <Admintop activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>
              Welcome back, <span className="highlight">Praveen</span> 👋
            </h1>
            <p className="subtitle">
              Manage students, mentors, and track Maatram Foundation's impact
            </p>
          </div>
          <div className="date-display">
            <Calendar size={20} />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </div>
        </div>

        {/* Quick Actions Header */}
        <div className="section-header">
          <h2>Quick Actions</h2>
          <p>Manage foundation activities</p>
        </div>

        {/* Main Actions Grid - ADDED NEW COMPONENT HERE */}
        <div className="main-actions-grid">
          <div
            className="main-action-card"
            onClick={() => navigate("/admin/students")}
          >
            <div
              className="action-icon"
              style={{ background: "rgba(30, 58, 138, 0.1)", color: "var(--accent)" }}
            >
              <Users size={32} />
            </div>
            <h3>Manage Students</h3>
            <p>
              View all students, add new students, update information, and track progress
            </p>
            <span className="action-arrow">
              <ArrowRight size={20} />
            </span>
          </div>

          <div
            className="main-action-card"
            onClick={() => navigate("/admin/mentors")}
          >
            <div
              className="action-icon"
              style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--success)" }}
            >
              <UserCog size={32} />
            </div>
            <h3>Manage Mentors</h3>
            <p>
              View mentor details, assign students, and monitor mentorship activities
            </p>
            <span className="action-arrow">
              <ArrowRight size={20} />
            </span>
          </div>


          <div
            className="main-action-card"
            onClick={() => navigate("/admin/assignments")}
          >
            <div
              className="action-icon"
              style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--warning)" }}
            >
              <Link size={32} />
            </div>
            <h3>Student-Mentor Assignments</h3>
            <p>
              Assign students to mentors and manage mentorship relationships
            </p>
            <span className="action-arrow">
              <ArrowRight size={20} />
            </span>
          </div>

          <div
            className="main-action-card"
            onClick={() => navigate("/admin/colleges")}
          >
            <div
              className="action-icon"
              style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}
            >
              <Building2 size={32} />
            </div>
            <h3>College Management</h3>
            <p>
              View college-wise student distribution and partnerships
            </p>
            <span className="action-arrow">
              <ArrowRight size={20} />
            </span>
          </div>
        </div>

        {/* Dashboard Columns */}
        <div className="dashboard-columns">
          <div>
            {/* Quick Actions Card */}
            <div className="quick-actions-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <button
                  className="quick-action-btn"
                  onClick={() => handleAddNew("student")}
                >
                  <UserPlus size={24} />
                  Add Student
                </button>

                <button
                  className="quick-action-btn"
                  onClick={() => handleAddNew("mentor")}
                >
                  <UserCog size={24} />
                  Add Mentor
                </button>

                {/* NEW QUICK ACTION BUTTON 
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/admin/assign-mentor")}
                >
                  <UserCheck size={24} />
                  Assign Mentor
                </button>*/}

                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/admin/reports")}
                >
                  <FileText size={24} />
                  Generate Report
                </button>

                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/admin/analytics")}
                >
                  <BarChart3 size={24} />
                  View Analytics
                </button>
              </div>
            </div>

            {/* College Distribution 
            <div className="student-info-card">
              <h3>College Distribution</h3>
              <div className="info-grid">
                {colleges.slice(0, 4).map((college) => (
                  <div key={college.id} className="info-item">
                    <span className="info-label">{college.name}</span>
                    <span className="info-value">{college.students} Students</span>
                    <span className="info-label" style={{ fontSize: "0.75rem" }}>
                      {college.mentors} Mentors • {college.city}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className="edit-profile-btn"
                onClick={() => navigate("/admin/colleges")}
              >
                <List size={20} />
                View All Colleges
              </button>
            </div>*/}
          </div>

          <div />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;