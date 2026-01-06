import React, { useState, useEffect } from "react";
import { 
  UserCircle, 
  ChevronDown, 
  Bell, 
  LogOut, 
  Camera, 
  Trash2, 
  CheckCircle 
} from "lucide-react";
import logo from "../../imgs/logo.png";
import BASE_URL from "../../baseurl";
import "./StudentTopBar.css"; // Changed from styles import

export default function StudentTopBar() {
  const [student, setStudent] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications] = useState(3);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch student data
  useEffect(() => {
    const username = localStorage.getItem("loggedUser");
    if (!username) return;

    fetch(`${BASE_URL}/get_student/${username}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setStudent(json.data);

          // Set frontend-only image preview with cache busting
          if (json.data.profileImage) {
            setImagePreview(`${BASE_URL}/uploads/${json.data.profileImage}?t=${Date.now()}`);
          }
        }
      })
      .catch(() => console.log("Error fetching student data"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const removeProfileImage = () => {
    setImagePreview(null);
    setStudent(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  if (!student) {
    return (
      <div className="topbarSkeleton">
        <div className="skeletonLogo"></div>
        <div className="skeletonUser">
          <div className="skeletonAvatar"></div>
          <div className="skeletonDetails"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="topbar">
      {/* Logo Section */}
      <div className="logoSection">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="appName">Student Dashboard</h2>
      </div>

      {/* Right Section */}
      <div className="rightSection">
        {/* Notifications */}
        <button className="notificationBtn">
          <Bell size={22} />
          {notifications > 0 && <span className="notificationBadge">{notifications}</span>}
        </button>

        {/* User Profile */}
        <div className="userProfileWrapper">
          <div
            className="userProfile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="avatarContainer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={student.name}
                  className="avatarImage"
                  onError={() => setImagePreview(null)}
                />
              ) : (
                <UserCircle size={28} />
              )}

              {/* Optional: Remove button 
              {imagePreview && (
                <button className="removeImageBtn" onClick={(e) => {
                  e.stopPropagation();
                  removeProfileImage();
                }}>
                  <Trash2 size={16} />
                </button>
              )}*/}

              {/* Optional: Upload button */}
              {/* <label className="uploadOverlay">
                <Camera size={16} />
                <input type="file" accept="image/*" hidden />
              </label> */}
            </div>

            <div className="userDetails">
              <h4 className="userName">{student.name}</h4>
              <p className="userId">{student.username}</p>
            </div>

            <ChevronDown
              size={20}
              className={`dropdownIcon ${dropdownOpen ? 'rotated' : ''}`}
            />
          </div>

          {dropdownOpen && (
            <div className="dropdownMenu">
              <div className="dropdownHeader">
                <div className="dropdownAvatar">
                  {imagePreview ? (
                    <img src={imagePreview} alt={student.name} className="avatarImage" />
                  ) : (
                    <UserCircle size={24} />
                  )}
                </div>
                <div>
                  <p className="dropdownName">{student.name}</p>
                  <p className="dropdownEmail">{student.username || "N/A"}</p>
                </div>
              </div>

              <div className="dropdownDivider"></div>

              <a href="/student/profile" className="dropdownItem">
                <UserCircle size={18} /> <span>My Profile</span>
              </a>

              <div className="dropdownDivider"></div>

              <button onClick={handleLogout} className="dropdownItemLogout">
                <LogOut size={18} /> <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}