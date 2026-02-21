// Updated AddMentor.js with improved UI
import React, { useState } from "react";
import "./AddMentor.css";
import BASE_URL from "../../../baseurl";
import Admintop from "../../nav/admintop";


function AddMentor() {
  const [mentor, setMentor] = useState({
    name: "",
    dob: "",
    maatramId: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setMentor({ ...mentor, [e.target.name]: e.target.value });
    // Clear messages when user starts typing
    if (success) setSuccess(false);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mentor.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/add_mentor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mentor),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setMentor({
          name: "",
          dob: "",
          maatramId: "",
          phone: "",
          email: "",
        });
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || "Failed to add mentor");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMentor({
      name: "",
      dob: "",
      maatramId: "",
      phone: "",
      email: "",
    });
    setSuccess(false);
    setError("");
  };

  return (
    <div className="mentor-container">
      <Admintop activeTab="assignments" />
      <form 
        className={`mentor-form ${loading ? 'loading' : ''}`} 
        onSubmit={handleSubmit}
      >
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
        
        <div className="mentor-header">
          <div className="mentor-icon">
            👨‍🏫
          </div>
          <h2>Add Mentor</h2>
        </div>

        {success && (
          <div className="success-message">
            Mentor added successfully!
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label>Mentor Name</label>
            <input
              type="text"
              name="name"
              value={mentor.name}
              onChange={handleChange}
              placeholder="Enter mentor's full name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={mentor.dob}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Mentor ID</label>
            <input
              type="text"
              name="maatramId"
              value={mentor.maatramId}
              onChange={handleChange}
              placeholder="Enter Mentor ID"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={mentor.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={mentor.email}
              onChange={handleChange}
              placeholder="mentor@example.com"
              required
              disabled={loading}
            />
            <div className="email-hint">
              <span>✓</span>
              Will be used for mentor communications
            </div>
          </div>
        </div>

        <div className="submit-section">
          <button 
            type="button" 
            className="reset-button"
            onClick={handleReset}
            disabled={loading}
          >
            Reset Form
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Adding Mentor...' : 'Add Mentor'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMentor;