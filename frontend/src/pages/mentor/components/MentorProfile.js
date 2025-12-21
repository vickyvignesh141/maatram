import React, { useState, useEffect } from 'react';
import './MentorProfile.css';

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
    profileImage: null
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Set pre-filled data when component mounts or loginData changes
  useEffect(() => {
    if (loginData) {
      setMentorInfo(prev => ({
        ...prev,
        dateOfBirth: loginData.dateOfBirth || prev.dateOfBirth,
        email: loginData.email || prev.email
      }));
    }
  }, [loginData]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

    if (!mentorInfo.name.trim()) {
      newErrors.name = 'Name is required';
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
    
    if (!mentorInfo.role.trim()) {
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
        setMentorInfo(prev => ({
          ...prev,
          profileImage: file
        }));
      };
      reader.readAsDataURL(file);
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
      console.log('Mentor Profile Submitted:', mentorInfo);
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
    setMentorInfo(prev => ({
      ...prev,
      profileImage: null
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

  // Calculate years since passed out
  const calculateExperience = () => {
    if (!mentorInfo.yearOfPassedOut) return '';
    const currentYear = new Date().getFullYear();
    const experience = currentYear - parseInt(mentorInfo.yearOfPassedOut);
    return experience > 0 ? `${experience} years experience` : 'Fresh Graduate';
  };

  return (
    <div className="mentor-profile-container">
      <div className="profile-header">
        <div className="header-content">
          <h1><i className="fas fa-user-tie"></i> Mentor Profile</h1>
          <p className="subtitle">Complete your profile to start mentoring students</p>
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
                  <i className="fas fa-user-tie"></i>
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
                {mentorInfo.name || 'Your Name'}
                <span className="mentor-badge">
                  <i className="fas fa-star"></i> Mentor
                </span>
              </h2>
              <div className="mentor-experience">
                <i className="fas fa-briefcase"></i>
                <span>{calculateExperience() || 'Add passed out year'}</span>
              </div>
            </div>
            
            <div className="info-grid">
              <div className="info-item">
                <i className="fas fa-university"></i>
                <div>
                  <label>College</label>
                  <p>{mentorInfo.collegeName || 'Not specified'}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-building"></i>
                <div>
                  <label>Company</label>
                  <p>{mentorInfo.workingCompany || 'Not specified'}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-user-tag"></i>
                <div>
                  <label>Role</label>
                  <p>{mentorInfo.role || 'Not specified'}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-graduation-cap"></i>
                <div>
                  <label>Passed Out</label>
                  <p>{mentorInfo.yearOfPassedOut || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>{mentorInfo.email || 'email@example.com'}</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>{mentorInfo.phoneNumber || '+1 (123) 456-7890'}</span>
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
                    {errors.name && <span className="error-text"> - {errors.name}</span>}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={mentorInfo.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.name ? 'error-input' : ''}
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
                      value={mentorInfo.dateOfBirth}
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
                      value={mentorInfo.email}
                      onChange={handleChange}
                      placeholder="mentor@example.com"
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
                      value={mentorInfo.phoneNumber}
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

            {/* Educational & Professional Information */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-briefcase"></i>
                <h3>Educational & Professional Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    College/University <span className="required">*</span>
                    {errors.collegeName && <span className="error-text"> - {errors.collegeName}</span>}
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    value={mentorInfo.collegeName}
                    onChange={handleChange}
                    placeholder="Enter your college/university name"
                    className={errors.collegeName ? 'error-input' : ''}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Year of Passed Out <span className="required">*</span>
                    {errors.yearOfPassedOut && <span className="error-text"> - {errors.yearOfPassedOut}</span>}
                  </label>
                  <select
                    name="yearOfPassedOut"
                    value={mentorInfo.yearOfPassedOut}
                    onChange={handleChange}
                    className={errors.yearOfPassedOut ? 'error-input' : ''}
                    required
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 30 }, (_, i) => {
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
                    Current Company <span className="required">*</span>
                    {errors.workingCompany && <span className="error-text"> - {errors.workingCompany}</span>}
                  </label>
                  <input
                    type="text"
                    name="workingCompany"
                    value={mentorInfo.workingCompany}
                    onChange={handleChange}
                    placeholder="Enter your current company name"
                    className={errors.workingCompany ? 'error-input' : ''}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Current Role <span className="required">*</span>
                    {errors.role && <span className="error-text"> - {errors.role}</span>}
                  </label>
                  <select
                    name="role"
                    value={mentorInfo.role}
                    onChange={handleChange}
                    className={errors.role ? 'error-input' : ''}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Senior Software Engineer">Senior Software Engineer</option>
                    <option value="Lead Engineer">Lead Engineer</option>
                    <option value="Engineering Manager">Engineering Manager</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Mobile Developer">Mobile Developer</option>
                    <option value="UX/UI Designer">UX/UI Designer</option>
                    <option value="System Architect">System Architect</option>
                    <option value="CTO">CTO</option>
                    <option value="CEO">CEO</option>
                    <option value="Founder">Founder</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Professor">Professor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {mentorInfo.role === 'Other' && (
                  <div className="form-group full-width">
                    <label>Specify Your Role</label>
                    <input
                      type="text"
                      name="customRole"
                      value={mentorInfo.customRole || ''}
                      onChange={(e) => setMentorInfo(prev => ({
                        ...prev,
                        customRole: e.target.value,
                        role: e.target.value
                      }))}
                      placeholder="Enter your specific role"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-map-marker-alt"></i>
                <h3>Address Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Company Address</label>
                  <div className="textarea-container">
                    <i className="fas fa-building"></i>
                    <textarea
                      name="companyAddress"
                      value={mentorInfo.companyAddress}
                      onChange={handleChange}
                      placeholder="Enter your company address including street, city, state, and country"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Home Address</label>
                  <div className="textarea-container">
                    <i className="fas fa-home"></i>
                    <textarea
                      name="homeAddress"
                      value={mentorInfo.homeAddress}
                      onChange={handleChange}
                      placeholder="Enter your home address (optional)"
                      rows="3"
                    />
                  </div>
                </div>

                {errors.address && (
                  <div className="form-group full-width">
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i>
                      {errors.address}
                    </div>
                  </div>
                )}

                <div className="form-group full-width">
                  <div className="address-preference">
                    <label>Preferred Contact Address:</label>
                    <div className="preference-options">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="preferredAddress"
                          value="company"
                          checked={mentorInfo.preferredAddress === 'company'}
                          onChange={(e) => setMentorInfo(prev => ({
                            ...prev,
                            preferredAddress: e.target.value
                          }))}
                        />
                        <span>Company Address</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="preferredAddress"
                          value="home"
                          checked={mentorInfo.preferredAddress === 'home'}
                          onChange={(e) => setMentorInfo(prev => ({
                            ...prev,
                            preferredAddress: e.target.value
                          }))}
                        />
                        <span>Home Address</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Profiles */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-network-wired"></i>
                <h3>Professional Profiles</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>LinkedIn Profile</label>
                  <div className="input-with-icon">
                    <i className="fab fa-linkedin"></i>
                    <input
                      type="url"
                      name="linkedinId"
                      value={mentorInfo.linkedinId}
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
                      value={mentorInfo.githubId}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Portfolio/Website</label>
                  <div className="input-with-icon">
                    <i className="fas fa-globe"></i>
                    <input
                      type="url"
                      name="portfolioLink"
                      value={mentorInfo.portfolioLink}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <div className="profile-verification">
                    <div className="verification-status">
                      <i className="fas fa-check-circle verified"></i>
                      <span>LinkedIn Verified</span>
                    </div>
                    <div className="verification-status">
                      <i className="fas fa-check-circle verified"></i>
                      <span>GitHub Verified</span>
                    </div>
                    <div className="verification-status">
                      <i className="fas fa-clock pending"></i>
                      <span>Portfolio Pending</span>
                    </div>
                  </div>
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
            <i className="fas fa-user-tie"></i>
            <span>Mentor Portal</span>
          </div>
          <p className="copyright">© 2024 Mentor Profile System. All rights reserved.</p>
          <p className="support">
            <i className="fas fa-headset"></i>
            Need help? Contact support: mentors@portal.edu
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MentorProfile;