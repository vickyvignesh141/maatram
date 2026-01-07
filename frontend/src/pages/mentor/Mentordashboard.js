import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import baseurl from "../../baseurl";
import MentorTop from "../mentornav/mentortop";
import "./mentordashboard.css";

import { 
  User, 
  Menu, 
  X, 
  Search, 
  Filter, 
  MessageSquare,
  Users,
  ChevronRight,
  Calendar,
  Edit,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Contact
} from "lucide-react";

export default function MentorDashboard() {
  const [data, setData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalStudents: 15,
    
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("loggedUser");

    if (username) {
      setLoading(true);
      fetch(`${baseurl}/get_mentor/${username}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setData(json.data);
            loadMockData();
          }
        })
        .catch(() => console.log("Error fetching mentor data"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loadMockData = () => {
    const mentorUsername = localStorage.getItem("loggedUser"); 

    fetch(`${baseurl}/students/${mentorUsername}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const formattedStudents = data.students
          .map((stu) => ({
            id: stu.id,
            name: stu.name,
            username: stu.username,
            phno: stu.phno,
            progress: Math.floor(Math.random() * 40) + 60,
            status: "active",
            lastActive: "Recently"
          }))
          // 🔹 SORT A → Z by name
          .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )
        // 🔹 TAKE FIRST 4 AFTER SORT
        .slice(0, 4);
        setStudents(formattedStudents);
        // Update stats
        setStats(prev => ({
        ...prev,}));
  }

      })
      .catch((err) => {
        console.error("Error loading students:", err);
      });
  };

  const handleStudentSelect = (student) => {
    console.log("Selected student:", student);
  };

  const handleSendMessage = (studentId) => {
    console.log("Send message to student:", studentId);
  };

  const handleStatCardClick = (type) => {
    switch(type) {
      case 'totalStudents':
        navigate("/mentor/totalstudents", {
          state: {
            name: "Total Students",
            description: "View and manage all students assigned to you",
            count: stats.totalStudents,
            filter: 'all'
          }
        });
        break;
      default:
        break;
    }
  };

  const handleViewAllStudents = () => {
    navigate("/mentor/totalstudents", {
      state: {
        name: "All Students",
        description: "Complete list of all your students",
        count: stats.totalStudents,
        filter: 'all'
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading Mentor Dashboard...</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Unable to Load Dashboard</h2>
        <p>Please check your connection and try again.</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mentor-dashboard">
      <MentorTop/>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Navigation</h3>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <Users size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "students" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("students");
              navigate("/mentor/totalstudents", {
                state: {
                  name: "My Students",
                  description: "Manage all your students",
                  count: stats.totalStudents
                }
              });
            }}
          >
            <Users size={18} />
            <span>My Students</span>
            <span className="nav-badge">{stats.totalStudents}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="profile-quick-view">
            <div className="quick-avatar">
              {data.photo ? (
                <img src={data.photo} alt={data.name} />
              ) : (
                <div className="quick-avatar-placeholder">
                  <User size={16} />
                </div>
              )}
            </div>
            <div className="quick-info">
              <span className="quick-name">{data.name}</span>
              <span className="quick-status">● Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <h2>Welcome back, {data.name}!</h2>
            <p>You have {stats.totalStudents} students under your guidance</p>
          </div>
           <div className="date-display">
            <Calendar size={20} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Overview - Only Total Students
        <div className="stats-grid">
          <div 
            className="stat-card clickable"
            onClick={() => handleStatCardClick('totalStudents')}
          >
            <div className="stat-icon students">
              <Users size={20} />
            </div>
            <div className="stat-content">
              <h3>Total Students</h3>
              <p className="stat-number">{stats.totalStudents}</p>
              <p className="stat-change">HAPPY NEW YEAR 2K26</p>
            </div>
          </div>
        </div> */}

        <div className="content-grid">
          {/* Left Column - Students List */}
          <div className="left-column">
            {/* Students List Card */}
            <div className="students-card">
              <div className="card-header">
                <h3>My Students</h3>
                <button 
                  className="view-all-btn"
                  onClick={handleViewAllStudents}
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div className="students-list">
                {students.map(student => (
                  <div 
                    key={student.id} 
                    className="student-item clickable"
                    onClick={() => handleStudentSelect(student)}
                  >
                    <div className="student-avatar">
                      <div className="student-avatar-placeholder">
                        {student.name.charAt(0)}
                      </div>
                      <div className={`status-dot ${student.status}`}></div>
                    </div>
                    <div className="student-info">
                      <h4>{student.name}</h4>
                      <p className="student-username">
                        Username: {student.username} | Phone: {student.phno}
                      </p>
                      
                     
                    </div>
                    
                  </div>
                ))}
              </div> 
            </div>
          </div>

          {/* Right Column - Mentor Profile */}
          <div className="right-column">
            {/* Profile Card */}
            <div className="profile-overview-card">
              <div className="card-header">
                <h3>Mentor Profile</h3>
                <button 
                  className="edit-btn" 
                  onClick={() => navigate("/mentor/profile")}
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
              <div className="profile-content">
                <div className="profile-avatar-large">
                  {data.profileImage ? (
                    <img
                    src={`${baseurl}/uploads/${data.profileImage}?t=${Date.now()}`}
                    alt={data.name}
                    onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="avatar-large-placeholder">
                      <User size={32} />
                    </div>
                  )}
                  <div className="online-status"></div>
                </div>
                <div className="profile-details">
                  <h4>{data.name}</h4>
                  <p className="profile-title">Career Mentor</p>
                  
                  <div className="contact-info">
                    <div className="contact-item">
                      <Mail size={14} />
                      <span>{data.email || "essaki12@gmail.com"}</span>
                    </div>
                    <div className="contact-item">
                      <Contact size={14} />
                      <span> {data.username}</span>
                    </div>
                    <div className="contact-item">
                      <Phone size={14} />
                      <span>{data.phoneNumber || data.phone || "+1 234 567 8900"}</span>
                    </div>
                    <div className="contact-item">
                      <Briefcase size={14} />
                      <span>{data.workingCompany || "Mr.Cooper"}</span>
                    </div>
                    <div className="contact-item">
                      <GraduationCap size={14} />
                      <span>{data.collegeName || "VEC"}</span>
                    </div>
                  </div>

                  <div className="profile-stats">
                    <div className="profile-stat">
                      <span className="stat-label">Total Students</span>
                      <span className="stat-value">{stats.totalStudents}</span>
                    </div>

                    <div className="profile-stat">
                      <span className="stat-label">Experience</span>
                      <span className="stat-value">5+ Years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for sidebar on mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}