import React, { useState, useEffect } from 'react';
import styles from './StudentProfile.module.css';
import BASE_URL from "../../../baseurl";
import StudentTopBar from "../../nav/studenttop";
import { 
  User, 
  ChevronDown, 
  Bell, 
  Settings, 
  LogOut, 
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  FileText,
  Upload,
  Camera,
  CheckCircle,
  Edit2,
  Save,
  X,
  Eye,
  Trash2,
  Home,
  Building,
  Users,
  BookOpen,
  FilePlus,
  AlertCircle,
  Loader2,
  ExternalLink,
  Linkedin,
  Github,
  Globe as Web,
  UserCircle,
  FileType,
  Clipboard,
  Info,
  Headphones
} from "lucide-react";

const StudentProfile = ({ loginData }) => {
  // Initial state with pre-filled data from login
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    dateOfBirth: loginData?.dateOfBirth || '',
    maatramId: loginData?.maatramId || '',
    collegeName: '',
    batchYear: '',
    currentYear: '',
    semester: '',
    program: '',
    department: '',
    phoneNumber: '',
    address: '',
    linkedinId: '',
    githubId: '',
    email: loginData?.email || '',
    profileImage: '',
    otherProfile: '',
    resumeImage: null
  });

  const [originalData, setOriginalData] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Set pre-filled data when component mounts or loginData changes
  useEffect(() => {
    if (loginData) {
      setStudentInfo(prev => ({
        ...prev,
        maatramId: loginData.maatramId || prev.maatramId,
        dateOfBirth: loginData.dateOfBirth || prev.dateOfBirth,
        email: loginData.email || prev.email
      }));
    }
  }, [loginData]);

  useEffect(() => {
    const fetchStudentData = async () => {
      const username = localStorage.getItem("loggedUser");
      if (username) {
        try {
          const response = await fetch(`${BASE_URL}/student_profile/${username}`);
          const json = await response.json();
          
          if (json.success) {
            const data = json.data;
            const studentData = {
              name: data.name || "",
              phoneNumber: data.phno || "",
              maatramId: data.username || "",
              dateOfBirth: data.password || data.dateOfBirth || "",
              assignedMentor: data.assigned_mentor || data.assignedMentor || "",
              collegeName: data.collegeName || "",
              batchYear: data.batchYear || "",
              currentYear: data.currentYear || "",
              semester: data.semester || "",
              program: data.program || "",
              department: data.department || "",
              email: data.email || "",
              profileImage: data.profileImage || "",
              address: data.address || "",
              linkedinId: data.linkedinId || "",
              githubId: data.githubId || "",
              otherProfile: data.otherProfile || "",
            };

            setStudentInfo(prev => ({ ...prev, ...studentData }));
            setOriginalData(studentData);
            
            // Set image preview if profile image exists
            if (data.profileImage) {
              setImagePreview(`${BASE_URL}/uploads/${data.profileImage}`);
            }
            
            // Set resume preview if exists
            if (data.resumeImage) {
              setResumePreview(`${BASE_URL}/${data.resumeImage}`);
            }
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
    };

    fetchStudentData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

    if (!studentInfo.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!studentInfo.email || !emailRegex.test(studentInfo.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!studentInfo.phoneNumber || !phoneRegex.test(studentInfo.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Valid phone number is required';
    }
    
    if (!studentInfo.collegeName.trim()) {
      newErrors.collegeName = 'College name is required';
    }
    
    if (!studentInfo.batchYear) {
      newErrors.batchYear = 'Batch year is required';
    }
    
    if (!studentInfo.currentYear) {
      newErrors.currentYear = 'Current year is required';
    }
    
    if (!studentInfo.semester) {
      newErrors.semester = 'Semester is required';
    }
    
    if (!studentInfo.program) {
      newErrors.program = 'Program is required';
    }
    
    if (!studentInfo.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!studentInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, profileImage: 'Please upload an image file' }));
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profileImage: 'Image size should be less than 5MB' }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setStudentInfo(prev => ({
      ...prev,
      profileImage: file
    }));

    if (errors.profileImage) {
      setErrors(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (file.type !== 'application/pdf') {
      setErrors(prev => ({ ...prev, resumeImage: 'Please upload a PDF file' }));
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, resumeImage: 'File size should be less than 5MB' }));
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setResumePreview(previewUrl);

    setStudentInfo(prev => ({
      ...prev,
      resumeImage: file
    }));

    if (errors.resumeImage) {
      setErrors(prev => ({ ...prev, resumeImage: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", studentInfo.maatramId);

      // Append all other fields
      Object.keys(studentInfo).forEach((key) => {
        if (key === "profileImage" || key === "resumeImage") {
          if (studentInfo[key]) formData.append(key, studentInfo[key]);
        } else if (key !== "maatramId") {
          formData.append(key, studentInfo[key] || "");
        }
      });

      const response = await fetch(`${BASE_URL}/student_profile`, {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        setIsEditing(false);
        setLoading(false);

        // Update original data
        setOriginalData({ ...studentInfo });

        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        console.error(result.msg);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      setIsEditing(false);
      setErrors({});
      // Restore original data
      if (originalData) {
        setStudentInfo(originalData);
        setImagePreview(originalData.profileImage ? `${BASE_URL}/uploads/${originalData.profileImage}` : null);
        setResumePreview(originalData.resumeImage ? `${BASE_URL}/${originalData.resumeImage}` : null);
      }
    }
  };

  const removeProfileImage = () => {
    setImagePreview(null);
    setStudentInfo(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  const removeResume = () => {
    if (window.confirm('Are you sure you want to remove your resume?')) {
      setResumePreview(null);
      setStudentInfo(prev => ({
        ...prev,
        resumeImage: null
      }));
    }
  };

  // Helper function to format phone number
  const formatPhoneNumber = (value) => {
    if (!value) return '';
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Generate batch years (last 10 years)
  const batchYears = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year.toString() };
  });

  const programs = [
    { value: 'B.Tech', label: 'Bachelor of Technology (B.Tech)' },
    { value: 'B.E.', label: 'Bachelor of Engineering (B.E.)' },
    { value: 'B.Sc.', label: 'Bachelor of Science (B.Sc.)' },
    { value: 'B.A.', label: 'Bachelor of Arts (B.A.)' },
    { value: 'B.Com', label: 'Bachelor of Commerce (B.Com)' },
    { value: 'BBA', label: 'Bachelor of Business Administration (BBA)' },
    { value: 'M.Tech', label: 'Master of Technology (M.Tech)' },
    { value: 'M.Sc.', label: 'Master of Science (M.Sc.)' },
    { value: 'MBA', label: 'Master of Business Administration (MBA)' },
    { value: 'PhD', label: 'Doctor of Philosophy (PhD)' }
  ];

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
    'Artificial Intelligence',
    'Data Science',
    'Business Administration',
    'Commerce',
    'Science',
    'Arts',
    'Law',
    'Medicine'
  ];

  return (
    <div className={styles.container}>
      <StudentTopBar />
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <GraduationCap className={styles.headerIcon} />
            <h1>Student Profile</h1>
          </div>
          <p className={styles.subtitle}>Complete your profile to access all campus resources</p>
        </div>
        <div className={styles.headerActions}>
          <div className={`${styles.statusBadge} ${isEditing ? styles.editing : styles.viewing}`}>
            {isEditing ? <Edit2 size={14} /> : <Eye size={14} />}
            <span>{isEditing ? 'Editing Mode' : 'Viewing Mode'}</span>
          </div>
          {isSubmitted && (
            <div className={styles.successMessage}>
              <CheckCircle size={16} />
              <span>Profile updated successfully!</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImageSection}>
            <div className={styles.profileImageContainer}>
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile" 
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileImagePlaceholder}>
                  <UserCircle size={48} />
                </div>
              )}
              
              {isEditing && (
                <>
                  <label className={styles.imageUploadOverlay}>
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      hidden
                    />
                  </label>
                  {imagePreview && (
                    <button 
                      type="button" 
                      className={styles.removeImageButton}
                      onClick={removeProfileImage}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </>
              )}
            </div>
            {errors.profileImage && (
              <div className={styles.errorMessage}>
                <AlertCircle size={14} />
                <span>{errors.profileImage}</span>
              </div>
            )}
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.infoHeader}>
              <h2>
                {studentInfo.name || 'Your Name'}
                <span className={styles.verifiedBadge}>
                  <CheckCircle size={14} />
                  <span>Student</span>
                </span>
              </h2>
              <div className={styles.studentId}>
                <Clipboard size={16} />
                <span>Maatram ID: {studentInfo.maatramId || 'Not assigned'}</span>
              </div>
            </div>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Building size={20} />
                <div>
                  <label>College</label>
                  <p>{studentInfo.collegeName || 'Not specified'}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <GraduationCap size={20} />
                <div>
                  <label>Program</label>
                  <p>{studentInfo.program || 'Not specified'}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Users size={20} />
                <div>
                  <label>Department</label>
                  <p>{studentInfo.department || 'Not specified'}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Calendar size={20} />
                <div>
                  <label>Batch</label>
                  <p>{studentInfo.batchYear || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSections}>
            {/* Personal Information Section */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <User size={20} />
                <h3>Personal Information</h3>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>
                    Full Name <span className={styles.required}>*</span>
                    {errors.name && <span className={styles.errorText}> - {errors.name}</span>}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={studentInfo.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`${styles.input} ${errors.name ? styles.error : ''}`}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Date of Birth</label>
                  <div className={styles.inputWithIcon}>
                    <Calendar size={18} />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={studentInfo.dateOfBirth}
                      onChange={handleChange}
                      className={styles.input}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className={styles.fieldInfo}>Pre-filled from login</div>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Email Address <span className={styles.required}>*</span>
                    {errors.email && <span className={styles.errorText}> - {errors.email}</span>}
                  </label>
                  <div className={styles.inputWithIcon}>
                    <Mail size={18} />
                    <input
                      type="email"
                      name="email"
                      value={studentInfo.email}
                      onChange={handleChange}
                      placeholder="student@college.edu"
                      className={`${styles.input} ${errors.email ? styles.error : ''}`}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className={styles.fieldInfo}>Pre-filled from login</div>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Phone Number <span className={styles.required}>*</span>
                    {errors.phoneNumber && <span className={styles.errorText}> - {errors.phoneNumber}</span>}
                  </label>
                  <div className={styles.inputWithIcon}>
                    <Phone size={18} />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={studentInfo.phoneNumber}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        handleChange({ target: { name: 'phoneNumber', value: formatted } });
                      }}
                      placeholder="(123) 456-7890"
                      className={`${styles.input} ${errors.phoneNumber ? styles.error : ''}`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <GraduationCap size={20} />
                <h3>Academic Information</h3>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Maatram ID</label>
                  <div className={styles.inputWithIcon}>
                    <Clipboard size={18} />
                    <input
                      type="text"
                      name="maatramId"
                      value={studentInfo.maatramId}
                      readOnly
                      className={`${styles.input} ${styles.readonly}`}
                    />
                  </div>
                  <div className={styles.fieldInfo}>Pre-filled from login (Read-only)</div>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    College/University <span className={styles.required}>*</span>
                    {errors.collegeName && <span className={styles.errorText}> - {errors.collegeName}</span>}
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    value={studentInfo.collegeName}
                    onChange={handleChange}
                    placeholder="Enter your college/university name"
                    className={`${styles.input} ${errors.collegeName ? styles.error : ''}`}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Batch Year <span className={styles.required}>*</span>
                    {errors.batchYear && <span className={styles.errorText}> - {errors.batchYear}</span>}
                  </label>
                  <select
                    name="batchYear"
                    value={studentInfo.batchYear}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.batchYear ? styles.error : ''}`}
                    disabled={!isEditing}
                  >
                    <option value="">Select Batch Year</option>
                    {batchYears.map(year => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Current Year <span className={styles.required}>*</span>
                    {errors.currentYear && <span className={styles.errorText}> - {errors.currentYear}</span>}
                  </label>
                  <select
                    name="currentYear"
                    value={studentInfo.currentYear}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.currentYear ? styles.error : ''}`}
                    disabled={!isEditing}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Current Semester <span className={styles.required}>*</span>
                    {errors.semester && <span className={styles.errorText}> - {errors.semester}</span>}
                  </label>
                  <select
                    name="semester"
                    value={studentInfo.semester}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.semester ? styles.error : ''}`}
                    disabled={!isEditing}
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sem => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Program/Degree <span className={styles.required}>*</span>
                    {errors.program && <span className={styles.errorText}> - {errors.program}</span>}
                  </label>
                  <select
                    name="program"
                    value={studentInfo.program}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.program ? styles.error : ''}`}
                    disabled={!isEditing}
                  >
                    <option value="">Select Program</option>
                    {programs.map(program => (
                      <option key={program.value} value={program.value}>
                        {program.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Department <span className={styles.required}>*</span>
                    {errors.department && <span className={styles.errorText}> - {errors.department}</span>}
                  </label>
                  <select
                    name="department"
                    value={studentInfo.department}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.department ? styles.error : ''}`}
                    disabled={!isEditing}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact & Social Information */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <BookOpen size={20} />
                <h3>Contact & Social Profiles</h3>
              </div>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>
                    Residential Address <span className={styles.required}>*</span>
                    {errors.address && <span className={styles.errorText}> - {errors.address}</span>}
                  </label>
                  <div className={styles.textareaContainer}>
                    <Home size={18} />
                    <textarea
                      name="address"
                      value={studentInfo.address}
                      onChange={handleChange}
                      placeholder="Enter your complete address including street, city, state, and PIN code"
                      rows="3"
                      className={`${styles.textarea} ${errors.address ? styles.error : ''}`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>LinkedIn Profile</label>
                  <div className={styles.inputWithIcon}>
                    <Linkedin size={18} />
                    <input
                      type="url"
                      name="linkedinId"
                      value={studentInfo.linkedinId}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={styles.input}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>GitHub Profile</label>
                  <div className={styles.inputWithIcon}>
                    <Github size={18} />
                    <input
                      type="url"
                      name="githubId"
                      value={studentInfo.githubId}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                      className={styles.input}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Portfolio/Other</label>
                  <div className={styles.inputWithIcon}>
                    <Web size={18} />
                    <input
                      type="url"
                      name="otherProfile"
                      value={studentInfo.otherProfile || ''}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      className={styles.input}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Upload Section */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <FileText size={20} />
                <h3>Resume/CV</h3>
              </div>
              <div className={styles.resumeSection}>
                <div className={styles.resumeUploadArea}>
                  {resumePreview ? (
                    <div className={styles.resumePreview}>
                      <div className={styles.resumeHeader}>
                        <FileType size={24} />
                        <div className={styles.resumeInfo}>
                          <h4>Your Resume</h4>
                          <p>PDF Document • {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className={styles.resumeActions}>
                          <a 
                            href={resumePreview} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.viewButton}
                          >
                            <Eye size={16} /> View
                          </a>
                          {isEditing && (
                            <button 
                              type="button"
                              className={styles.removeButton}
                              onClick={removeResume}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.uploadPrompt}>
                      <div className={styles.uploadIcon}>
                        <Upload size={32} />
                      </div>
                      <div className={styles.uploadText}>
                        <h4>Upload your resume</h4>
                        <p>Drag & drop or click to browse</p>
                        <p className={styles.fileInfo}>PDF only • Max 5MB</p>
                      </div>
                    </div>
                  )}
                  
                  {isEditing && (
                    <label className={styles.uploadButton}>
                      <Upload size={16} />
                      {resumePreview ? 'Change Resume' : 'Upload Resume'}
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                  
                  {errors.resumeImage && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{errors.resumeImage}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formFooter}>
            <div className={styles.formActions}>
              {!isEditing ? (
                <button 
                  type="button" 
                  className={styles.editButton}
                  onClick={handleEdit}
                >
                  <Edit2 size={16} /> Edit Profile
                </button>
              ) : (
                <>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={handleCancel}
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className={styles.spinner} /> Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
            <div className={styles.formHelp}>
              <Info size={16} />
              <p>Fields marked with <span className={styles.required}>*</span> are required</p>
            </div>
          </div>
        </form>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <GraduationCap size={20} />
            <span>Student Portal</span>
          </div>
          <p className={styles.copyright}>© 2024 Student Profile System. All rights reserved.</p>
          <p className={styles.support}>
            <Headphones size={16} />
            Need help? Contact support: support@studentportal.edu
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StudentProfile;