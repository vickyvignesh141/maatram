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
  ArrowRight,
  UserPlus,
  BarChart3,
  FileText
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
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
              Manage students, mentors, and track Student impact
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

        {/* Main Layout Container */}
        <div className="main-layout">
          {/* Left Side - Main Actions Grid */}
          <div className="left-side">
            {/* Main Actions Grid */}
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
          </div>

          {/* Right Side - Quick Actions */}
          <div className="right-side">
            <div className="quick-actions-section">
              <div className="section-header">
                <h2>Quick Actions</h2>
                <p>Frequently used operations</p>
              </div>
              <div className="quick-actions-container">
                <button
                  className="quick-action-btn"
                  onClick={() => handleAddNew("student")}
                >
                  <div className="quick-action-icon">
                    <UserPlus size={24} />
                  </div>
                  <div className="quick-action-text">
                    <span className="action-title">Add Student</span>
                    <span className="action-desc">Register new student</span>
                  </div>
                </button>

                <button
                  className="quick-action-btn"
                  onClick={() => handleAddNew("mentor")}
                >
                  <div className="quick-action-icon">
                    <UserCog size={24} />
                  </div>
                  <div className="quick-action-text">
                    <span className="action-title">Add Mentor</span>
                    <span className="action-desc">Register new mentor</span>
                  </div>
                </button>

                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/admin/reports")}
                >
                  <div className="quick-action-icon">
                    <FileText size={24} />
                  </div>
                  <div className="quick-action-text">
                    <span className="action-title">Generate Report</span>
                    <span className="action-desc">Create activity reports</span>
                  </div>
                </button>

                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/admin/analytics")}
                >
                  <div className="quick-action-icon">
                    <BarChart3 size={24} />
                  </div>
                  <div className="quick-action-text">
                    <span className="action-title">View Analytics</span>
                    <span className="action-desc">See detailed insights</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;