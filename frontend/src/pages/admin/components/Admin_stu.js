import React, { useEffect, useState } from "react";
import axios from "axios";
import baseurl from "../../../baseurl";
import Admintop from "../../nav/admintop";
import {
  User,
  Mail,
  Phone,
  Book,
  GraduationCap,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  Globe,
  ExternalLink,
  Edit,
  X,
  Star,
  Users,
  Shield,
  Clock,
  TrendingUp
} from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // New states for statistics
  const [stats, setStats] = useState({
    totalStudents: 0,
    engineering: { total: 0, years: {} },
    arts: { total: 0, years: {} },
    science: { total: 0, years: {} },
    passedOut: 0
  });
  
  // States for drill-down views
  const [currentView, setCurrentView] = useState("overview");
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  
  // New state for student profile
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Add more comprehensive fake data
  const additionalStudents = [
    {
      id: 1001,
      name: "Aarav Sharma",
      username: "aarav_sharma",
      email: "aarav.sharma@example.com",
      phno: "9876543210",
      stream: "Computer Science Engineering",
      year: 3,
      college: "IIT Delhi",
      assigned_mentor: "Dr. Rajesh Kumar",
      mentor_id: 101,
      cgpa: 8.7,
      attendance: 92,
      projects: 5,
      internships: 2,
      skills: ["Python", "Machine Learning", "Data Structures", "React"],
      address: "123 Main Street, New Delhi",
      dob: "2002-05-15",
      gender: "Male",
      status: "active",
      join_date: "2021-08-01",
      last_login: "2024-01-15"
    },
    {
      id: 1002,
      name: "Priya Patel",
      username: "priya_patel",
      email: "priya.patel@example.com",
      phno: "8765432109",
      stream: "Electronics Engineering",
      year: 2,
      college: "NIT Trichy",
      assigned_mentor: "Prof. Anita Sharma",
      mentor_id: 102,
      cgpa: 9.2,
      attendance: 95,
      projects: 3,
      internships: 1,
      skills: ["C++", "Embedded Systems", "Digital Electronics", "Python"],
      address: "456 Park Avenue, Chennai",
      dob: "2003-08-22",
      gender: "Female",
      status: "active",
      join_date: "2022-08-01",
      last_login: "2024-01-14"
    },
    {
      id: 1003,
      name: "Rohit Verma",
      username: "rohit_verma",
      email: "rohit.verma@example.com",
      phno: "7654321098",
      stream: "Mechanical Engineering",
      year: 4,
      college: "BITS Pilani",
      assigned_mentor: "Dr. Michael Chen",
      mentor_id: 103,
      cgpa: 8.9,
      attendance: 88,
      projects: 6,
      internships: 3,
      skills: ["CAD", "Thermodynamics", "SolidWorks", "MATLAB"],
      address: "789 Tech Park, Bangalore",
      dob: "2001-12-10",
      gender: "Male",
      status: "active",
      join_date: "2020-08-01",
      last_login: "2024-01-13"
    },
    {
      id: 1004,
      name: "Ananya Singh",
      username: "ananya_singh",
      email: "ananya.singh@example.com",
      phno: "6543210987",
      stream: "Civil Engineering",
      year: 1,
      college: "IIT Bombay",
      assigned_mentor: null,
      mentor_id: null,
      cgpa: 8.5,
      attendance: 90,
      projects: 2,
      internships: 0,
      skills: ["AutoCAD", "Structural Analysis", "Surveying", "Excel"],
      address: "101 Engineering Road, Mumbai",
      dob: "2004-03-18",
      gender: "Female",
      status: "active",
      join_date: "2023-08-01",
      last_login: "2024-01-12"
    },
    {
      id: 1005,
      name: "Vikram Reddy",
      username: "vikram_reddy",
      email: "vikram.reddy@example.com",
      phno: "5432109876",
      stream: "Electrical Engineering",
      year: 3,
      college: "IIT Madras",
      assigned_mentor: "Lisa Wang",
      mentor_id: 104,
      cgpa: 9.0,
      attendance: 94,
      projects: 4,
      internships: 2,
      skills: ["Power Systems", "Circuit Design", "MATLAB", "Python"],
      address: "202 Circuit Lane, Hyderabad",
      dob: "2002-07-25",
      gender: "Male",
      status: "active",
      join_date: "2021-08-01",
      last_login: "2024-01-11"
    },
    {
      id: 1006,
      name: "Sneha Gupta",
      username: "sneha_gupta",
      email: "sneha.gupta@example.com",
      phno: "4321098765",
      stream: "Biotechnology",
      year: 2,
      college: "VIT Vellore",
      assigned_mentor: "David Brown",
      mentor_id: 105,
      cgpa: 8.8,
      attendance: 91,
      projects: 3,
      internships: 1,
      skills: ["Molecular Biology", "Biochemistry", "Lab Techniques", "Data Analysis"],
      address: "303 Research Road, Vellore",
      dob: "2003-11-30",
      gender: "Female",
      status: "active",
      join_date: "2022-08-01",
      last_login: "2024-01-10"
    },
    {
      id: 1007,
      name: "Arjun Kumar",
      username: "arjun_kumar",
      email: "arjun.kumar@example.com",
      phno: "3210987654",
      stream: "Chemical Engineering",
      year: 4,
      college: "NIT Rourkela",
      assigned_mentor: "Sarah Johnson",
      mentor_id: 106,
      cgpa: 8.6,
      attendance: 89,
      projects: 5,
      internships: 2,
      skills: ["Process Design", "Chemical Kinetics", "Aspen Plus", "Safety Engineering"],
      address: "404 Chemical Street, Rourkela",
      dob: "2001-04-12",
      gender: "Male",
      status: "active",
      join_date: "2020-08-01",
      last_login: "2024-01-09"
    },
    {
      id: 1008,
      name: "Meera Iyer",
      username: "meera_iyer",
      email: "meera.iyer@example.com",
      phno: "2109876543",
      stream: "Aerospace Engineering",
      year: 3,
      college: "IIT Kharagpur",
      assigned_mentor: "Alex Rodriguez",
      mentor_id: 107,
      cgpa: 9.1,
      attendance: 96,
      projects: 4,
      internships: 2,
      skills: ["Aerodynamics", "Flight Dynamics", "CFD", "MATLAB"],
      address: "505 Sky Avenue, Kharagpur",
      dob: "2002-09-05",
      gender: "Female",
      status: "active",
      join_date: "2021-08-01",
      last_login: "2024-01-08"
    },
    {
      id: 1009,
      name: "Ravi Desai",
      username: "ravi_desai",
      email: "ravi.desai@example.com",
      phno: "1098765432",
      stream: "Information Technology",
      year: 2,
      college: "SRM Institute of Science and Technology",
      assigned_mentor: "Emma Wilson",
      mentor_id: 108,
      cgpa: 8.4,
      attendance: 87,
      projects: 3,
      internships: 1,
      skills: ["Java", "Database Management", "Web Development", "Networking"],
      address: "606 Tech Street, Chennai",
      dob: "2003-02-28",
      gender: "Male",
      status: "active",
      join_date: "2022-08-01",
      last_login: "2024-01-07"
    },
    {
      id: 1010,
      name: "Kavita Rao",
      username: "kavita_rao",
      email: "kavita.rao@example.com",
      phno: "0987654321",
      stream: "Artificial Intelligence",
      year: 1,
      college: "IIIT Hyderabad",
      assigned_mentor: "James Miller",
      mentor_id: 109,
      cgpa: 9.3,
      attendance: 97,
      projects: 2,
      internships: 0,
      skills: ["Python", "Machine Learning", "Deep Learning", "Statistics"],
      address: "707 AI Road, Hyderabad",
      dob: "2004-06-14",
      gender: "Female",
      status: "active",
      join_date: "2023-08-01",
      last_login: "2024-01-06"
    }
  ];

  // CSS Styles
  const styles = {
    container: {
      padding: "2rem",
      backgroundColor: "#f5f7fa",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      color: "#2c3e50",
      marginBottom: "1.5rem",
      paddingBottom: "0.5rem",
      borderBottom: "3px solid #3498db",
      fontSize: "1.8rem",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    searchContainer: {
      marginBottom: "1.5rem",
    },
    searchInput: {
      width: "100%",
      padding: "0.8rem 1rem",
      fontSize: "1rem",
      borderRadius: "8px",
      border: "1px solid #ddd",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      outline: "none",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
    searchInputFocus: {
      borderColor: "#3498db",
      boxShadow: "0 2px 8px rgba(52, 152, 219, 0.3)",
    },
    searchResultsInfo: {
      marginTop: "0.5rem",
      color: "#7f8c8d",
      fontSize: "0.9rem",
    },
    
    // Statistics Cards
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    statCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
    },
    statCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
    },
    statTitle: {
      fontSize: "0.9rem",
      color: "#7f8c8d",
      marginBottom: "0.5rem",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    statValue: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#2c3e50",
      marginBottom: "0.5rem",
    },
    statSubtitle: {
      fontSize: "0.85rem",
      color: "#3498db",
      fontWeight: "500",
    },
    
    // Stream Cards
    streamContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    streamCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    streamHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
    },
    streamTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#2c3e50",
    },
    streamCount: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#3498db",
    },
    yearBreakdown: {
      marginTop: "1rem",
    },
    yearRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.5rem 0",
      borderBottom: "1px solid #eee",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    yearRowHover: {
      backgroundColor: "#f8f9fa",
    },
    yearLabel: {
      fontSize: "0.9rem",
      color: "#7f8c8d",
    },
    yearCount: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#2c3e50",
    },
    
    // Navigation
    navBar: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1.5rem",
      paddingBottom: "1rem",
      borderBottom: "1px solid #ddd",
      flexWrap: "wrap"
    },
    navButton: {
      padding: "0.5rem 1.5rem",
      backgroundColor: "#f8f9fa",
      border: "1px solid #ddd",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
    navButtonActive: {
      backgroundColor: "#3498db",
      color: "white",
      borderColor: "#3498db",
    },
    
    // Table
    tableContainer: {
      overflowX: "auto",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      backgroundColor: "white",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "800px",
    },
    tableHeader: {
      backgroundColor: "#3498db",
      color: "white",
    },
    tableHeaderCell: {
      padding: "1rem",
      textAlign: "left",
      fontWeight: "600",
      fontSize: "0.9rem",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    tableRow: {
      borderBottom: "1px solid #e0e0e0",
      transition: "background-color 0.2s ease",
    },
    tableRowHover: {
      backgroundColor: "#f8f9fa",
      cursor: "pointer",
    },
    tableCell: {
      padding: "1rem",
      fontSize: "0.95rem",
      color: "#333",
    },
    evenRow: {
      backgroundColor: "#f9f9f9",
    },
    oddRow: {
      backgroundColor: "white",
    },
    
    loading: {
      textAlign: "center",
      padding: "2rem",
      color: "#7f8c8d",
      fontSize: "1.1rem",
    },
    error: {
      textAlign: "center",
      padding: "2rem",
      color: "#e74c3c",
      backgroundColor: "#ffeaea",
      borderRadius: "6px",
      margin: "1rem 0",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      color: "#7f8c8d",
      fontSize: "1rem",
    },
    mentorBadge: {
      backgroundColor: "#2ecc71",
      color: "white",
      padding: "0.3rem 0.8rem",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "500",
      display: "inline-block",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
    noMentorBadge: {
      backgroundColor: "#e74c3c",
      color: "white",
      padding: "0.3rem 0.8rem",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "500",
      display: "inline-block",
    },
    idCell: {
      color: "#3498db",
      fontWeight: "600",
      fontFamily: "monospace",
      fontSize: "0.9rem",
    },
    phoneCell: {
      color: "#2c3e50",
      fontFamily: "monospace",
    },
    
    // Back Button
    backButton: {
      padding: "0.5rem 1rem",
      backgroundColor: "#f8f9fa",
      border: "1px solid #ddd",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.9rem",
      marginBottom: "1rem",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    
    // Profile Button
    profileButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "14px",
    },
  };

  // Modal Styles
  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      backdropFilter: 'blur(5px)'
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '1000px',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 32px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%)',
      borderBottom: '1px solid #e5e7eb'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#111827',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#6b7280',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: '#e5e7eb',
        color: '#374151'
      }
    },
    content: {
      padding: '32px',
      maxHeight: 'calc(90vh - 100px)',
      overflowY: 'auto'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 0',
      gap: '16px'
    },
    loadingSpinner: {
      width: '48px',
      height: '48px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #4f46e5',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    loadingText: {
      color: '#6b7280',
      fontSize: '16px',
      fontWeight: '500'
    },
    profileHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      marginBottom: '32px',
      paddingBottom: '24px',
      borderBottom: '1px solid #e5e7eb'
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '40px',
      fontWeight: '600',
      boxShadow: '0 4px 20px rgba(52, 152, 219, 0.3)'
    },
    studentBasicInfo: {
      flex: 1
    },
    studentName: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '4px'
    },
    studentUsername: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    studentMeta: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      color: '#374151',
      background: '#f9fafb',
      padding: '6px 12px',
      borderRadius: '6px',
      border: '1px solid #e5e7eb'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      marginBottom: '32px'
    },
    statCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }
    },
    statValue: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    statLabel: {
      fontSize: '12px',
      color: '#6b7280',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    section: {
      marginBottom: '32px',
      background: '#f9fafb',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e5e7eb'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    bioText: {
      fontSize: '15px',
      lineHeight: '1.6',
      color: '#4b5563',
      margin: 0
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px'
    },
    skillTag: {
      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
      color: '#3730a3',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    },
    infoIcon: {
      width: '20px',
      height: '20px',
      color: '#3498db'
    },
    infoContent: {
      flex: 1
    },
    infoLabel: {
      fontSize: '12px',
      color: '#6b7280',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '2px'
    },
    infoValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      background: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '4px'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #3498db 0%, #2980b9 100%)',
      borderRadius: '4px'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    statusActive: {
      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      color: '#065f46'
    },
    statusInactive: {
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      color: '#92400e'
    },
    viewMoreButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '12px',
      marginTop: '16px',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      color: '#3498db',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '14px',
      gap: '8px',
      '&:hover': {
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e1f0ff 100%)',
        borderColor: '#3498db'
      }
    },
    mentorInfo: {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e1f0ff 100%)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e0f2fe',
      marginBottom: '20px'
    },
    mentorHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    mentorName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0c4a6e',
      margin: 0
    },
    mentorDetails: {
      fontSize: '14px',
      color: '#475569',
      lineHeight: '1.6'
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseurl}/admin/users`)
      .then((res) => {
        const fetchedUsers = res.data.data;
        // Merge API data with additional fake data
        const allUsers = [...fetchedUsers, ...additionalStudents];
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        
        // Calculate statistics
        calculateStatistics(allUsers);
        
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        // Use fake data if API fails
        setUsers(additionalStudents);
        setFilteredUsers(additionalStudents);
        calculateStatistics(additionalStudents);
        setError("Using demo data. API connection failed.");
        setLoading(false);
      });
  }, []);

  // Calculate statistics from user data
  const calculateStatistics = (users) => {
    const stats = {
      totalStudents: users.length,
      engineering: { total: 0, years: {1: 0, 2: 0, 3: 0, 4: 0} },
      arts: { total: 0, years: {1: 0, 2: 0, 3: 0, 4: 0} },
      science: { total: 0, years: {1: 0, 2: 0, 3: 0, 4: 0} },
      passedOut: 0
    };

    users.forEach(user => {
      const stream = user.stream?.toLowerCase() || "unknown";
      const year = user.year || 1;
      const status = user.status || "active";
      
      if (stream.includes("engineering")) {
        stats.engineering.total++;
        stats.engineering.years[year] = (stats.engineering.years[year] || 0) + 1;
      } else if (stream.includes("arts")) {
        stats.arts.total++;
        stats.arts.years[year] = (stats.arts.years[year] || 0) + 1;
      } else if (stream.includes("science")) {
        stats.science.total++;
        stats.science.years[year] = (stats.science.years[year] || 0) + 1;
      }
      
      if (status === "passed" || year === 4) {
        stats.passedOut++;
      }
    });

    setStats(stats);
  };

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    
    const filtered = users.filter(user => {
      if (user.name && user.name.toLowerCase().includes(term)) return true;
      if (user.username && user.username.toLowerCase().includes(term)) return true;
      if (user.id && user.id.toString().includes(term)) return true;
      if (user.phno && user.phno.toString().includes(term)) return true;
      if (user.assigned_mentor && user.assigned_mentor.toLowerCase().includes(term)) return true;
      if (user.stream && user.stream.toLowerCase().includes(term)) return true;
      if (user.college && user.college.toLowerCase().includes(term)) return true;
      if (user.email && user.email.toLowerCase().includes(term)) return true;
      if (user.skills && user.skills.some(skill => 
        skill.toLowerCase().includes(term)
      )) return true;
      return false;
    });
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Handle student profile click
  const handleStudentProfileClick = (student) => {
    setSelectedStudent(student);
    setProfileLoading(true);
    
    // In a real application, you would fetch detailed student info here
    // For now, we'll use the student data directly
    setTimeout(() => {
      setStudentDetails({
        ...student,
        // Add more detailed information
        parent_name: `${student.name.split(' ')[0]}'s Parent`,
        parent_phone: student.phno ? `9${student.phno.slice(-9)}` : "Not available",
        emergency_contact: "9876543210",
        blood_group: "O+",
        achievements: [
          "University Topper - Semester 3",
          "Best Project Award - 2023",
          "Sports Championship - 2022"
        ],
        courses_completed: 12,
        attendance_history: [92, 95, 88, 90, 94, 91],
        upcoming_assignments: 3,
        recent_grades: [
          { subject: "Data Structures", grade: "A+" },
          { subject: "Algorithms", grade: "A" },
          { subject: "Database Systems", grade: "A+" },
          { subject: "Operating Systems", grade: "B+" }
        ]
      });
      setProfileLoading(false);
      setShowProfileModal(true);
    }, 500);
  };

  // Handle mentor badge click
  const handleMentorClick = (e, student) => {
    e.stopPropagation();
    if (student.assigned_mentor) {
      alert(`Mentor: ${student.assigned_mentor}\nStudent: ${student.name}\nYou can implement mentor profile view here.`);
    }
  };

  // Handle stream card click
  const handleStreamClick = (stream) => {
    setSelectedStream(stream);
    setCurrentView("stream");
  };

  // Handle year click within stream
  const handleYearClick = (year) => {
    setSelectedYear(year);
    
    const filteredStudents = users.filter(user => {
      const userStream = user.stream?.toLowerCase() || "";
      const userYear = user.year || 1;
      
      if (selectedStream === "engineering") {
        return userStream.includes("engineering") && userYear === year;
      } else if (selectedStream === "arts") {
        return userStream.includes("arts") && userYear === year;
      } else if (selectedStream === "science") {
        return userStream.includes("science") && userYear === year;
      }
      return false;
    });
    
    setStudentsList(filteredStudents);
    setCurrentView("students");
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentView === "students") {
      setCurrentView("stream");
    } else if (currentView === "stream") {
      setCurrentView("overview");
      setSelectedStream(null);
      setSelectedYear(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setSelectedStudent(null);
    setStudentDetails(null);
  };

  if (loading) {
    return (
      <div>
        <Admintop />
        <div style={styles.container}>
          <h2 style={styles.header}>
            <Users size={28} /> Student Management
          </h2>
          <div style={styles.loading}>Loading students...</div>
        </div>
      </div>
    );
  }

  // Render different views based on currentView state
  const renderOverview = () => (
    <>
      {/* Statistics Cards */}
      <div style={styles.statsContainer}>
        <div 
          style={styles.statCard}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          onClick={() => setCurrentView("overview")}
        >
          <div style={styles.statTitle}>Total Students</div>
          <div style={styles.statValue}>{stats.totalStudents}</div>
          <div style={styles.statSubtitle}>All streams combined</div>
        </div>
        
        <div 
          style={styles.statCard}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          onClick={() => handleStreamClick("engineering")}
        >
          <div style={styles.statTitle}>Engineering Students</div>
          <div style={styles.statValue}>{stats.engineering.total}</div>
          <div style={styles.statSubtitle}>Click to view details</div>
        </div>
        
        <div 
          style={styles.statCard}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          onClick={() => handleStreamClick("arts")}
        >
          <div style={styles.statTitle}>Arts Students</div>
          <div style={styles.statValue}>{stats.arts.total}</div>
          <div style={styles.statSubtitle}>Click to view details</div>
        </div>
        
        <div 
          style={styles.statCard}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          onClick={() => handleStreamClick("science")}
        >
          <div style={styles.statTitle}>Science Students</div>
          <div style={styles.statValue}>{stats.science.total}</div>
          <div style={styles.statSubtitle}>Click to view details</div>
        </div>
        
        <div 
          style={styles.statCard}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={styles.statTitle}>Passed Out (4th Year)</div>
          <div style={styles.statValue}>{stats.passedOut}</div>
          <div style={styles.statSubtitle}>This academic year</div>
        </div>
      </div>

      {/* Search Box for all students */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by name, username, ID, phone, college, skills, or mentor..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          style={{
            ...styles.searchInput,
            ...(isSearchFocused && styles.searchInputFocus)
          }}
        />
        {searchTerm && (
          <div style={styles.searchResultsInfo}>
            Found {filteredUsers.length} student{filteredUsers.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* All Students Table */}
      <div style={styles.tableContainer}>
        {filteredUsers.length === 0 ? (
          <div style={styles.emptyState}>
            {searchTerm 
              ? `No students found matching "${searchTerm}"` 
              : "No students found."}
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>ID</th>
                <th style={styles.tableHeaderCell}>Name</th>
                <th style={styles.tableHeaderCell}>Stream</th>
                <th style={styles.tableHeaderCell}>Year</th>
                <th style={styles.tableHeaderCell}>College</th>
                <th style={styles.tableHeaderCell}>Mentor</th>
                <th style={styles.tableHeaderCell}>Profile</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.username}
                  style={{
                    ...styles.tableRow,
                    ...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
                    ...(hoveredRow === user.username && styles.tableRowHover),
                  }}
                  onMouseEnter={() => setHoveredRow(user.username)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => handleStudentProfileClick(user)}
                >
                  <td style={{ ...styles.tableCell, ...styles.idCell }}>
                    {user.id}
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ fontWeight: '500' }}>{user.name}</div>
                    {user.email && (
                      <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>{user.email}</div>
                    )}
                  </td>
                  <td style={styles.tableCell}>{user.stream || "Not Specified"}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: user.year === 1 ? '#e3f2fd' : 
                                     user.year === 2 ? '#f3e5f5' : 
                                     user.year === 3 ? '#e8f5e8' : '#fff3e0',
                      color: user.year === 1 ? '#1565c0' : 
                            user.year === 2 ? '#7b1fa2' : 
                            user.year === 3 ? '#2e7d32' : '#ef6c00',
                      fontWeight: '600'
                    }}>
                      Year {user.year || 1}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{user.college || "-"}</td>
                  <td style={styles.tableCell}>
                    {user.assigned_mentor ? (
                      <span 
                        style={{
                          ...styles.mentorBadge,
                          backgroundColor: '#2ecc71',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={(e) => handleMentorClick(e, user)}
                      >
                        {user.assigned_mentor}
                      </span>
                    ) : (
                      <span style={styles.noMentorBadge}>No Mentor</span>
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      style={{
                        ...styles.profileButton,
                        backgroundColor: '#3498db',
                        background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStudentProfileClick(user);
                      }}
                    >
                      <User size={16} />
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  const renderStreamDetails = () => {
    const streamData = stats[selectedStream];
    const streamTitle = selectedStream.charAt(0).toUpperCase() + selectedStream.slice(1);

    return (
      <div>
        <button 
          style={styles.backButton}
          onClick={handleBack}
        >
          ← Back to Overview
        </button>
        
        <h3 style={{ marginBottom: "1.5rem", color: "#2c3e50", display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Book size={24} /> {streamTitle} Students: {streamData.total} Total
        </h3>

        <div style={styles.yearBreakdown}>
          {[1, 2, 3, 4].map(year => (
            <div
              key={year}
              style={{
                ...styles.yearRow,
                ...(hoveredRow === `${selectedStream}-${year}` && styles.yearRowHover)
              }}
              onMouseEnter={() => setHoveredRow(`${selectedStream}-${year}`)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => handleYearClick(year)}
            >
              <div style={styles.yearLabel}>Year {year}</div>
              <div style={styles.yearCount}>{streamData.years[year] || 0} students</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStudentsList = () => {
    const streamTitle = selectedStream.charAt(0).toUpperCase() + selectedStream.slice(1);
    
    return (
      <div>
        <button 
          style={styles.backButton}
          onClick={handleBack}
        >
          ← Back to {streamTitle} Students
        </button>
        
        <h3 style={{ marginBottom: "1.5rem", color: "#2c3e50", display: 'flex', alignItems: 'center', gap: '10px' }}>
          <GraduationCap size={24} /> {streamTitle} - Year {selectedYear} Students
          <span style={{ fontSize: "0.9rem", color: "#7f8c8d", marginLeft: "1rem" }}>
            ({studentsList.length} students)
          </span>
        </h3>

        <div style={styles.tableContainer}>
          {studentsList.length === 0 ? (
            <div style={styles.emptyState}>
              No students found for {streamTitle} - Year {selectedYear}
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableHeaderCell}>ID</th>
                  <th style={styles.tableHeaderCell}>Name</th>
                  <th style={styles.tableHeaderCell}>College</th>
                  <th style={styles.tableHeaderCell}>Phone</th>
                  <th style={styles.tableHeaderCell}>Mentor</th>
                  <th style={styles.tableHeaderCell}>Profile</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.map((student, index) => (
                  <tr
                    key={student.username}
                    style={{
                      ...styles.tableRow,
                      ...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
                      ...(hoveredRow === student.username && styles.tableRowHover),
                    }}
                    onMouseEnter={() => setHoveredRow(student.username)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => handleStudentProfileClick(student)}
                  >
                    <td style={{ ...styles.tableCell, ...styles.idCell }}>
                      {student.id}
                    </td>
                    <td style={styles.tableCell}>
                      <strong>{student.name}</strong>
                      {student.email && (
                        <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>{student.email}</div>
                      )}
                    </td>
                    <td style={styles.tableCell}>{student.college || "-"}</td>
                    <td style={{ ...styles.tableCell, ...styles.phoneCell }}>
                      {student.phno}
                    </td>
                    <td style={styles.tableCell}>
                      {student.assigned_mentor ? (
                        <span 
                          style={styles.mentorBadge}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          onClick={(e) => handleMentorClick(e, student)}
                        >
                          {student.assigned_mentor}
                        </span>
                      ) : (
                        <span style={styles.noMentorBadge}>No Mentor</span>
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        style={{
                          ...styles.profileButton,
                          backgroundColor: '#3498db',
                          background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStudentProfileClick(student);
                        }}
                      >
                        <User size={16} />
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Admintop />
      <div style={styles.container}>
        <h2 style={styles.header}>
          <Users size={28} /> Student Management
        </h2>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
        
        {/* Navigation Bar */}
        <div style={styles.navBar}>
          <button 
            style={{
              ...styles.navButton,
              ...(currentView === "overview" && styles.navButtonActive)
            }}
            onClick={() => {
              setCurrentView("overview");
              setSelectedStream(null);
              setSelectedYear(null);
            }}
          >
            Overview
          </button>
          {selectedStream && (
            <button 
              style={{
                ...styles.navButton,
                ...(currentView === "stream" && styles.navButtonActive)
              }}
              onClick={() => setCurrentView("stream")}
            >
              {selectedStream.charAt(0).toUpperCase() + selectedStream.slice(1)}
            </button>
          )}
          {selectedYear && (
            <button 
              style={{
                ...styles.navButton,
                ...(currentView === "students" && styles.navButtonActive)
              }}
              onClick={() => setCurrentView("students")}
            >
              Year {selectedYear} Students
            </button>
          )}
        </div>

        {/* Render current view */}
        {currentView === "overview" && renderOverview()}
        {currentView === "stream" && renderStreamDetails()}
        {currentView === "students" && renderStudentsList()}
      </div>

      {/* Student Profile Modal */}
      {showProfileModal && selectedStudent && (
        <div style={modalStyles.overlay} onClick={handleCloseProfile}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <h2 style={modalStyles.title}>
                <User size={24} /> Student Profile
              </h2>
              <button 
                style={modalStyles.closeButton}
                onClick={handleCloseProfile}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={modalStyles.content}>
              {profileLoading ? (
                <div style={modalStyles.loadingContainer}>
                  <div style={modalStyles.loadingSpinner}></div>
                  <div style={modalStyles.loadingText}>Loading profile...</div>
                </div>
              ) : studentDetails ? (
                <>
                  {/* Profile Header */}
                  <div style={modalStyles.profileHeader}>
                    <div style={modalStyles.avatar}>
                      {selectedStudent.name?.charAt(0).toUpperCase() || 
                       selectedStudent.username?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div style={modalStyles.studentBasicInfo}>
                      <h1 style={modalStyles.studentName}>
                        {selectedStudent.name || 'N/A'}
                      </h1>
                      <div style={modalStyles.studentUsername}>
                        <User size={16} />
                        @{selectedStudent.username}
                      </div>
                      <div style={modalStyles.studentMeta}>
                        <div style={modalStyles.metaItem}>
                          <Mail size={14} />
                          {selectedStudent.email || `${selectedStudent.username}@example.com`}
                        </div>
                        <div style={modalStyles.metaItem}>
                          <Phone size={14} />
                          {selectedStudent.phno || 'N/A'}
                        </div>
                        <div style={modalStyles.metaItem}>
                          <Book size={14} />
                          {selectedStudent.stream || 'Not Specified'}
                        </div>
                        <div style={modalStyles.metaItem}>
                          <GraduationCap size={14} />
                          Year {selectedStudent.year || 1}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div style={modalStyles.statsGrid}>
                    <div style={modalStyles.statCard}>
                      <div style={modalStyles.statValue}>
                        <Award size={24} />
                        {selectedStudent.cgpa || "N/A"}
                      </div>
                      <div style={modalStyles.statLabel}>CGPA</div>
                    </div>
                    <div style={modalStyles.statCard}>
                      <div style={modalStyles.statValue}>
                        <Calendar size={24} />
                        {selectedStudent.attendance || "N/A"}%
                      </div>
                      <div style={modalStyles.statLabel}>Attendance</div>
                    </div>
                    <div style={modalStyles.statCard}>
                      <div style={modalStyles.statValue}>
                        <Briefcase size={24} />
                        {selectedStudent.projects || 0}
                      </div>
                      <div style={modalStyles.statLabel}>Projects</div>
                    </div>
                    <div style={modalStyles.statCard}>
                      <div style={modalStyles.statValue}>
                        <TrendingUp size={24} />
                        {selectedStudent.internships || 0}
                      </div>
                      <div style={modalStyles.statLabel}>Internships</div>
                    </div>
                  </div>

                  {/* Mentor Information */}
                  {selectedStudent.assigned_mentor && (
                    <div style={modalStyles.mentorInfo}>
                      <div style={modalStyles.mentorHeader}>
                        <Users size={20} color="#0c4a6e" />
                        <h3 style={modalStyles.mentorName}>
                          Assigned Mentor: {selectedStudent.assigned_mentor}
                        </h3>
                      </div>
                      <div style={modalStyles.mentorDetails}>
                        <strong>Mentor ID:</strong> {selectedStudent.mentor_id || "N/A"}<br />
                        <strong>Contact:</strong> Available through admin portal<br />
                        <strong>Expertise:</strong> {selectedStudent.assigned_mentor.includes("Rajesh") ? "Data Science" : 
                          selectedStudent.assigned_mentor.includes("Anita") ? "Enterprise Java" :
                          selectedStudent.assigned_mentor.includes("Michael") ? "Frontend Development" : "Various Technologies"}
                      </div>
                    </div>
                  )}

                  {/* Skills Section */}
                  <div style={modalStyles.section}>
                    <h3 style={modalStyles.sectionTitle}>
                      <Award size={18} /> Skills & Expertise
                    </h3>
                    <div style={modalStyles.skillsContainer}>
                      {(selectedStudent.skills || []).map((skill, index) => (
                        <span key={index} style={modalStyles.skillTag}>
                          <Star size={14} />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div style={modalStyles.section}>
                    <h3 style={modalStyles.sectionTitle}>
                      <User size={18} /> Personal Information
                    </h3>
                    <div style={modalStyles.infoGrid}>
                      <div style={modalStyles.infoItem}>
                        <MapPin style={modalStyles.infoIcon} />
                        <div style={modalStyles.infoContent}>
                          <div style={modalStyles.infoLabel}>Address</div>
                          <div style={modalStyles.infoValue}>{selectedStudent.address || "Not available"}</div>
                        </div>
                      </div>
                      <div style={modalStyles.infoItem}>
                        <Calendar style={modalStyles.infoIcon} />
                        <div style={modalStyles.infoContent}>
                          <div style={modalStyles.infoLabel}>Date of Birth</div>
                          <div style={modalStyles.infoValue}>{selectedStudent.dob || "Not available"}</div>
                        </div>
                      </div>
                      <div style={modalStyles.infoItem}>
                        <Shield style={modalStyles.infoIcon} />
                        <div style={modalStyles.infoContent}>
                          <div style={modalStyles.infoLabel}>Gender</div>
                          <div style={modalStyles.infoValue}>{selectedStudent.gender || "Not specified"}</div>
                        </div>
                      </div>
                      <div style={modalStyles.infoItem}>
                        <Globe style={modalStyles.infoIcon} />
                        <div style={modalStyles.infoContent}>
                          <div style={modalStyles.infoLabel}>College</div>
                          <div style={modalStyles.infoValue}>{selectedStudent.college || "Not specified"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div style={modalStyles.section}>
                    <h3 style={modalStyles.sectionTitle}>
                      <GraduationCap size={18} /> Academic Information
                    </h3>
                    <div style={modalStyles.infoGrid}>
                      <div style={modalStyles.infoItem}>
                        <Book style={modalStyles.infoIcon} />
                        <div style={modalStyles.infoContent}>
                          <div style={modalStyles.infoLabel}>Stream</div>
                          <div style={modalStyles.infoValue}>{selectedStudent.stream || "Not specified"}</div>
                        </div>
                      </div>
                      <div style={modalStyles.infoItem}>
                        <Calendar style={modalStyles.infoIcon} />
                        <div style={modalStyles.infoContent}>
                          <div style={modalStyles.infoLabel}>Year</div>
                          <div style={modalStyles.infoValue}>{selectedStudent.year || 1}</div>
                        </div>
                      </div>
                      <div style={modalStyles.infoItem}>
                        <Award style={modalStyles.infoIcon} />
                        <div style={modalStyles.infoContent}>
                          <div style={modalStyles.infoLabel}>Status</div>
                          <div style={{
                            ...modalStyles.statusBadge,
                            ...(selectedStudent.status === 'active' ? modalStyles.statusActive : modalStyles.statusInactive)
                          }}>
                            {selectedStudent.status === 'active' ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                      <div style={modalStyles.infoItem}>
                        <Clock style={modalStyles.infoIcon} />
                        <div style={modalStyles.infoContent}>
                          <div style={modalStyles.infoLabel}>Joined Date</div>
                          <div style={modalStyles.infoValue}>{selectedStudent.join_date || "Not available"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div style={modalStyles.section}>
                    <h3 style={modalStyles.sectionTitle}>
                      <ExternalLink size={18} /> Additional Details
                    </h3>
                    <div style={modalStyles.infoGrid}>
                      <div style={modalStyles.infoItem}>
                        <div style={modalStyles.infoContent}>
                          <div style={modalStyles.infoLabel}>Last Login</div>
                          <div style={modalStyles.infoValue}>{selectedStudent.last_login || "Recently"}</div>
                        </div>
                      </div>
                      <div style={modalStyles.infoItem}>
                        <div style={modalStyles.infoContent}>
                          <div style={modalStyles.infoLabel}>Courses Completed</div>
                          <div style={modalStyles.infoValue}>{studentDetails.courses_completed || 0}</div>
                        </div>
                      </div>
                      <div style={modalStyles.infoItem}>
                        <div style={modalStyles.infoContent}>
                          <div style={modalStyles.infoLabel}>Upcoming Assignments</div>
                          <div style={modalStyles.infoValue}>{studentDetails.upcoming_assignments || 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Grades */}
                  {studentDetails.recent_grades && (
                    <div style={modalStyles.section}>
                      <h3 style={modalStyles.sectionTitle}>
                        <Award size={18} /> Recent Grades
                      </h3>
                      <div style={modalStyles.infoGrid}>
                        {studentDetails.recent_grades.map((grade, index) => (
                          <div key={index} style={modalStyles.infoItem}>
                            <div style={modalStyles.infoContent}>
                              <div style={modalStyles.infoLabel}>{grade.subject}</div>
                              <div style={{
                                ...modalStyles.infoValue,
                                color: grade.grade === 'A+' ? '#2ecc71' :
                                       grade.grade === 'A' ? '#27ae60' :
                                       grade.grade === 'B+' ? '#f39c12' : '#e74c3c',
                                fontWeight: '700'
                              }}>
                                {grade.grade}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View Full Profile Button */}
                  <button style={modalStyles.viewMoreButton}>
                    <ExternalLink size={16} />
                    View Full Academic Record
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;