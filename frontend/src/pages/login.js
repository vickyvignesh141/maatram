import React, { useState } from "react";
import baseurl from "../baseurl";
import "./login.css";
import { 
  User, 
  Key, 
  Users, 
  UserCheck, 
  Settings, 
  ShieldCheck, 
  TrendingUp, 
  Target,
  ChevronRight,
  Loader2,
  AlertCircle,
  BookOpen,
  GraduationCap,
  BarChart3,
  Mail,
  Lock,
  HelpCircle
} from "lucide-react";
import logo from "../imgs/logo.png"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!username || !password || !userType) {
      setMsg("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setMsg("");

    const payload = { username, password, userType };

    try {
      const res = await fetch(`${baseurl}/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        // Store user data
        localStorage.setItem("loggedUser", username);
        localStorage.setItem("userType", userType);
        localStorage.setItem("token", data.token || "");
        
        // Add slight delay for better UX
        setTimeout(() => {
          const redirects = {
            "Student": "/student/dashboard",
            "Mentor": "/mentor/dashboard",
            "Admin": "/admin/dashboard"
          };
          window.location.href = redirects[userType] || "/dashboard";
        }, 300);
        
      } else {
        setMsg(data.msg || "Invalid credentials");
      }
    } catch (error) {
      setMsg("Unable to connect to server. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const userTypeIcons = {
    "Student": <GraduationCap size={20} />,
    "Mentor": <UserCheck size={20} />,
    "Admin": <Settings size={20} />
  };

  return (
    <div className="login-container">
      {/* Brand / Info Section */}
      <div className="brand-section">
        <div className="brand-header">
          <div className="brand-logo">
 
            <div>
              {/* <h1 className="brand-title">Maatram</h1> */}
              <img src={logo} alt="Maatram Logo" className="header1-logo" />
              <p className="brand-subtitle">Student Profiling Platform</p>
            </div>
          </div>
        </div>

        <div className="welcome-content">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your journey with Maatram Foundation</p>
          
          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">
                <ShieldCheck size={12} />
              </div>
              <span>Secure & encrypted login</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <TrendingUp size={12} />
              </div>
              <span>Track student progress in real-time</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Target size={12} />
              </div>
              <span>Personalized learning paths</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <BarChart3 size={12} />
              </div>
              <span>Comprehensive analytics dashboard</span>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          {/* <ShieldCheck size={14} style={{ marginRight: '8px' }} />
          © {new Date().getFullYear()} Maatram Foundation. All rights reserved. */}
        </div>
      </div>

      {/* Login Form Section */}
      <div className="login-section">
        <div className="login-header">
          <h1>Sign In</h1>
          <p>Enter your credentials to access your account</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">
              <User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Maatram ID <span>*</span>
            </label>
            <div className="input-with-icon">
              <User size={20} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Enter your Maatram ID (e.g., MAA000001)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Password <span>*</span>
            </label>
            <div className="input-with-icon">
              <Key size={20} className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="user-type-group">
            <label className="user-type-label">
              <Users size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Select User Type <span>*</span>
            </label>
            <div className="user-type-options">
              {["Student", "Mentor", "Admin"].map((type) => (
                <label key={type} className="user-type-option">
                  <input
                    type="radio"
                    value={type}
                    checked={userType === type}
                    onChange={(e) => setUserType(e.target.value)}
                    required
                  />
                  <div className="user-type-card">
                    <span className="user-type-icon">
                      {userTypeIcons[type]}
                    </span>
                    {type}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button 
            className="submit-btn" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="loading-spinner" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ChevronRight size={20} className="btn-icon" />
              </>
            )}
          </button>

          {msg && (
            <div className="error-message">
              <AlertCircle size={18} />
              {msg}
            </div>
          )}

          <div className="form-footer">
            {/* <p>
              <HelpCircle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Need help? <a href="/support">Contact Support</a> or <a href="/forgot-password">Reset Password</a>
            </p> */}
          </div>
        </form>
      </div>
    </div>
  );
}