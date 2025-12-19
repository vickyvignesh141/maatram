import React, { useEffect, useState } from "react";
import baseurl from "../../baseurl";
import { User, ChevronDown, Bell, Settings, LogOut } from "lucide-react";
import logo from "../../imgs/logo.png";
import "./mentortop.css"; // Create this CSS file

export default function MentorTopy() {
  const [mentor, setmentor] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notifications count

  useEffect(() => {
    const username = localStorage.getItem("loggedUser");
    if (username) {
      fetch(`${baseurl}/get_mentor/${username}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) setmentor(json.data);
        })
        .catch(() => console.log("Error fetching mentor data"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!mentor) {
    return (
      <div className="topbar-skeleton">
        <div className="skeleton-logo"></div>
        <div className="skeleton-user">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-details">
            <div className="skeleton-name"></div>
            <div className="skeleton-info"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mentor-topbar">
      {/* Logo Section */}
      <div className="topbar-logo-section">
        <img src={logo} alt="Maatram Logo" className="topbar-logo" />
        <div className="logo-text">
          <h2 className="app-name">Mentor Dashboard</h2>
          {/* <p className="app-subtitle">mentor Dashboard</p> */}
        </div>
      </div>

      {/* Right Section */}
      <div className="topbar-right-section">
        {/* Notifications */}
        <div className="notification-wrapper">
          <button className="notification-btn">
            <Bell size={22} />
            {notifications > 0 && (
              <span className="notification-badge">{notifications}</span>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="user-profile-wrapper">
          <div 
            className="user-profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-avatar">
              {mentor.photo ? (
                <img src={mentor.photo} alt={mentor.name} className="avatar-image" />
              ) : (
                <div className="avatar-fallback">
                  <User size={24} />
                </div>
              )}
            </div>
            <div className="user-details">
              <h4 className="user-name">{mentor.name}</h4>
              <p className="user-id">{mentor.id}</p>
            </div>
            <ChevronDown 
              size={20} 
              className={`dropdown-icon ${dropdownOpen ? 'rotated' : ''}`}
            />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-avatar">
                  {mentor.photo ? (
                    <img src={mentor.photo} alt={mentor.name} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <p className="dropdown-name">{mentor.name}</p>
                  <p className="dropdown-email">{mentor.phno}</p>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <a href="/mentor/profile" className="dropdown-item">
                <User size={18} />
                <span>My Profile</span>
              </a>
              
              {/* <a href="/mentor/settings" className="dropdown-item">
                <Settings size={18} />
                <span>Settings</span>
              </a> */}
              
              <div className="dropdown-divider"></div>
              
              <button onClick={handleLogout} className="dropdown-item logout">
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