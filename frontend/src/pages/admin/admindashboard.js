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
  School,
  CheckCircle,
  TrendingUp,
  Award,
  ArrowRight,
  ChevronRight,
  UserPlus,
  BarChart3,
  FileText,
  User,
  List,
  PlusCircle,
  BookOpen,
  GraduationCap
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    activeStudents: 0,
    passedOut: 0,
    totalColleges: 0,
    activeMentorships: 0
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulating API calls - replace with actual API endpoints
      setLoading(true);
      
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setStats({
          totalStudents: 245,
          totalMentors: 32,
          activeStudents: 198,
          passedOut: 47,
          totalColleges: 15,
          activeMentorships: 187
        });

        setStudents([
          { id: 1, name: "Rahul Sharma", college: "IIT Bombay", mentor: "Dr. Amit Patel", status: "Active", batch: "2023" },
          { id: 2, name: "Priya Singh", college: "NIT Trichy", mentor: "Prof. Sunita Rao", status: "Active", batch: "2022" },
          { id: 3, name: "Arjun Kumar", college: "BITS Pilani", mentor: "Mr. Rajesh Kumar", status: "Passed Out", batch: "2021" },
          { id: 4, name: "Sneha Verma", college: "IIM Ahmedabad", mentor: "Dr. Meera Sharma", status: "Active", batch: "2023" },
          { id: 5, name: "Vikram Reddy", college: "IISc Bangalore", mentor: "Dr. Amit Patel", status: "Active", batch: "2022" }
        ]);

        setMentors([
          { id: 1, name: "Dr. Amit Patel", students: 8, college: "Multiple", status: "Active", specialization: "Engineering" },
          { id: 2, name: "Prof. Sunita Rao", students: 6, college: "NIT Trichy", status: "Active", specialization: "Computer Science" },
          { id: 3, name: "Mr. Rajesh Kumar", students: 5, college: "BITS Pilani", status: "Active", specialization: "Business" },
          { id: 4, name: "Dr. Meera Sharma", students: 7, college: "IIM Ahmedabad", status: "Active", specialization: "Management" },
          { id: 5, name: "Prof. Anil Gupta", students: 4, college: "IIT Delhi", status: "Active", specialization: "Research" }
        ]);

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

  const handleViewDetails = (type, id) => {
    if (type === 'student') {
      navigate(`/admin/student/${id}`);
    } else if (type === 'mentor') {
      navigate(`/admin/mentor/${id}`);
    } else if (type === 'college') {
      navigate(`/admin/college/${id}`);
    }
  };

  const handleAddNew = (type) => {
    if (type === 'student') {
      navigate('/admin/students/add');
    } else if (type === 'mentor') {
      navigate('/admin/mentors/add');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'var(--success)';
      case 'Passed Out': return 'var(--warning)';
      case 'Inactive': return 'var(--error)';
      default: return 'var(--muted)';
    }
  };

  return (
    <div className="admin-dashboard">
      <Admintop activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, <span className="highlight">Admin</span> 👋</h1>
            <p className="subtitle">Manage students, mentors, and track Maatram Foundation's impact</p>
          </div>
          <div className="date-display">
            <Calendar size={20} />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <School size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalStudents}</h3>
              <p>Total Students</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <UserCog size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalMentors}</h3>
              <p>Total Mentors</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.activeMentorships}</h3>
              <p>Active Mentorships</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Building2 size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalColleges}</h3>
              <p>Colleges</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.passedOut}</h3>
              <p>Passed Out Students</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>87%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>

        {/* Main Actions Grid */}
        <div className="section-header">
          <h2>Quick Actions</h2>
          <p>Manage foundation activities</p>
        </div>
        
        <div className="main-actions-grid">
          <div 
            className="main-action-card" 
            onClick={() => navigate('/admin/students')}
          >
            <div className="action-icon" style={{ background: 'rgba(30, 58, 138, 0.1)', color: 'var(--accent)' }}>
              <Users size={32} />
            </div>
            <h3>Manage Students</h3>
            <p>View all students, add new students, update information, and track progress</p>
            <span className="action-arrow">
              <ArrowRight size={20} />
            </span>
          </div>
          
          <div 
            className="main-action-card" 
            onClick={() => navigate('/admin/mentors')}
          >
            <div className="action-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              <UserCog size={32} />
            </div>
            <h3>Manage Mentors</h3>
            <p>View mentor details, assign students, and monitor mentorship activities</p>
            <span className="action-arrow">
              <ArrowRight size={20} />
            </span>
          </div>
          
          <div 
            className="main-action-card" 
            onClick={() => navigate('/admin/assignments')}
          >
            <div className="action-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
              <Link size={32} />
            </div>
            <h3>Student-Mentor Assignments</h3>
            <p>Assign students to mentors, view existing assignments, and manage relationships</p>
            <span className="action-arrow">
              <ArrowRight size={20} />
            </span>
          </div>
          
          <div 
            className="main-action-card" 
            onClick={() => navigate('/admin/colleges')}
          >
            <div className="action-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <Building2 size={32} />
            </div>
            <h3>College Management</h3>
            <p>View college-wise student distribution and manage institutional partnerships</p>
            <span className="action-arrow">
              <ArrowRight size={20} />
            </span>
          </div>
        </div>

        {/* Dashboard Columns */}
        <div className="dashboard-columns">
          {/* Left Column */}
          <div>
            {/* Recent Students */}
            <div className="recent-activity-card">
              <div className="activity-header">
                <h3>Recent Students</h3>
                <button 
                  className="view-all"
                  onClick={() => navigate('/admin/students')}
                >
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="activity-list">
                {students.slice(0, 4).map((student) => (
                  <div key={student.id} className="activity-item">
                    <div className="activity-icon completed">
                      <User size={20} />
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{student.name}</strong> - {student.college}
                      </p>
                      <div className="activity-time">
                        Mentor: {student.mentor} • Batch: {student.batch} • 
                        <span style={{ 
                          color: getStatusColor(student.status),
                          fontWeight: '500',
                          marginLeft: '0.5rem'
                        }}>
                          {student.status}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="view-btn"
                      onClick={() => handleViewDetails('student', student.id)}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Mentors */}
            <div className="recent-activity-card">
              <div className="activity-header">
                <h3>Active Mentors</h3>
                <button 
                  className="view-all"
                  onClick={() => navigate('/admin/mentors')}
                >
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="activity-list">
                {mentors.slice(0, 4).map((mentor) => (
                  <div key={mentor.id} className="activity-item">
                    <div className="activity-icon downloaded">
                      <UserCog size={20} />
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{mentor.name}</strong> - {mentor.specialization}
                      </p>
                      <div className="activity-time">
                        Students: {mentor.students} • College: {mentor.college}
                      </div>
                    </div>
                    <button 
                      className="view-btn"
                      onClick={() => handleViewDetails('mentor', mentor.id)}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Quick Actions */}
            <div className="quick-actions-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <button 
                  className="quick-action-btn"
                  onClick={() => handleAddNew('student')}
                >
                  <span className="quick-action-icon">
                    <UserPlus size={24} />
                  </span>
                  Add Student
                </button>
                <button 
                  className="quick-action-btn"
                  onClick={() => handleAddNew('mentor')}
                >
                  <span className="quick-action-icon">
                    <UserCog size={24} />
                  </span>
                  Add Mentor
                </button>
                <button 
                  className="quick-action-btn"
                  onClick={() => navigate('/admin/reports')}
                >
                  <span className="quick-action-icon">
                    <FileText size={24} />
                  </span>
                  Generate Report
                </button>
                <button 
                  className="quick-action-btn"
                  onClick={() => navigate('/admin/analytics')}
                >
                  <span className="quick-action-icon">
                    <BarChart3 size={24} />
                  </span>
                  View Analytics
                </button>
              </div>
            </div>

            {/* College Distribution */}
            <div className="student-info-card">
              <h3>College Distribution</h3>
              <div className="info-grid">
                {colleges.slice(0, 4).map((college) => (
                  <div key={college.id} className="info-item">
                    <span className="info-label">{college.name}</span>
                    <span className="info-value">{college.students} Students</span>
                    <span className="info-label" style={{ fontSize: '0.75rem' }}>
                      {college.mentors} Mentors • {college.city}
                    </span>
                  </div>
                ))}
              </div>
              <button 
                className="edit-profile-btn"
                onClick={() => navigate('/admin/colleges')}
              >
                <List size={20} />
                View All Colleges
              </button>
            </div>

            {/* Foundation Info */}
            <div className="quick-actions-card">
              <h3>Maatram Foundation</h3>
              <div className="info-item" style={{ marginBottom: '1rem' }}>
                <span className="info-label">Mission</span>
                <span className="info-value" style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>
                  Providing higher education opportunities to deserving students through mentorship
                </span>
              </div>
              <div className="info-item" style={{ marginBottom: '1rem' }}>
                <span className="info-label">Impact This Year</span>
                <span className="info-value">45 New Admissions</span>
              </div>
              <div className="info-item">
                <span className="info-label">Success Stories</span>
                <span className="info-value">127 Graduates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;