import React, { useState } from "react";
import baseurl from "../baseurl";
import styles from "./login.module.css";
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
  <div className={styles.loginContainer}>
    {/* Brand / Info Section */}
    <div className={styles.brandSection}>
      <div className={styles.brandHeader}>
        <div className={styles.brandLogo}>
          <div>
            {/* <h1 className="brand-title">Maatram</h1> */}
            <img src={logo} alt="Maatram Logo" className={styles.header1Logo} />
            <p className={styles.brandSubtitle}>Student Profiling Platform</p>
          </div>
        </div>
      </div>

      <div className={styles.welcomeContent}>
        <h2>Welcome Back</h2>
        <p>Sign in to continue your journey with Maatram Foundation</p>

        <div className={styles.features}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <ShieldCheck size={12} />
            </div>
            <span>Secure & encrypted login</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <TrendingUp size={12} />
            </div>
            <span>Track student progress in real-time</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <Target size={12} />
            </div>
            <span>Personalized learning paths</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <BarChart3 size={12} />
            </div>
            <span>Comprehensive analytics dashboard</span>
          </div>
        </div>
      </div>

      <div className={styles.brandFooter}>
        {/* footer content */}
      </div>
    </div>

    {/* Login Form Section */}
    <div className={styles.loginSection}>
      <div className={styles.loginHeader}>
        <h1>Sign In</h1>
        <p>Enter your credentials to access your account</p>
      </div>

      <form className={styles.loginForm} onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <User size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Maatram ID <span>*</span>
          </label>
          <div className={styles.inputWithIcon}>
            <User size={20} className={styles.inputIcon} />
            <input
              type="text"
              className={styles.formInput}
              placeholder="Enter your Maatram ID (e.g., MAA000001)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <Lock size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Password <span>*</span>
          </label>
          <div className={styles.inputWithIcon}>
            <Key size={20} className={styles.inputIcon} />
            <input
              type="password"
              className={styles.formInput}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.userTypeGroup}>
          <label className={styles.userTypeLabel}>
            <Users size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Select User Type <span>*</span>
          </label>
          <div className={styles.userTypeOptions}>
            {["Student", "Mentor", "Admin"].map((type) => (
              <label key={type} className={styles.userTypeOption}>
                <input
                  type="radio"
                  value={type}
                  checked={userType === type}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                />
                <div className={styles.userTypeCard}>
                  <span className={styles.userTypeIcon}>
                    {userTypeIcons[type]}
                  </span>
                  {type}
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          className={styles.submitBtn}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className={styles.loadingSpinner} />
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ChevronRight size={20} className={styles.btnIcon} />
            </>
          )}
        </button>

        {msg && (
          <div className={styles.errorMessage}>
            <AlertCircle size={18} />
            {msg}
          </div>
        )}

        <div className={styles.formFooter}>
          {/* help / links */}
        </div>
      </form>
    </div>
  </div>
);

}