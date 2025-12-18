import React, { useEffect, useState } from "react";
import baseurl from "../../baseurl";
import StudentTopBar from "../nav/studenttop";
import "./StudentDashboard.css";

import { 
  BookOpen, 
  ClipboardCheck, 
  Wallet, 
  BarChart2, 
  Edit, 
  Target,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  ChevronRight,
  Bookmark,
  Users,
  Star,
  Download,
  ExternalLink
} from "lucide-react";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState({
    completion: 65,
    hours: 120,
    streak: 7,
    rank: 42
  });

  useEffect(() => {
    const username = localStorage.getItem("loggedUser");
    if (username) {
      fetch(`${baseurl}/get_student/${username}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setData(json.data);
            // Simulate fetching additional stats
            setStats({
              completion: Math.floor(Math.random() * 40) + 60,
              hours: Math.floor(Math.random() * 100) + 80,
              streak: Math.floor(Math.random() * 15) + 3,
              rank: Math.floor(Math.random() * 50) + 20
            });
          }
        })
        .catch(() => console.log("Error fetching student data"));
    }
  }, []);

  // Dashboard main navigation buttons
  const mainActions = [
    { 
      name: "Career Command", 
      icon: <Target size={24} />, 
      route: "/student/career-command",
      description: "Get personalized career guidance",
      color: "var(--accent)",
      bgColor: "rgba(30, 58, 138, 0.1)"
    },
    { 
      name: "Quiz Plan", 
      icon: <ClipboardCheck size={24} />, 
      route: "/student/quiz",
      description: "Improve your learning from Quiz",
      color: "var(--success)",
      bgColor: "rgba(16, 185, 129, 0.1)"
    },
    { 
      name: "Study Material", 
      icon: <BookOpen size={24} />, 
      route: "/student/study-material",
      description: "To find the study material",
      color: "var(--info)",
      bgColor: "rgba(59, 130, 246, 0.1)"
    },
    { 
      name: "Progress Update", 
      icon: <Edit size={24} />, 
      route: "/student/update-progress",
      description: "Update your learning progress",
      color: "var(--warning)",
      bgColor: "rgba(245, 158, 11, 0.1)"
    },
  ];

  // Quick action buttons
  const quickActions = [
    { name: "Wallet", icon: <Wallet size={20} />, route: "/wallet" },
    { name: "Analytics", icon: <BarChart2 size={20} />, route: "/view-graph" },
    { name: "Bookmarks", icon: <Bookmark size={20} />, route: "/bookmarks" },
    { name: "Community", icon: <Users size={20} />, route: "/community" },
  ];

  // Upcoming tasks
  const upcomingTasks = [
    { title: "Complete Module 5 Quiz", due: "Today", subject: "Mathematics" },
    { title: "Submit Assignment", due: "Tomorrow", subject: "Physics" },
    { title: "Weekly Progress Review", due: "In 2 days", subject: "General" },
  ];

  const handleNavigation = (route) => {
    window.location.href = route;
  };

  if (!data) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <StudentTopBar />

      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, <span className="highlight">{data.name}</span>!</h1>
            <p className="subtitle">Here's your learning progress for today</p>
          </div>
          <div className="date-display">
            <Calendar size={20} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card" style={{ borderLeftColor: 'var(--accent)' }}>
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.completion}%</h3>
              <p>Course Completion</p>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: 'var(--success)' }}>
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.hours}h</h3>
              <p>Learning Hours</p>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: 'var(--warning)' }}>
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.streak} days</h3>
              <p>Current Streak</p>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: 'var(--info)' }}>
            <div className="stat-icon">
              <Star size={24} />
            </div>
            <div className="stat-content">
              <h3>#{stats.rank}</h3>
              <p>Global Rank</p>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="section-header">
          <h2>Quick Access</h2>
          <p>Jump to your most important features</p>
        </div>

        <div className="main-actions-grid">
          {mainActions.map((action, index) => (
            <div 
              key={index}
              className="main-action-card"
              onClick={() => handleNavigation(action.route)}
              style={{ '--card-color': action.color, '--card-bg': action.bgColor }}
            >
              <div className="action-icon" style={{ backgroundColor: action.bgColor, color: action.color }}>
                {action.icon}
              </div>
              <h3>{action.name}</h3>
              <p>{action.description}</p>
              <div className="action-arrow">
                <ChevronRight size={20} />
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-columns">
          {/* Left Column - Quick Actions & Tasks */}
          <div className="left-column">
            {/* Quick Actions */}
            <div className="quick-actions-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => (
                  <button 
                    key={index}
                    className="quick-action-btn"
                    onClick={() => handleNavigation(action.route)}
                  >
                    <div className="quick-action-icon">
                      {action.icon}
                    </div>
                    <span>{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="tasks-card">
              <div className="tasks-header">
                <h3>Upcoming Tasks</h3>
                <a href="/tasks" className="view-all">View All <ExternalLink size={16} /></a>
              </div>
              <div className="tasks-list">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="task-item">
                    <div className="task-info">
                      <h4>{task.title}</h4>
                      <p className="task-subject">{task.subject}</p>
                    </div>
                    <div className="task-due">
                      <span className={`due-badge ${task.due === 'Today' ? 'urgent' : ''}`}>
                        {task.due}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="right-column">
            <div className="recent-activity-card">
              <div className="activity-header">
                <h3>Recent Activity</h3>
                <a href="/activity" className="view-all">View All <ExternalLink size={16} /></a>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon completed">
                    <ClipboardCheck size={18} />
                  </div>
                  <div className="activity-content">
                    <p>Completed "Algebra Basics" quiz</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon downloaded">
                    <Download size={18} />
                  </div>
                  <div className="activity-content">
                    <p>Downloaded Physics study material</p>
                    <span className="activity-time">Yesterday</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon updated">
                    <Edit size={18} />
                  </div>
                  <div className="activity-content">
                    <p>Updated weekly progress</p>
                    <span className="activity-time">2 days ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon achievement">
                    <Award size={18} />
                  </div>
                  <div className="activity-content">
                    <p>Earned "Math Wizard" badge</p>
                    <span className="activity-time">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Info Card */}
            <div className="student-info-card">
              <h3>Your Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Student ID</span>
                  <span className="info-value">{data.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Contact</span>
                  <span className="info-value">{data.phno}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Course</span>
                  <span className="info-value">Science Stream</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Mentor</span>
                  <span className="info-value">Dr. Sharma</span>
                </div>
              </div>
              {/* <button className="edit-profile-btn" onClick={() => handleNavigation('/student/profile')}>
                <Edit size={18} />
                Edit Profile
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}