import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import baseurl from "../../../baseurl";
import styles from "./admin_men.module.css";
import Admintop from "../../nav/admintop";
import { 
  User, 
  Mail, 
  Phone, 
  Users, 
  Calendar, 
  Award, 
  Briefcase, 
  MapPin,
  ExternalLink,
  Edit,
  X,
  Star,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Globe,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Target,
  PieChart,
  BarChart3
} from "lucide-react";

const AdminMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [allMentors, setAllMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [mentorDetails, setMentorDetails] = useState(null);
  const [viewType, setViewType] = useState("all"); // "all", "available", "required"

  // Add more fake mentors data
  const additionalMentors = [
    {
      id: 101,
      name: "Dr. Rajesh Kumar",
      username: "dr_rajesh",
      email: "rajesh@example.com",
      phone: "9876543210",
      student_count: 8,
      status: "active",
      expertise: ["Python", "Data Science", "Machine Learning"],
      experience: "7 years",
      availability: "Full-time",
      capacity: 15,
      current_students: 8,
      rating: 4.9,
      bio: "Data science expert with extensive industry experience"
    },
    {
      id: 102,
      name: "Prof. Anita Sharma",
      username: "anita_sharma",
      email: "anita@example.com",
      phone: "8765432109",
      student_count: 25,
      status: "active",
      expertise: ["Java", "Spring Boot", "Microservices"],
      experience: "10 years",
      availability: "Full-time",
      capacity: 25,
      current_students: 25,
      rating: 4.7,
      bio: "Enterprise Java specialist with focus on scalable systems"
    },
    {
      id: 103,
      name: "Dr. Michael Chen",
      username: "michael_c",
      email: "michael@example.com",
      phone: "7654321098",
      student_count: 5,
      status: "available",
      expertise: ["React", "TypeScript", "Next.js"],
      experience: "6 years",
      availability: "Part-time",
      capacity: 10,
      current_students: 5,
      rating: 4.8,
      bio: "Frontend architect with focus on modern web technologies"
    },
    {
      id: 104,
      name: "Lisa Wang",
      username: "lisa_wang",
      email: "lisa@example.com",
      phone: "6543210987",
      student_count: 18,
      status: "active",
      expertise: ["UI/UX Design", "Figma", "Adobe XD"],
      experience: "5 years",
      availability: "Full-time",
      capacity: 20,
      current_students: 18,
      rating: 4.6,
      bio: "Design thinking expert with background in user research"
    },
    {
      id: 105,
      name: "David Brown",
      username: "david_b",
      email: "david@example.com",
      phone: "5432109876",
      student_count: 0,
      status: "available",
      expertise: ["DevOps", "AWS", "Docker", "Kubernetes"],
      experience: "8 years",
      availability: "Full-time",
      capacity: 15,
      current_students: 0,
      rating: 4.9,
      bio: "Cloud infrastructure specialist with focus on automation"
    },
    {
      id: 106,
      name: "Sarah Johnson",
      username: "sarah_j",
      email: "sarah@example.com",
      phone: "4321098765",
      student_count: 22,
      status: "required",
      expertise: ["Mobile Development", "Flutter", "React Native"],
      experience: "7 years",
      availability: "Full-time",
      capacity: 25,
      current_students: 22,
      rating: 4.8,
      bio: "Cross-platform mobile development expert"
    },
    {
      id: 107,
      name: "Alex Rodriguez",
      username: "alex_r",
      email: "alex@example.com",
      phone: "3210987654",
      student_count: 12,
      status: "active",
      expertise: ["Cyber Security", "Ethical Hacking", "Network Security"],
      experience: "9 years",
      availability: "Full-time",
      capacity: 20,
      current_students: 12,
      rating: 4.9,
      bio: "Security specialist with focus on threat prevention"
    },
    {
      id: 108,
      name: "Emma Wilson",
      username: "emma_w",
      email: "emma@example.com",
      phone: "2109876543",
      student_count: 3,
      status: "available",
      expertise: ["Blockchain", "Solidity", "Web3"],
      experience: "4 years",
      availability: "Part-time",
      capacity: 10,
      current_students: 3,
      rating: 4.5,
      bio: "Blockchain developer with focus on decentralized applications"
    },
    {
      id: 109,
      name: "James Miller",
      username: "james_m",
      email: "james@example.com",
      phone: "1098765432",
      student_count: 20,
      status: "required",
      expertise: ["AI/ML", "TensorFlow", "Computer Vision"],
      experience: "8 years",
      availability: "Full-time",
      capacity: 25,
      current_students: 20,
      rating: 4.8,
      bio: "AI research scientist with focus on computer vision"
    },
    {
      id: 110,
      name: "Sophia Lee",
      username: "sophia_l",
      email: "sophia@example.com",
      phone: "0987654321",
      student_count: 7,
      status: "available",
      expertise: ["Database", "SQL", "NoSQL", "MongoDB"],
      experience: "6 years",
      availability: "Full-time",
      capacity: 15,
      current_students: 7,
      rating: 4.7,
      bio: "Database architect with expertise in both SQL and NoSQL"
    }
  ];

  // Calculate mentor statistics
  const mentorStats = useMemo(() => {
    const totalMentors = mentors.length;
    const availableMentors = mentors.filter(m => {
      const capacity = m.capacity || 25;
      const current = m.current_students || m.student_count || 0;
      const availability = current < capacity * 0.8; // Less than 80% capacity
      return availability && m.status === "active";
    }).length;
    
    const requiredMentors = mentors.filter(m => {
      const capacity = m.capacity || 25;
      const current = m.current_students || m.student_count || 0;
      const required = current >= capacity * 0.9; // More than 90% capacity
      return required && m.status === "active";
    }).length;
    
    const totalStudents = mentors.reduce((sum, mentor) => 
      sum + (mentor.current_students || mentor.student_count || 0), 0
    );
    
    const averageRating = mentors.length > 0 
      ? (mentors.reduce((sum, mentor) => sum + (mentor.rating || 4.5), 0) / mentors.length).toFixed(1)
      : "0.0";
    
    const capacityUtilization = mentors.length > 0
      ? ((totalStudents / (mentors.length * 25)) * 100).toFixed(1)
      : "0.0";
    
    return {
      totalMentors,
      availableMentors,
      requiredMentors,
      totalStudents,
      averageRating,
      capacityUtilization
    };
  }, [mentors]);

  // Filter mentors based on search term and view type
  const filteredMentors = useMemo(() => {
    let filtered = mentors;
    
    // Filter by view type
    if (viewType === "available") {
      filtered = filtered.filter(m => {
        const capacity = m.capacity || 25;
        const current = m.current_students || m.student_count || 0;
        const availability = current < capacity * 0.8;
        return availability && m.status === "active";
      });
    } else if (viewType === "required") {
      filtered = filtered.filter(m => {
        const capacity = m.capacity || 25;
        const current = m.current_students || m.student_count || 0;
        const required = current >= capacity * 0.9;
        return required && m.status === "active";
      });
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(mentor => {
        // Check name
        if (mentor.name && mentor.name.toLowerCase().includes(term)) {
          return true;
        }
        
        // Check username
        if (mentor.username && mentor.username.toLowerCase().includes(term)) {
          return true;
        }
        
        // Check ID (converting to string for comparison)
        if (mentor.id && mentor.id.toString().includes(term)) {
          return true;
        }
        
        // Check phone number
        if (mentor.phone && mentor.phone.toString().includes(term)) {
          return true;
        }
        
        // Check expertise
        if (mentor.expertise && mentor.expertise.some(exp => 
          exp.toLowerCase().includes(term)
        )) {
          return true;
        }
        
        return false;
      });
    }
    
    return filtered;
  }, [mentors, searchTerm, viewType]);

  // Add keyframes for spinner animation
  const spinnerStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseurl}/admin/mentors`);
      // Merge API data with additional fake data
      const allMentorsData = [...res.data.data, ...additionalMentors];
      setMentors(allMentorsData);
      setAllMentors(allMentorsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      // Use fake data if API fails
      setMentors(additionalMentors);
      setAllMentors(additionalMentors);
      setLoading(false);
    }
  };

  const fetchMentorDetails = async (mentorId) => {
    try {
      setProfileLoading(true);
      const res = await axios.get(`${baseurl}/admin/mentor/${mentorId}/details`);
      setMentorDetails(res.data.data);
      setProfileLoading(false);
    } catch (error) {
      console.error("Error fetching mentor details:", error);
      setProfileLoading(false);
      // If API fails, create mock data for demonstration
      const mentor = mentors.find(m => m.id === mentorId);
      setMentorDetails({
        ...mentor,
        email: mentor.email || `${mentor.username}@example.com`,
        experience: mentor.experience || "5+ years",
        expertise: mentor.expertise || ["React", "Node.js", "JavaScript", "TypeScript", "MongoDB"],
        location: "Chennai, India",
        bio: mentor.bio || "Experienced mentor with passion for teaching and guiding students. Specializes in full-stack web development with modern technologies.",
        rating: mentor.rating || 4.8,
        totalSessions: 150,
        joinDate: "2023-01-15",
        status: mentor.status || "active",
        languages: ["English", "Tamil"],
        availability: mentor.availability || "Full-time",
        education: "M.Tech in Computer Science",
        company: "Tech Solutions Inc.",
        position: "Senior Developer",
        website: "https://portfolio.example.com",
        github: "https://github.com/mentor",
        linkedin: "https://linkedin.com/in/mentor",
        capacity: mentor.capacity || 25,
        current_students: mentor.current_students || mentor.student_count || 0,
        students: Array.from({length: mentor.student_count || 0}, (_, i) => ({
          id: i + 1,
          name: `Student ${i + 1}`,
          email: `student${i + 1}@example.com`,
          joinedDate: "2024-01-15",
          progress: Math.floor(Math.random() * 100),
          course: ["Web Development", "Data Science", "Mobile App"][i % 3]
        }))
      });
    }
  };

  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor);
    fetchMentorDetails(mentor.id);
    setShowProfileModal(true);
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setSelectedMentor(null);
    setMentorDetails(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.toString().split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className={styles.highlightMatch}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Get capacity percentage
  const getCapacityPercentage = (mentor) => {
    const capacity = mentor.capacity || 25;
    const current = mentor.current_students || mentor.student_count || 0;
    return (current / capacity) * 100;
  };

  // Get capacity color
  const getCapacityColor = (percentage) => {
    if (percentage >= 90) return "#ef4444";
    if (percentage >= 75) return "#f97316";
    if (percentage >= 50) return "#eab308";
    return "#10b981";
  };

  // Get availability status
  const getAvailabilityStatus = (mentor) => {
    const capacity = mentor.capacity || 25;
    const current = mentor.current_students || mentor.student_count || 0;
    const percentage = (current / capacity) * 100;
    
    if (percentage >= 90) return "Required";
    if (percentage >= 80) return "Nearly Full";
    if (percentage >= 50) return "Moderate";
    return "Available";
  };

  // Stats card styles
  const statsCardStyles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
      }
    },
    statCardActive: {
      borderColor: '#4f46e5',
      boxShadow: '0 4px 20px rgba(79, 70, 229, 0.15)',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f5f3ff 100%)'
    },
    statHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    statIconContainer: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#111827',
      margin: '0',
      lineHeight: '1'
    },
    statLabel: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500',
      marginTop: '8px'
    },
    statSubtitle: {
      fontSize: '12px',
      color: '#9ca3af',
      marginTop: '4px'
    },
    viewTypeContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    viewTypeButton: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      background: 'white',
      color: '#6b7280',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      '&:hover': {
        background: '#f9fafb',
        borderColor: '#d1d5db'
      }
    },
    viewTypeButtonActive: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
      color: 'white',
      borderColor: '#4f46e5',
      '&:hover': {
        background: 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)'
      }
    }
  };

  // Modal styles (same as before)
  const modalStyles = {
    // ... (same modal styles from previous code)
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
      background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '40px',
      fontWeight: '600',
      boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)'
    },
    mentorBasicInfo: {
      flex: 1
    },
    mentorName: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '4px'
    },
    mentorUsername: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    mentorMeta: {
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
    expertiseContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px'
    },
    expertiseTag: {
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
      color: '#4f46e5'
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
    studentsTable: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    studentsHeader: {
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      borderBottom: '2px solid #e5e7eb'
    },
    studentsHeaderCell: {
      padding: '16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      whiteSpace: 'nowrap'
    },
    studentRow: {
      borderBottom: '1px solid #f3f4f6',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
      },
      '&:last-child': {
        borderBottom: 'none'
      }
    },
    studentCell: {
      padding: '16px',
      fontSize: '14px',
      color: '#4b5563',
      verticalAlign: 'middle'
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
      background: 'linear-gradient(90deg, #4f46e5 0%, #3730a3 100%)',
      borderRadius: '4px'
    },
    socialLinks: {
      display: 'flex',
      gap: '12px',
      marginTop: '16px'
    },
    socialLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      background: '#f3f4f6',
      color: '#6b7280',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: '#e5e7eb',
        color: '#374151',
        transform: 'translateY(-2px)'
      }
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
    ratingStars: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#fbbf24'
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
      color: '#4f46e5',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '14px',
      gap: '8px',
      '&:hover': {
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
        borderColor: '#4f46e5'
      }
    }
  };

  // Generate stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} fill="#fbbf24" color="#fbbf24" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} fill="#fbbf24" color="#fbbf24" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} color="#d1d5db" />);
    }
    
    return (
      <div style={modalStyles.ratingStars}>
        {stars}
        <span style={{ color: '#6b7280', fontSize: '14px', marginLeft: '8px' }}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <style>{spinnerStyle}</style>
        <h2 className={styles.header}>Admin - Mentor List</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Loading mentors...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Admintop /> 
      <div className={styles.container}>
        <style>{spinnerStyle}</style>
        <h2 className={styles.header}>Admin - Mentor Management</h2>
        
        {/* Mentor Statistics Dashboard */}
        <div style={statsCardStyles.container}>
          <div 
            style={{
              ...statsCardStyles.statCard,
              ...(viewType === "all" ? statsCardStyles.statCardActive : {})
            }}
            onClick={() => setViewType("all")}
          >
            <div style={statsCardStyles.statHeader}>
              <div style={{
                ...statsCardStyles.statIconContainer,
                background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                color: '#4f46e5'
              }}>
                <Users size={24} />
              </div>
              <div style={{
                ...statsCardStyles.statusBadge,
                ...(viewType === "all" ? modalStyles.statusActive : {})
              }}>
                Active
              </div>
            </div>
            <h3 style={statsCardStyles.statValue}>{mentorStats.totalMentors}</h3>
            <div style={statsCardStyles.statLabel}>Total Mentors</div>
            <div style={statsCardStyles.statSubtitle}>
              {mentorStats.totalStudents} students enrolled
            </div>
          </div>
          
          <div 
            style={{
              ...statsCardStyles.statCard,
              ...(viewType === "available" ? statsCardStyles.statCardActive : {})
            }}
            onClick={() => setViewType("available")}
          >
            <div style={statsCardStyles.statHeader}>
              <div style={{
                ...statsCardStyles.statIconContainer,
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                color: '#10b981'
              }}>
                <UserPlus size={24} />
              </div>
              <div style={{
                ...statsCardStyles.statusBadge,
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                color: '#065f46'
              }}>
                Available
              </div>
            </div>
            <h3 style={statsCardStyles.statValue}>{mentorStats.availableMentors}</h3>
            <div style={statsCardStyles.statLabel}>Available Mentors</div>
            <div style={statsCardStyles.statSubtitle}>
              {Math.round((mentorStats.availableMentors / mentorStats.totalMentors) * 100)}% of total
            </div>
          </div>
          
          <div 
            style={{
              ...statsCardStyles.statCard,
              ...(viewType === "required" ? statsCardStyles.statCardActive : {})
            }}
            onClick={() => setViewType("required")}
          >
            <div style={statsCardStyles.statHeader}>
              <div style={{
                ...statsCardStyles.statIconContainer,
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                color: '#d97706'
              }}>
                <AlertCircle size={24} />
              </div>
              <div style={{
                ...statsCardStyles.statusBadge,
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                color: '#92400e'
              }}>
                Required
              </div>
            </div>
            <h3 style={statsCardStyles.statValue}>{mentorStats.requiredMentors}</h3>
            <div style={statsCardStyles.statLabel}>Required Mentors</div>
            <div style={statsCardStyles.statSubtitle}>
              High capacity utilization
            </div>
          </div>
          
          <div style={statsCardStyles.statCard}>
            <div style={statsCardStyles.statHeader}>
              <div style={{
                ...statsCardStyles.statIconContainer,
                background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                color: '#8b5cf6'
              }}>
                <PieChart size={24} />
              </div>
            </div>
            <h3 style={statsCardStyles.statValue}>{mentorStats.averageRating}</h3>
            <div style={statsCardStyles.statLabel}>Average Rating</div>
            <div style={statsCardStyles.statSubtitle}>
              {mentorStats.capacityUtilization}% capacity utilized
            </div>
          </div>
        </div>
        
        {/* View Type Filter Buttons */}
        <div style={statsCardStyles.viewTypeContainer}>
          <button
            style={{
              ...statsCardStyles.viewTypeButton,
              ...(viewType === "all" ? statsCardStyles.viewTypeButtonActive : {})
            }}
            onClick={() => setViewType("all")}
          >
            <Users size={16} />
            All Mentors ({mentorStats.totalMentors})
          </button>
          <button
            style={{
              ...statsCardStyles.viewTypeButton,
              ...(viewType === "available" ? statsCardStyles.viewTypeButtonActive : {})
            }}
            onClick={() => setViewType("available")}
          >
            <CheckCircle size={16} />
            Available ({mentorStats.availableMentors})
          </button>
          <button
            style={{
              ...statsCardStyles.viewTypeButton,
              ...(viewType === "required" ? statsCardStyles.viewTypeButtonActive : {})
            }}
            onClick={() => setViewType("required")}
          >
            <AlertCircle size={16} />
            Required ({mentorStats.requiredMentors})
          </button>
        </div>

        {/* Search Box */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <div className={styles.searchIcon}>🔍</div>
            <input
              type="text"
              placeholder={`Search ${viewType} mentors by name, username, ID, phone, or expertise...`}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`${styles.searchInput} ${
                isSearchFocused ? styles.searchInputFocus : ""
              }`}
            />
          </div>
          {searchTerm && (
            <div className={styles.searchResultsInfo}>
              <span className={styles.resultsCount}>
                {filteredMentors.length} {filteredMentors.length === 1 ? 'match' : 'matches'}
              </span>
              <span>found for "{searchTerm}" in {viewType} mentors</span>
            </div>
          )}
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table} cellPadding="10">
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.tableHeaderCell}>ID</th>
                <th className={styles.tableHeaderCell}>Name</th>
                <th className={styles.tableHeaderCell}>Username</th>
                <th className={styles.tableHeaderCell}>Phone</th>
                <th className={styles.tableHeaderCell}>Students</th>
                <th className={styles.tableHeaderCell}>Capacity</th>
                <th className={styles.tableHeaderCell}>Availability</th>
                <th className={styles.tableHeaderCell}>Profile</th>
              </tr>
            </thead>

            <tbody>
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor, index) => {
                  const capacity = mentor.capacity || 25;
                  const current = mentor.current_students || mentor.student_count || 0;
                  const percentage = getCapacityPercentage(mentor);
                  const availability = getAvailabilityStatus(mentor);
                  const capacityColor = getCapacityColor(percentage);
                  
                  return (
                    <tr
                      key={mentor.username}
                      className={`${styles.tableRow} ${
                        index % 2 === 0 ? styles.evenRow : styles.oddRow
                      } ${hoveredRow === mentor.username ? styles.tableRowHover : ''}`}
                      onMouseEnter={() => setHoveredRow(mentor.username)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className={`${styles.tableCell} ${styles.idCell}`}>
                        {highlightText(mentor.id, searchTerm)}
                      </td>
                      <td className={`${styles.tableCell} ${styles.nameCell}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {highlightText(mentor.name, searchTerm)}
                          {mentor.rating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <Star size={12} color="#fbbf24" fill="#fbbf24" />
                              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                {mentor.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className={`${styles.tableCell} ${styles.usernameCell}`}>
                        {highlightText(mentor.username, searchTerm)}
                      </td>
                      <td className={`${styles.tableCell} ${styles.phoneCell}`}>
                        {highlightText(mentor.phone, searchTerm)}
                      </td>
                      <td className={`${styles.tableCell} ${styles.studentCountCell}`}>
                        <span className={styles.studentCountBadge}>
                          {current}/{capacity}
                        </span>
                      </td>
                      <td className={`${styles.tableCell} ${styles.capacityCell}`}>
                        <div style={{ 
                          width: '100%',
                          height: '8px',
                          background: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: capacityColor,
                            borderRadius: '4px'
                          }} />
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginTop: '4px'
                        }}>
                          {percentage.toFixed(0)}%
                        </div>
                      </td>
                      <td className={`${styles.tableCell} ${styles.availabilityCell}`}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: availability === 'Available' ? '#d1fae5' :
                                    availability === 'Moderate' ? '#fef3c7' :
                                    availability === 'Nearly Full' ? '#fed7aa' : '#fecaca',
                          color: availability === 'Available' ? '#065f46' :
                                availability === 'Moderate' ? '#92400e' :
                                availability === 'Nearly Full' ? '#ea580c' : '#dc2626'
                        }}>
                          {availability}
                        </span>
                      </td>
                      <td className={`${styles.tableCell} ${styles.profileCell}`}>
                        <button
                          className={styles.profileButton}
                          onClick={() => handleMentorClick(mentor)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '14px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <User size={16} />
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" align="center" className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>
                      {searchTerm ? "🔍" : "👨‍🏫"}
                    </div>
                    <div className={styles.emptyStateText}>
                      {searchTerm 
                        ? `No ${viewType} mentors found matching "${searchTerm}"`
                        : `No ${viewType} mentors found`}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal (same as before) */}
      {showProfileModal && selectedMentor && (
        <div style={modalStyles.overlay} onClick={handleCloseProfile}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <h2 style={modalStyles.title}>
                <User size={24} /> Mentor Profile
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
              ) : mentorDetails ? (
                <>
                  {/* Profile Header */}
                  <div style={modalStyles.profileHeader}>
                    <div style={modalStyles.avatar}>
                      {selectedMentor.name?.charAt(0).toUpperCase() || 
                       selectedMentor.username?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div style={modalStyles.mentorBasicInfo}>
                      <h1 style={modalStyles.mentorName}>
                        {selectedMentor.name || 'N/A'}
                      </h1>
                      <div style={modalStyles.mentorUsername}>
                        <User size={16} />
                        @{selectedMentor.username}
                      </div>
                      <div style={modalStyles.mentorMeta}>
                        <div style={modalStyles.metaItem}>
                          <Mail size={14} />
                          {mentorDetails.email || `${selectedMentor.username}@example.com`}
                        </div>
                        <div style={modalStyles.metaItem}>
                          <Phone size={14} />
                          {selectedMentor.phone || 'N/A'}
                        </div>
                        <div style={{
                          ...modalStyles.statusBadge,
                          ...(mentorDetails.status === 'active' ? modalStyles.statusActive : modalStyles.statusInactive)
                        }}>
                          {mentorDetails.status === 'active' ? 'Active' : 'Inactive'}
                        </div>
                        <div style={{
                          ...modalStyles.metaItem,
                          backgroundColor: getCapacityColor(getCapacityPercentage(selectedMentor)) + '20',
                          color: getCapacityColor(getCapacityPercentage(selectedMentor)),
                          borderColor: getCapacityColor(getCapacityPercentage(selectedMentor))
                        }}>
                          {getCapacityPercentage(selectedMentor).toFixed(0)}% Capacity
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div style={modalStyles.statsGrid}>
                    <div style={modalStyles.statCard}>
                      <div style={modalStyles.statValue}>
                        <Users size={24} />
                        {selectedMentor.student_count || 0}/{mentorDetails.capacity || 25}
                      </div>
                      <div style={modalStyles.statLabel}>Students/Capacity</div>
                    </div>
                    <div style={modalStyles.statCard}>
                      <div style={modalStyles.statValue}>
                        {renderStars(mentorDetails.rating || 4.8)}
                      </div>
                      <div style={modalStyles.statLabel}>Rating</div>
                    </div>
                    <div style={modalStyles.statCard}>
                      <div style={modalStyles.statValue}>
                        <Clock size={24} />
                        {mentorDetails.totalSessions || 150}
                      </div>
                      <div style={modalStyles.statLabel}>Sessions</div>
                    </div>
                    <div style={modalStyles.statCard}>
                      <div style={modalStyles.statValue}>
                        <Calendar size={24} />
                        {mentorDetails.experience || '5+ yrs'}
                      </div>
                      <div style={modalStyles.statLabel}>Experience</div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div style={modalStyles.section}>
                    <h3 style={modalStyles.sectionTitle}>
                      <MessageSquare size={18} /> Bio
                    </h3>
                    <p style={modalStyles.bioText}>
                      {mentorDetails.bio || 'No bio available for this mentor.'}
                    </p>
                  </div>

                  {/* Expertise Section */}
                  <div style={modalStyles.section}>
                    <h3 style={modalStyles.sectionTitle}>
                      <Award size={18} /> Expertise
                    </h3>
                    <div style={modalStyles.expertiseContainer}>
                      {(mentorDetails.expertise || []).map((skill, index) => (
                        <span key={index} style={modalStyles.expertiseTag}>
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
                      {mentorDetails.education && (
                        <div style={modalStyles.infoItem}>
                          <GraduationCap style={modalStyles.infoIcon} />
                          <div style={modalStyles.infoContent}>
                            <div style={modalStyles.infoLabel}>Education</div>
                            <div style={modalStyles.infoValue}>{mentorDetails.education}</div>
                          </div>
                        </div>
                      )}
                      {mentorDetails.company && (
                        <div style={modalStyles.infoItem}>
                          <Briefcase style={modalStyles.infoIcon} />
                          <div style={modalStyles.infoContent}>
                            <div style={modalStyles.infoLabel}>Company</div>
                            <div style={modalStyles.infoValue}>{mentorDetails.company}</div>
                          </div>
                        </div>
                      )}
                      {mentorDetails.position && (
                        <div style={modalStyles.infoItem}>
                          <TrendingUp style={modalStyles.infoIcon} />
                          <div style={modalStyles.infoContent}>
                            <div style={modalStyles.infoLabel}>Position</div>
                            <div style={modalStyles.infoValue}>{mentorDetails.position}</div>
                          </div>
                        </div>
                      )}
                      {mentorDetails.location && (
                        <div style={modalStyles.infoItem}>
                          <MapPin style={modalStyles.infoIcon} />
                          <div style={modalStyles.infoContent}>
                            <div style={modalStyles.infoLabel}>Location</div>
                            <div style={modalStyles.infoValue}>{mentorDetails.location}</div>
                          </div>
                        </div>
                      )}
                      {mentorDetails.languages && mentorDetails.languages.length > 0 && (
                        <div style={modalStyles.infoItem}>
                          <Globe style={modalStyles.infoIcon} />
                          <div style={modalStyles.infoContent}>
                            <div style={modalStyles.infoLabel}>Languages</div>
                            <div style={modalStyles.infoValue}>{mentorDetails.languages.join(', ')}</div>
                          </div>
                        </div>
                      )}
                      {mentorDetails.availability && (
                        <div style={modalStyles.infoItem}>
                          <Clock style={modalStyles.infoIcon} />
                          <div style={modalStyles.infoContent}>
                            <div style={modalStyles.infoLabel}>Availability</div>
                            <div style={modalStyles.infoValue}>{mentorDetails.availability}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  {(mentorDetails.github || mentorDetails.linkedin || mentorDetails.website) && (
                    <div style={modalStyles.section}>
                      <h3 style={modalStyles.sectionTitle}>
                        <Globe size={18} /> Social Links
                      </h3>
                      <div style={modalStyles.socialLinks}>
                        {mentorDetails.github && (
                          <a href={mentorDetails.github} target="_blank" rel="noopener noreferrer" style={modalStyles.socialLink}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                        {mentorDetails.linkedin && (
                          <a href={mentorDetails.linkedin} target="_blank" rel="noopener noreferrer" style={modalStyles.socialLink}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        {mentorDetails.website && (
                          <a href={mentorDetails.website} target="_blank" rel="noopener noreferrer" style={modalStyles.socialLink}>
                            <Globe size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Students List */}
                  {selectedMentor.student_count > 0 && (
                    <div style={modalStyles.section}>
                      <h3 style={modalStyles.sectionTitle}>
                        <Users size={18} /> Assigned Students ({selectedMentor.student_count})
                      </h3>
                      <table style={modalStyles.studentsTable}>
                        <thead>
                          <tr style={modalStyles.studentsHeader}>
                            <th style={modalStyles.studentsHeaderCell}>ID</th>
                            <th style={modalStyles.studentsHeaderCell}>Name</th>
                            <th style={modalStyles.studentsHeaderCell}>Email</th>
                            <th style={modalStyles.studentsHeaderCell}>Course</th>
                            <th style={modalStyles.studentsHeaderCell}>Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(mentorDetails.students || []).slice(0, 5).map((student) => (
                            <tr key={student.id} style={modalStyles.studentRow}>
                              <td style={modalStyles.studentCell}>{student.id}</td>
                              <td style={modalStyles.studentCell}>{student.name}</td>
                              <td style={modalStyles.studentCell}>{student.email}</td>
                              <td style={modalStyles.studentCell}>{student.course}</td>
                              <td style={modalStyles.studentCell}>
                                <div>{student.progress}%</div>
                                <div style={modalStyles.progressBar}>
                                  <div 
                                    style={{
                                      ...modalStyles.progressFill,
                                      width: `${student.progress}%`
                                    }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {(mentorDetails.students || []).length > 5 && (
                        <button style={modalStyles.viewMoreButton}>
                          <ExternalLink size={16} />
                          View All {selectedMentor.student_count} Students
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMentors;