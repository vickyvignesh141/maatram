import React, { useState, useEffect } from 'react';
import './StudentProfile.css';

const StudentProfile = ({ loginData }) => {
  // Initial state with pre-filled data from login
  const [studentInfo, setStudentInfo] = useState({
    studentName: '',
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
    profileImage: null,
    resumeImage: null
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(true); // Changed to true for immediate editing
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

    if (!studentInfo.studentName.trim()) {
      newErrors.studentName = 'Full name is required';
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
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Profile image should be less than 2MB'
        }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Please upload an image file'
        }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
        setStudentInfo(prev => ({
          ...prev,
          profileImage: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          resumeImage: 'Resume should be less than 5MB'
        }));
        return;
      }
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({
          ...prev,
          resumeImage: 'Please upload a PDF file'
        }));
        return;
      }
      setStudentInfo(prev => ({
        ...prev,
        resumeImage: file
      }));
      setResumePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Student Profile Submitted:', studentInfo);
      setIsSubmitted(true);
      setIsEditing(false);
      setLoading(false);
      
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
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
    }
  };

  const removeProfileImage = () => {
    setProfileImagePreview(null);
    setStudentInfo(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  const removeResume = () => {
    setResumePreview(null);
    setStudentInfo(prev => ({
      ...prev,
      resumeImage: null
    }));
  };

  // Helper function to format phone number
  const formatPhoneNumber = (value) => {
    if (!value) return '';
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  return (
    <div className="student-profile-container">
      <div className="profile-header">
        <div className="header-content">
          <h1><i className="fas fa-user-graduate"></i> Student Profile</h1>
          <p className="subtitle">Complete your profile to access all campus resources</p>
        </div>
        <div className="profile-status">
          <span className={`status-badge ${isEditing ? 'editing' : 'viewing'}`}>
            <i className={`fas ${isEditing ? 'fa-edit' : 'fa-eye'}`}></i>
            {isEditing ? 'Editing Mode' : 'Viewing Mode'}
          </span>
        </div>
      </div>

      {isSubmitted && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div className="profile-card">
        <div className="profile-header-section">
          <div className="profile-image-section">
            <div className="profile-image-container">
              {profileImagePreview ? (
                <img 
                  src={profileImagePreview} 
                  alt="Profile" 
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  <i className="fas fa-user-graduate"></i>
                </div>
              )}
              {isEditing && (
                <div className="image-overlay">
                  <label className="camera-icon">
                    <i className="fas fa-camera"></i>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              )}
            </div>
            {errors.profileImage && (
              <div className="error-message">{errors.profileImage}</div>
            )}
          </div>

          <div className="profile-basic-info">
            <div className="info-header">
              <h2>
                {studentInfo.studentName || 'Your Name'}
                <span className="verified-badge">
                  <i className="fas fa-check-circle"></i> Student
                </span>
              </h2>
              <div className="student-id">
                <i className="fas fa-id-card"></i>
                <span>Maatram ID: {studentInfo.maatramId || 'Not assigned'}</span>
              </div>
            </div>
            
            <div className="info-grid">
              <div className="info-item">
                <i className="fas fa-university"></i>
                <div>
                  <label>College</label>
                  <p>{studentInfo.collegeName || 'Not specified'}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-graduation-cap"></i>
                <div>
                  <label>Program</label>
                  <p>{studentInfo.program || 'Not specified'}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-building"></i>
                <div>
                  <label>Department</label>
                  <p>{studentInfo.department || 'Not specified'}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-calendar-alt"></i>
                <div>
                  <label>Batch</label>
                  <p>{studentInfo.batchYear || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-sections">
            {/* Personal Information Section */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-user-circle"></i>
                <h3>Personal Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Full Name <span className="required">*</span>
                    {errors.studentName && <span className="error-text"> - {errors.studentName}</span>}
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={studentInfo.studentName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.studentName ? 'error-input' : ''}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <div className="input-with-icon">
                    <i className="fas fa-calendar"></i>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={studentInfo.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field-info">Pre-filled from login</div>
                </div>

                <div className="form-group">
                  <label>
                    Email Address <span className="required">*</span>
                    {errors.email && <span className="error-text"> - {errors.email}</span>}
                  </label>
                  <div className="input-with-icon">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      name="email"
                      value={studentInfo.email}
                      onChange={handleChange}
                      placeholder="student@college.edu"
                      className={errors.email ? 'error-input' : ''}
                      required
                    />
                  </div>
                  <div className="field-info">Pre-filled from login</div>
                </div>

                <div className="form-group">
                  <label>
                    Phone Number <span className="required">*</span>
                    {errors.phoneNumber && <span className="error-text"> - {errors.phoneNumber}</span>}
                  </label>
                  <div className="input-with-icon">
                    <i className="fas fa-phone"></i>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={studentInfo.phoneNumber}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        handleChange({ target: { name: 'phoneNumber', value: formatted } });
                      }}
                      placeholder="(123) 456-7890"
                      className={errors.phoneNumber ? 'error-input' : ''}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-graduation-cap"></i>
                <h3>Academic Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Maatram ID</label>
                  <div className="input-with-icon">
                    <i className="fas fa-id-card"></i>
                    <input
                      type="text"
                      name="maatramId"
                      value={studentInfo.maatramId}
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                  <div className="field-info">Pre-filled from login (Read-only)</div>
                </div>

                <div className="form-group">
                  <label>
                    College/University <span className="required">*</span>
                    {errors.collegeName && <span className="error-text"> - {errors.collegeName}</span>}
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    value={studentInfo.collegeName}
                    onChange={handleChange}
                    placeholder="Enter your college/university name"
                    className={errors.collegeName ? 'error-input' : ''}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Batch Year <span className="required">*</span>
                    {errors.batchYear && <span className="error-text"> - {errors.batchYear}</span>}
                  </label>
                  <select
                    name="batchYear"
                    value={studentInfo.batchYear}
                    onChange={handleChange}
                    className={errors.batchYear ? 'error-input' : ''}
                    required
                  >
                    <option value="">Select Batch Year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Current Year <span className="required">*</span>
                    {errors.currentYear && <span className="error-text"> - {errors.currentYear}</span>}
                  </label>
                  <select
                    name="currentYear"
                    value={studentInfo.currentYear}
                    onChange={handleChange}
                    className={errors.currentYear ? 'error-input' : ''}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Current Semester <span className="required">*</span>
                    {errors.semester && <span className="error-text"> - {errors.semester}</span>}
                  </label>
                  <select
                    name="semester"
                    value={studentInfo.semester}
                    onChange={handleChange}
                    className={errors.semester ? 'error-input' : ''}
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sem => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Program/Degree <span className="required">*</span>
                    {errors.program && <span className="error-text"> - {errors.program}</span>}
                  </label>
                  <select
                    name="program"
                    value={studentInfo.program}
                    onChange={handleChange}
                    className={errors.program ? 'error-input' : ''}
                    required
                  >
                    <option value="">Select Program</option>
                    <option value="B.Tech">Bachelor of Technology (B.Tech)</option>
                    <option value="B.E.">Bachelor of Engineering (B.E.)</option>
                    <option value="B.Sc.">Bachelor of Science (B.Sc.)</option>
                    <option value="B.A.">Bachelor of Arts (B.A.)</option>
                    <option value="B.Com">Bachelor of Commerce (B.Com)</option>
                    <option value="BBA">Bachelor of Business Administration (BBA)</option>
                    <option value="M.Tech">Master of Technology (M.Tech)</option>
                    <option value="M.Sc.">Master of Science (M.Sc.)</option>
                    <option value="MBA">Master of Business Administration (MBA)</option>
                    <option value="PhD">Doctor of Philosophy (PhD)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Department <span className="required">*</span>
                    {errors.department && <span className="error-text"> - {errors.department}</span>}
                  </label>
                  <select
                    name="department"
                    value={studentInfo.department}
                    onChange={handleChange}
                    className={errors.department ? 'error-input' : ''}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science & Engineering</option>
                    <option value="Electronics">Electronics & Communication Engineering</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Electrical">Electrical Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Law">Law</option>
                    <option value="Medicine">Medicine</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact & Social Information */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-address-book"></i>
                <h3>Contact & Social Profiles</h3>
              </div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>
                    Residential Address <span className="required">*</span>
                    {errors.address && <span className="error-text"> - {errors.address}</span>}
                  </label>
                  <div className="textarea-container">
                    <i className="fas fa-home"></i>
                    <textarea
                      name="address"
                      value={studentInfo.address}
                      onChange={handleChange}
                      placeholder="Enter your complete address including street, city, state, and PIN code"
                      rows="3"
                      className={errors.address ? 'error-input' : ''}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>LinkedIn Profile</label>
                  <div className="input-with-icon">
                    <i className="fab fa-linkedin"></i>
                    <input
                      type="url"
                      name="linkedinId"
                      value={studentInfo.linkedinId}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>GitHub Profile</label>
                  <div className="input-with-icon">
                    <i className="fab fa-github"></i>
                    <input
                      type="url"
                      name="githubId"
                      value={studentInfo.githubId}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Portfolio/Other</label>
                  <div className="input-with-icon">
                    <i className="fas fa-globe"></i>
                    <input
                      type="url"
                      name="otherProfile"
                      value={studentInfo.otherProfile || ''}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Upload Section */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-file-alt"></i>
                <h3>Resume/CV</h3>
              </div>
              <div className="resume-section">
                <div className="resume-upload-area">
                  {resumePreview ? (
                    <div className="resume-preview-card">
                      <div className="resume-header">
                        <i className="fas fa-file-pdf"></i>
                        <div className="resume-info">
                          <h4>Your Resume</h4>
                          <p>PDF Document • {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="resume-actions">
                          <a 
                            href={resumePreview} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="view-btn"
                          >
                            <i className="fas fa-eye"></i> View
                          </a>
                          <button 
                            type="button"
                            className="remove-resume-btn"
                            onClick={removeResume}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="resume-upload-prompt">
                      <div className="upload-icon">
                        <i className="fas fa-cloud-upload-alt"></i>
                      </div>
                      <div className="upload-text">
                        <h4>Upload your resume</h4>
                        <p>Drag & drop or click to browse</p>
                        <p className="file-info">PDF only • Max 5MB</p>
                      </div>
                    </div>
                  )}
                  
                  <label className="resume-upload-btn">
                    <i className="fas fa-upload"></i>
                    {resumePreview ? 'Change Resume' : 'Upload Resume'}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  
                  {errors.resumeImage && (
                    <div className="error-message">{errors.resumeImage}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <div className="form-actions">
              {!isEditing ? (
                <button 
                  type="button" 
                  className="edit-btn"
                  onClick={handleEdit}
                >
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i> Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
            <div className="form-help">
              <p>
                <i className="fas fa-info-circle"></i>
                Fields marked with <span className="required">*</span> are required
              </p>
            </div>
          </div>
        </form>
      </div>

      <footer className="profile-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fas fa-graduation-cap"></i>
            <span>Student Portal</span>
          </div>
          <p className="copyright">© 2024 Student Profile System. All rights reserved.</p>
          <p className="support">
            <i className="fas fa-headset"></i>
            Need help? Contact support: support@studentportal.edu
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StudentProfile;