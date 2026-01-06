import React, { useState, useEffect } from 'react';
import styles from './MentorProfile.module.css';
import BASE_URL from "../../../baseurl";
import MentorTopBar from "../../mentornav/mentortop";
import { 
  User, 
  Briefcase, 
  Building, 
  GraduationCap, 
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  Globe,
  Linkedin,
  Github,
  Upload,
  Camera,
  CheckCircle,
  Edit2,
  Save,
  X,
  Eye,
  Trash2,
  Clipboard,
  Award,
  BookOpen,
  Users,
  AlertCircle,
  Loader2,
  ExternalLink,
  FileText,
  Star,
  Clock,
  Info,
  Headphones,
  ChevronDown,
  Bell,
  Settings,
  LogOut,
  UserCircle
} from "lucide-react";

const MentorProfile = ({ loginData }) => {
  // Initial state with pre-filled data from login
  const [mentorInfo, setMentorInfo] = useState({
    name: '',
    dateOfBirth: loginData?.dateOfBirth || '',
    yearOfPassedOut: '',
    collegeName: '',
    workingCompany: '',
    role: '',
    companyAddress: '',
    homeAddress: '',
    linkedinId: '',
    githubId: '',
    portfolioLink: '',
    email: loginData?.email || '',
    phoneNumber: '',
    profileImage: '',
    expertise: '',
    yearsOfExperience: '',
    mentorId: loginData?.mentorId || '',
    preferredAddress: 'company',
    customRole: ''
  });

  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Set pre-filled data when component mounts or loginData changes
  useEffect(() => {
    if (loginData) {
      setMentorInfo(prev => ({
        ...prev,
        mentorId: loginData.mentorId || loginData.username || prev.mentorId,
        dateOfBirth: loginData.dateOfBirth || prev.dateOfBirth,
        email: loginData.email || prev.email
      }));
    }
  }, [loginData]);

  useEffect(() => {
    const fetchMentorData = async () => {
      const username = localStorage.getItem("loggedUser");
      if (username) {
        try {
          const response = await fetch(`${BASE_URL}/mentor_profile/${username}`);
          const json = await response.json();
          
          if (json.success) {
            const data = json.data;
            const mentorData = {
              name: data.name || "",
              phoneNumber: data.phoneNumber || data.phone || "",
              mentorId: data.username || "",
              dateOfBirth: data.dateOfBirth || "",
              yearOfPassedOut: data.yearOfPassedOut || "",
              collegeName: data.collegeName || "",
              workingCompany: data.workingCompany || "",
              role: data.role || "",
              companyAddress: data.companyAddress || "",
              homeAddress: data.homeAddress || "",
              email: data.email || "",
              profileImage: data.profileImage || "",
              linkedinId: data.linkedinId || "",
              githubId: data.githubId || "",
              portfolioLink: data.portfolioLink || "",
              expertise: data.expertise || "",
              yearsOfExperience: data.yearsOfExperience || "",
              preferredAddress: data.preferredAddress || 'company',
              customRole: data.customRole || ''
            };

            setMentorInfo(prev => ({ ...prev, ...mentorData }));
            setOriginalData(mentorData);
            
            // Set image preview if profile image exists
            if (data.profileImage) {
              setImagePreview(`${BASE_URL}/uploads/${data.profileImage}`);
            }
          }
        } catch (error) {
          console.error("Error fetching mentor data:", error);
        }
      }
    };

    fetchMentorData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

    if (!mentorInfo.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!mentorInfo.email || !emailRegex.test(mentorInfo.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!mentorInfo.phoneNumber || !phoneRegex.test(mentorInfo.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Valid phone number is required';
    }
    
    if (!mentorInfo.collegeName.trim()) {
      newErrors.collegeName = 'College name is required';
    }
    
    if (!mentorInfo.yearOfPassedOut) {
      newErrors.yearOfPassedOut = 'Year of passed out is required';
    }
    
    if (!mentorInfo.workingCompany.trim()) {
      newErrors.workingCompany = 'Working company is required';
    }
    
    if (!mentorInfo.role.trim() && !mentorInfo.customRole.trim()) {
      newErrors.role = 'Role is required';
    }
    
    if (!mentorInfo.companyAddress.trim() && !mentorInfo.homeAddress.trim()) {
      newErrors.address = 'Either company address or home address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentorInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Handle role change
    if (name === 'role' && value !== 'Other') {
      setMentorInfo(prev => ({
        ...prev,
        customRole: ''
      }));
    }
    
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

    setMentorInfo(prev => ({
      ...prev,
      profileImage: file
    }));

    if (errors.profileImage) {
      setErrors(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", mentorInfo.mentorId);

      // Calculate years of experience if not provided
      if (!mentorInfo.yearsOfExperience && mentorInfo.yearOfPassedOut) {
        const currentYear = new Date().getFullYear();
        const experience = currentYear - parseInt(mentorInfo.yearOfPassedOut);
        formData.append("yearsOfExperience", experience > 0 ? experience : 0);
      }

      // Append all other fields
      Object.keys(mentorInfo).forEach((key) => {
        if (key === "profileImage") {
          if (mentorInfo[key]) formData.append(key, mentorInfo[key]);
        } else if (key !== "mentorId" && key !== "yearsOfExperience") {
          formData.append(key, mentorInfo[key] || "");
        }
      });

      const response = await fetch(`${BASE_URL}/mentor_profile`, {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        setIsEditing(false);
        setLoading(false);

        // Update original data
        setOriginalData({ ...mentorInfo });

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
        setMentorInfo(originalData);
        setImagePreview(originalData.profileImage ? `${BASE_URL}/uploads/${originalData.profileImage}` : null);
      }
    }
  };

  const removeProfileImage = () => {
    setImagePreview(null);
    setMentorInfo(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  // Helper function to format phone number
  const formatPhoneNumber = (value) => {
  if (!value) return "";
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");

  // Limit to 10 digits only
  return digits.slice(0, 10);
};

  // Calculate years of experience
  const calculateExperience = () => {
    if (mentorInfo.yearsOfExperience) {
      return `${mentorInfo.yearsOfExperience} years`;
    }
    if (mentorInfo.yearOfPassedOut) {
      const currentYear = new Date().getFullYear();
      const experience = currentYear - parseInt(mentorInfo.yearOfPassedOut);
      return experience > 0 ? `${experience} years` : 'Fresh Graduate';
    }
    return 'Not specified';
  };

  // Generate passed out years (last 30 years)
  const passedOutYears = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year.toString() };
  });

  const roles = [
    'Software Engineer',
    'Senior Software Engineer',
    'Lead Engineer',
    'Engineering Manager',
    'Product Manager',
    'Project Manager',
    'Data Scientist',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Mobile Developer',
    'UX/UI Designer',
    'System Architect',
    'CTO',
    'CEO',
    'Founder',
    'Consultant',
    'Researcher',
    'Professor',
    'Other'
  ];

  const expertiseAreas = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity',
    'UI/UX Design',
    'Product Management',
    'Project Management',
    'Software Architecture',
    'Database Design',
    'AI/ML',
    'Blockchain',
    'IoT',
    'Game Development',
    'Embedded Systems',
    'Networking',
    'Testing/QA',
    'Business Analysis'
  ];

  return (
    <div className={styles.container}>
      <MentorTopBar />
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <Briefcase className={styles.headerIcon} />
            <h1>Mentor Profile</h1>
          </div>
          <p className={styles.subtitle}>Complete your profile to start mentoring students</p>
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
                {mentorInfo.name || 'Your Name'}
                <span className={styles.mentorBadge}>
                  <Star size={14} />
                  <span>Verified Mentor</span>
                </span>
              </h2>
              <div className={styles.mentorId}>
                <Award size={16} />
                <span>Mentor ID: {mentorInfo.mentorId || 'Not assigned'}</span>
              </div>
            </div>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <GraduationCap size={20} />
                <div>
                  <label>College</label>
                  <p>{mentorInfo.collegeName || 'Not specified'}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Building size={20} />
                <div>
                  <label>Company</label>
                  <p>{mentorInfo.workingCompany || 'Not specified'}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Briefcase size={20} />
                <div>
                  <label>Role</label>
                  <p>{mentorInfo.role || mentorInfo.customRole || 'Not specified'}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Clock size={20} />
                <div>
                  <label>Experience</label>
                  <p>{calculateExperience()}</p>
                </div>
              </div>
            </div>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>{mentorInfo.email || 'email@example.com'}</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>{mentorInfo.phoneNumber || '+1 (123) 456-7890'}</span>
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
                    value={mentorInfo.name}
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
                      value={mentorInfo.dateOfBirth}
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
                      value={mentorInfo.email}
                      onChange={handleChange}
                      placeholder="mentor@example.com"
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
                      value={mentorInfo.phoneNumber}
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

            {/* Educational & Professional Information */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <Briefcase size={20} />
                <h3>Educational & Professional Information</h3>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Mentor ID</label>
                  <div className={styles.inputWithIcon}>
                    <Award size={18} />
                    <input
                      type="text"
                      name="mentorId"
                      value={mentorInfo.mentorId}
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
                    value={mentorInfo.collegeName}
                    onChange={handleChange}
                    placeholder="Enter your college/university name"
                    className={`${styles.input} ${errors.collegeName ? styles.error : ''}`}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Year of Passed Out <span className={styles.required}>*</span>
                    {errors.yearOfPassedOut && <span className={styles.errorText}> - {errors.yearOfPassedOut}</span>}
                  </label>
                  <select
                    name="yearOfPassedOut"
                    value={mentorInfo.yearOfPassedOut}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.yearOfPassedOut ? styles.error : ''}`}
                    disabled={!isEditing}
                  >
                    <option value="">Select Year</option>
                    {passedOutYears.map(year => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Current Company <span className={styles.required}>*</span>
                    {errors.workingCompany && <span className={styles.errorText}> - {errors.workingCompany}</span>}
                  </label>
                  <input
                    type="text"
                    name="workingCompany"
                    value={mentorInfo.workingCompany}
                    onChange={handleChange}
                    placeholder="Enter your current company name"
                    className={`${styles.input} ${errors.workingCompany ? styles.error : ''}`}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Current Role <span className={styles.required}>*</span>
                    {errors.role && <span className={styles.errorText}> - {errors.role}</span>}
                  </label>
                  <select
                    name="role"
                    value={mentorInfo.role}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.role ? styles.error : ''}`}
                    disabled={!isEditing}
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {mentorInfo.role === 'Other' && (
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Specify Your Role</label>
                    <input
                      type="text"
                      name="customRole"
                      value={mentorInfo.customRole || ''}
                      onChange={handleChange}
                      placeholder="Enter your specific role"
                      className={styles.input}
                      disabled={!isEditing}
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>Area of Expertise</label>
                  <select
                    name="expertise"
                    value={mentorInfo.expertise}
                    onChange={handleChange}
                    className={styles.select}
                    disabled={!isEditing}
                  >
                    <option value="">Select Expertise</option>
                    {expertiseAreas.map(area => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <MapPin size={20} />
                <h3>Address Information</h3>
              </div>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Company Address</label>
                  <div className={styles.textareaContainer}>
                    <Building size={18} />
                    <textarea
                      name="companyAddress"
                      value={mentorInfo.companyAddress}
                      onChange={handleChange}
                      placeholder="Enter your company address including street, city, state, and country"
                      rows="3"
                      className={styles.textarea}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Home Address</label>
                  <div className={styles.textareaContainer}>
                    <Home size={18} />
                    <textarea
                      name="homeAddress"
                      value={mentorInfo.homeAddress}
                      onChange={handleChange}
                      placeholder="Enter your home address (optional)"
                      rows="3"
                      className={styles.textarea}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {errors.address && (
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{errors.address}</span>
                    </div>
                  </div>
                )}

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <div className={styles.addressPreference}>
                    <label>Preferred Contact Address:</label>
                    <div className={styles.preferenceOptions}>
                      <label className={styles.radioOption}>
                        <input
                          type="radio"
                          name="preferredAddress"
                          value="company"
                          checked={mentorInfo.preferredAddress === 'company'}
                          onChange={(e) => setMentorInfo(prev => ({
                            ...prev,
                            preferredAddress: e.target.value
                          }))}
                          disabled={!isEditing}
                        />
                        <span>Company Address</span>
                      </label>
                      <label className={styles.radioOption}>
                        <input
                          type="radio"
                          name="preferredAddress"
                          value="home"
                          checked={mentorInfo.preferredAddress === 'home'}
                          onChange={(e) => setMentorInfo(prev => ({
                            ...prev,
                            preferredAddress: e.target.value
                          }))}
                          disabled={!isEditing}
                        />
                        <span>Home Address</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Profiles */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <Globe size={20} />
                <h3>Professional Profiles</h3>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>LinkedIn Profile</label>
                  <div className={styles.inputWithIcon}>
                    <Linkedin size={18} />
                    <input
                      type="url"
                      name="linkedinId"
                      value={mentorInfo.linkedinId}
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
                      value={mentorInfo.githubId}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                      className={styles.input}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Portfolio/Website</label>
                  <div className={styles.inputWithIcon}>
                    <Globe size={18} />
                    <input
                      type="url"
                      name="portfolioLink"
                      value={mentorInfo.portfolioLink}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      className={styles.input}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <div className={styles.profileVerification}>
                    <div className={styles.verificationStatus}>
                      <CheckCircle size={16} className={styles.verified} />
                      <span>LinkedIn Verified</span>
                    </div>
                    <div className={styles.verificationStatus}>
                      <CheckCircle size={16} className={styles.verified} />
                      <span>GitHub Verified</span>
                    </div>
                    <div className={styles.verificationStatus}>
                      <Clock size={16} className={styles.pending} />
                      <span>Portfolio Pending</span>
                    </div>
                  </div>
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
            <Briefcase size={20} />
            <span>Mentor Portal</span>
          </div>
          <p className={styles.copyright}>© 2024 Mentor Profile System. All rights reserved.</p>
          <p className={styles.support}>
            <Headphones size={16} />
            Need help? Contact support: mentors@portal.edu
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MentorProfile;