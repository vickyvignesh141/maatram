import React, { useEffect, useState } from "react";
import baseurl from "../../baseurl";
import StudentTopBar from "../nav/studenttop";
import { useParams } from "react-router-dom";
import styles from "./StudentDashboard.module.css";

import { 
  BookOpen, 
  ClipboardCheck, 
  Wallet, 
  BarChart2, 
  Edit, 
  Target,
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
  const { username } = useParams(); 
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
    {name: "Wallet",
    icon: <Wallet size={20} />,
    route: `/student/wallet`,  // ✅ dynamic username in route
  },


    {name: "About Mentor",icon: <BarChart2 size={20} />,route: data?.assigned_mentor? `/student/mentor/${data.assigned_mentor}`: null,},
    { name: "Bookmarks", icon: <Bookmark size={20} />, route: "/student/bookmarks" },
    { name: "About Maatram", icon: <Users size={20} />, route: "https://maatramfoundation.com/" },
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
<div className={styles.studentDashboard}>
  <StudentTopBar />

  <div className={styles.dashboardContainer}>
    {/* Welcome Section */}
    <div className={styles.welcomeSection}>
      <div className={styles.welcomeContent}>
        <h1>
          Welcome back, <span className={styles.highlight}>{data.name}</span>!
        </h1>
        <p className={styles.subtitle}>Here's your learning progress</p>
      </div>

      <div className={styles.dateDisplay}>
        <Calendar size={20} />
        <span>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>

    {/* Section Header */}
    <div className={styles.sectionHeader}>
      <h2>Quick Access</h2>
    </div>

    {/* Main Actions */}
    <div className={styles.mainActionsGrid}>
      {mainActions.map((action, index) => (
        <div
          key={index}
          className={styles.mainActionCard}
          onClick={() => handleNavigation(action.route)}
          style={{ "--card-color": action.color, "--card-bg": action.bgColor }}
        >
          <div
            className={styles.actionIcon}
            style={{ backgroundColor: action.bgColor, color: action.color }}
          >
            {action.icon}
          </div>
          <h3>{action.name}</h3>
          <p>{action.description}</p>
          <div className={styles.actionArrow}>
            <ChevronRight size={20} />
          </div>
        </div>
      ))}
    </div>

    <div className={styles.dashboardColumns}>
      {/* Left Column */}
      <div className={styles.leftColumn}>
        <div className={styles.quickActionsCard}>
          <h3>Quick Actions</h3>

          <div className={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={styles.quickActionBtn}
                onClick={() => handleNavigation(action.route)}
              >
                <div className={styles.quickActionIcon}>{action.icon}</div>
                <span>{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className={styles.rightColumn}>
        <div className={styles.studentInfoCard}>
          <h3>Your Information</h3>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Student ID</span>
              <span className={styles.infoValue}>{data.username}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Contact</span>
              <span className={styles.infoValue}>{data.phno}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Course</span>
              <span className={styles.infoValue}>{data.program}  {data.department}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Mentor</span>
              <span className={styles.infoValue}>Esakki Rajan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
