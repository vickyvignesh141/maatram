import React, { useState, useEffect } from "react";
import {
  UserCircle,
  ChevronDown,
  Bell,
  LogOut,
  Trash2
} from "lucide-react";
import logo from "../../imgs/logo.png";
import BASE_URL from "../../baseurl";
import "./mentortop.css";

export default function MentorTopBar() {
  const [mentor, setMentor] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications] = useState(3);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch mentor data
  useEffect(() => {
    const username = localStorage.getItem("loggedUser");
    if (!username) return;

    fetch(`${BASE_URL}/get_mentor/${username}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setMentor(json.data);

          // Set profile image preview (cache busting)
          if (json.data.profileImage) {
            setImagePreview(
              `${BASE_URL}/uploads/${json.data.profileImage}?t=${Date.now()}`
            );
          }
        }
      })
      .catch(() => console.log("Error fetching mentor data"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const removeProfileImage = () => {
    setImagePreview(null);
    setMentor(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  // Skeleton Loader
  if (!mentor) {
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
        <h2 className="appName">Mentor Dashboard</h2>
      </div>

      {/* Right Section */}
      <div className="rightSection">
        {/* Notifications */}
        <button className="notificationBtn">
          <Bell size={22} />
          {notifications > 0 && (
            <span className="notificationBadge">{notifications}</span>
          )}
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
                  alt={mentor.name}
                  className="avatarImage"
                  onError={() => setImagePreview(null)}
                />
              ) : (
                <UserCircle size={28} />
              )}

              {/* Optional remove image (frontend only)
              {imagePreview && (
                <button
                  className="removeImageBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProfileImage();
                  }}
                > 
                  <Trash2 size={16} />
                </button>
              )} */}
            </div>

            <div className="userDetails">
              <h4 className="userName">{mentor.name}</h4>
              <p className="userId">{mentor.username}</p>
            </div>

            <ChevronDown
              size={20}
              className={`dropdownIcon ${dropdownOpen ? "rotated" : ""}`}
            />
          </div>

          {dropdownOpen && (
            <div className="dropdownMenu">
              <div className="dropdownHeader">
                <div className="dropdownAvatar">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={mentor.name}
                      className="avatarImage"
                    />
                  ) : (
                    <UserCircle size={24} />
                  )}
                </div>
                <div>
                  <p className="dropdownName">{mentor.name}</p>
                  <p className="dropdownEmail">{mentor.username || "N/A"}</p>
                </div>
              </div>

              <div className="dropdownDivider"></div>

              <a href="/mentor/profile" className="dropdownItem">
                <UserCircle size={18} />
                <span>My Profile</span>
              </a>

              <div className="dropdownDivider"></div>

              <button
                onClick={handleLogout}
                className="dropdownItemLogout"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
