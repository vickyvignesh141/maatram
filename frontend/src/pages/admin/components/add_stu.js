import React, { useEffect, useState } from "react";
import baseurl from "../../../baseurl";
import { User, ChevronDown, Bell, Settings, LogOut } from "lucide-react";
import logo from "../../../imgs/logo.png";
import "./add_stu"; // Create this CSS file


export default function Admintop() {
  const [Admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notifications count

  useEffect(() => {
    const username = localStorage.getItem("loggedUser");
    if (username) {
      fetch(`${baseurl}/get_admin/${username}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) setAdmin(json.data);
        })
        .catch(() => console.log("Error fetching Admin data"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!Admin) {
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
    <div className="Admin-topbar">
      {/* Logo Section */}
      <div className="topbar-logo-section">
        <img src={logo} alt="Maatram Logo" className="topbar-logo" />
        <div className="logo-text">
          <h2 className="app-name">Admin Dashboard</h2>
          {/* <p className="app-subtitle">Admin Dashboard</p> */}
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
              {Admin.photo ? (
                <img src={Admin.photo} alt={Admin.name} className="avatar-image" />
              ) : (
                <div className="avatar-fallback">
                  <User size={24} />
                </div>
              )}
            </div>
            <div className="user-details">
              <h4 className="user-name">{Admin.name}</h4>
              <p className="user-id">{Admin.id}</p>
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
                  {Admin.photo ? (
                    <img src={Admin.photo} alt={Admin.name} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <p className="dropdown-name">{Admin.name}</p>
                  <p className="dropdown-email">{Admin.phno}</p>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <a href="/Admin/profile" className="dropdown-item">
                <User size={18} />
                <span>My Profile</span>
              </a>
              
              {/* <a href="/Admin/settings" className="dropdown-item">
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