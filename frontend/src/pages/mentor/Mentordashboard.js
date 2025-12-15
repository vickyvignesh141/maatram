import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import baseurl from "../../baseurl";
import "./mentordashboard.css";
import { 
  User, 
  Bell, 
  Menu, 
  X, 
  Search, 
  Filter, 
  Calendar, 
  MessageSquare, 
  BarChart3,
  Award,
  Target,
  Users,
  CheckCircle,
  Clock,
  ChevronRight,
  Edit,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Download,
  Settings
} from "lucide-react";

export default function MentorDashboard() {
  const [data, setData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalStudents: 15,
    activeStudents: 8,
    completedTasks: 42,
    upcomingMeetings: 3,
    rating: 4.8,
    pendingReviews: 5
  });
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
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
            // Load mock data
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
    // Mock students data
    setStudents([
      { id: 1, name: "Alex Johnson", progress: 85, status: "active", course: "Computer Science", lastActive: "2 hours ago" },
      { id: 2, name: "Sarah Miller", progress: 72, status: "active", course: "Data Science", lastActive: "1 day ago" },
      { id: 3, name: "David Wilson", progress: 93, status: "active", course: "Engineering", lastActive: "3 hours ago" },
      { id: 4, name: "Emma Brown", progress: 65, status: "inactive", course: "Business", lastActive: "5 days ago" },
      { id: 5, name: "Michael Chen", progress: 88, status: "active", course: "AI & ML", lastActive: "1 hour ago" }
    ]);

    // Mock tasks data
    setTasks([
      { id: 1, title: "Review Career Assessments", due: "Today", priority: "high", completed: false },
      { id: 2, title: "Schedule Weekly Meetings", due: "Tomorrow", priority: "medium", completed: true },
      { id: 3, title: "Update Student Progress", due: "Dec 20", priority: "medium", completed: false },
      { id: 4, title: "Submit Monthly Report", due: "Dec 25", priority: "low", completed: false },
      { id: 5, title: "Plan Workshop", due: "Jan 5", priority: "high", completed: false }
    ]);
  };

  const handleTaskToggle = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleStudentSelect = (student) => {
    console.log("Selected student:", student);
    // Here you can implement student detail view
  };

  const handleSendMessage = (studentId) => {
    console.log("Send message to student:", studentId);
    // Implement message sending
  };

  const handleStatCardClick = (type) => {
    switch(type) {
      case 'totalStudents':
        navigate("/mentor/students", {
          state: {
            name: "Total Students",
            description: "View and manage all students assigned to you",
            count: stats.totalStudents,
            active: stats.activeStudents,
            filter: 'all'
          }
        });
        break;
      case 'activeStudents':
        navigate("/mentor/students", {
          state: {
            name: "Active Students",
            description: "Students currently active in mentorship program",
            count: stats.activeStudents,
            filter: 'active'
          }
        });
        break;
      case 'completedTasks':
        navigate("/mentor/tasks", {
          state: {
            name: "Completed Tasks",
            description: "Tasks completed this month",
            count: stats.completedTasks,
            filter: 'completed'
          }
        });
        break;
      case 'mentorRating':
        navigate("/mentor/reviews", {
          state: {
            name: "Mentor Rating & Reviews",
            description: "View your performance ratings and student feedback",
            rating: stats.rating,
            reviews: 24
          }
        });
        break;
      default:
        break;
    }
  };

  const handleViewAllStudents = () => {
    navigate("/mentor/students", {
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
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="logo">
            <div className="logo-icon">🎯</div>
            <h1>MENTOR</h1>
          </div>
        </div>

        <div className="header-center">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search students, tasks, or resources..." 
              className="search-input"
            />
            <button className="search-filter">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="header-right">
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-count">3</span>
          </button>
          <button className="calendar-btn">
            <Calendar size={20} />
          </button>
          <button className="messages-btn">
            <MessageSquare size={20} />
          </button>
          <div className="user-profile">
            <div className="avatar">
              {data.photo ? (
                <img src={data.photo} alt={data.name} />
              ) : (
                <div className="avatar-placeholder">
                  <User size={20} />
                </div>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{data.name}</span>
              <span className="user-role">Senior Mentor</span>
            </div>
          </div>
        </div>
      </header>

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
            <BarChart3 size={18} />
            <span>Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "students" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("students");
              navigate("/mentor/students", {
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
          <button 
            className={`nav-item ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("tasks");
              navigate("/mentor/tasks", {
                state: {
                  name: "My Tasks",
                  description: "View and manage your tasks",
                  pending: tasks.filter(t => !t.completed).length
                }
              });
            }}
          >
            <CheckCircle size={18} />
            <span>Tasks</span>
            <span className="nav-badge">{tasks.filter(t => !t.completed).length}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "progress" ? "active" : ""}`}
            onClick={() => setActiveTab("progress")}
          >
            <Target size={18} />
            <span>Progress</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "certificates" ? "active" : ""}`}
            onClick={() => setActiveTab("certificates")}
          >
            <Award size={18} />
            <span>Certificates</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("reports");
              navigate("/mentor/reports", {
                state: {
                  name: "Reports",
                  description: "Download reports and analytics"
                }
              });
            }}
          >
            <Download size={18} />
            <span>Reports</span>
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
            <button className="settings-btn">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <h2>Welcome back, {data.name}!</h2>
            <p>You have {tasks.filter(t => !t.completed).length} pending tasks and {stats.upcomingMeetings} upcoming meetings</p>
          </div>
          <button className="action-btn primary">
            <Calendar size={16} />
            Schedule Meeting
          </button>
        </div>

        {/* Stats Overview */}
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
              <p className="stat-change">+2 this month</p>
            </div>
          </div>
          <div 
            className="stat-card clickable"
            onClick={() => handleStatCardClick('activeStudents')}
          >
            <div className="stat-icon active">
              <User size={20} />
            </div>
            <div className="stat-content">
              <h3>Active Students</h3>
              <p className="stat-number">{stats.activeStudents}</p>
              <p className="stat-change">{Math.round((stats.activeStudents / stats.totalStudents) * 100)}% active</p>
            </div>
          </div>
          <div 
            className="stat-card clickable"
            onClick={() => handleStatCardClick('completedTasks')}
          >
            <div className="stat-icon tasks">
              <CheckCircle size={20} />
            </div>
            <div className="stat-content">
              <h3>Completed Tasks</h3>
              <p className="stat-number">{stats.completedTasks}</p>
              <p className="stat-change">+12 this week</p>
            </div>
          </div>
          <div 
            className="stat-card clickable"
            onClick={() => handleStatCardClick('mentorRating')}
          >
            <div className="stat-icon rating">
              <Award size={20} />
            </div>
            <div className="stat-content">
              <h3>Mentor Rating</h3>
              <p className="stat-number">{stats.rating}/5</p>
              <p className="stat-change">Based on 24 reviews</p>
            </div>
          </div>
        </div>

        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Profile Card */}
            <div className="profile-overview-card">
              <div className="card-header">
                <h3>Mentor Profile</h3>
                <button 
                  className="edit-btn" 
                  onClick={() => navigate("/mentor/edit-profile")}
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
              <div className="profile-content">
                <div className="profile-avatar-large">
                  {data.photo ? (
                    <img src={data.photo} alt={data.name} />
                  ) : (
                    <div className="avatar-large-placeholder">
                      <User size={32} />
                    </div>
                  )}
                  <div className="online-status"></div>
                </div>
                <div className="profile-details">
                  <h4>{data.name}</h4>
                  <p className="profile-title">Senior Career Mentor</p>
                  
                  <div className="contact-info">
                    <div className="contact-item">
                      <Mail size={14} />
                      <span>{data.email || "mentor@example.com"}</span>
                    </div>
                    <div className="contact-item">
                      <Phone size={14} />
                      <span>{data.phno || "+1 234 567 8900"}</span>
                    </div>
                    <div className="contact-item">
                      <Briefcase size={14} />
                      <span>{data.company || "Tech Solutions Inc."}</span>
                    </div>
                    <div className="contact-item">
                      <GraduationCap size={14} />
                      <span>{data.department || "Computer Science"}</span>
                    </div>
                  </div>

                  <div className="profile-stats">
                    <div className="profile-stat">
                      <span className="stat-label">Experience</span>
                      <span className="stat-value">5+ Years</span>
                    </div>
                    <div className="profile-stat">
                      <span className="stat-label">Success Rate</span>
                      <span className="stat-value">92%</span>
                    </div>
                    <div className="profile-stat">
                      <span className="stat-label">Response Time</span>
                      <span className="stat-value">&lt; 2h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Students List */}
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
                      <p>{student.course}</p>
                      <div className="student-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{student.progress}%</span>
                      </div>
                    </div>
                    <button 
                      className="message-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendMessage(student.id);
                      }}
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Tasks Card */}
            <div className="tasks-card">
              <div className="card-header">
                <h3>Upcoming Tasks</h3>
                <span className="task-count">
                  {tasks.filter(t => !t.completed).length} pending
                </span>
              </div>
              <div className="tasks-list">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="task-item clickable"
                    onClick={() => navigate(`/mentor/tasks/${task.id}`)}
                  >
                    <div className="task-checkbox">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleTaskToggle(task.id);
                        }}
                        id={`task-${task.id}`}
                      />
                      <label htmlFor={`task-${task.id}`}></label>
                    </div>
                    <div className="task-content">
                      <h4 className={task.completed ? "completed" : ""}>
                        {task.title}
                      </h4>
                      <div className="task-meta">
                        <span className={`priority-badge ${task.priority}`}>
                          {task.priority}
                        </span>
                        <span className="due-date">
                          <Clock size={12} />
                          {task.due}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="task-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/mentor/tasks/${task.id}/details`);
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                className="add-task-btn"
                onClick={() => navigate("/mentor/tasks/new")}
              >
                + Add New Task
              </button>
            </div>

            {/* Upcoming Meetings */}
            <div className="meetings-card">
              <div className="card-header">
                <h3>Upcoming Meetings</h3>
                <button 
                  className="schedule-btn"
                  onClick={() => navigate("/mentor/schedule")}
                >
                  <Calendar size={16} />
                </button>
              </div>
              <div className="meetings-list">
                <div 
                  className="meeting-item clickable"
                  onClick={() => navigate("/mentor/meetings/1")}
                >
                  <div className="meeting-time">
                    <span className="meeting-hour">10:00</span>
                    <span className="meeting-period">AM</span>
                  </div>
                  <div className="meeting-details">
                    <h4>Career Guidance Session</h4>
                    <p>With Alex Johnson</p>
                    <div className="meeting-tags">
                      <span className="tag video">Video Call</span>
                      <span className="tag duration">45 min</span>
                    </div>
                  </div>
                  <button 
                    className="join-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Join meeting functionality
                      console.log("Joining meeting...");
                    }}
                  >
                    Join
                  </button>
                </div>
                <div 
                  className="meeting-item clickable"
                  onClick={() => navigate("/mentor/meetings/2")}
                >
                  <div className="meeting-time">
                    <span className="meeting-hour">14:30</span>
                    <span className="meeting-period">PM</span>
                  </div>
                  <div className="meeting-details">
                    <h4>Progress Review</h4>
                    <p>With Sarah Miller</p>
                    <div className="meeting-tags">
                      <span className="tag in-person">In Person</span>
                      <span className="tag duration">30 min</span>
                    </div>
                  </div>
                  <button 
                    className="join-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Join meeting functionality
                      console.log("Joining meeting...");
                    }}
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="progress-card">
              <div className="card-header">
                <h3>Student Progress</h3>
                <button 
                  className="progress-overall clickable"
                  onClick={() => navigate("/mentor/progress")}
                >
                  78% Avg
                </button>
              </div>
              <div className="progress-chart">
                {students.slice(0, 4).map(student => (
                  <div 
                    key={student.id} 
                    className="chart-item clickable"
                    onClick={() => navigate(`/mentor/students/${student.id}/progress`)}
                  >
                    <div className="chart-bar-container">
                      <div 
                        className="chart-bar" 
                        style={{ height: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="chart-label">{student.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quick Actions Panel */}
      <div className="quick-actions">
        <button 
          className="action-btn"
          onClick={() => navigate("/mentor/messages")}
        >
          <MessageSquare size={18} />
          <span>Messages</span>
        </button>
        <button 
          className="action-btn"
          onClick={() => navigate("/mentor/calendar")}
        >
          <Calendar size={18} />
          <span>Calendar</span>
        </button>
        <button 
          className="action-btn primary"
          onClick={() => navigate("/mentor/students/add")}
        >
          <Users size={18} />
          <span>Add Student</span>
        </button>
      </div>

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