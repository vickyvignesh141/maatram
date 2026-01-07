
// Updated AddStudent.js with improved UI
import React, { useState } from "react";
import BASE_URL from "../../../baseurl";
import "./add_stu.css"; // Import the enhanced CSS
import Admintop from "../../nav/admintop";

function AddStudent() {
  const [student, setStudent] = useState({
    name: "",
    dob: "",
    maatramId: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
    // Clear messages when user starts typing
    if (success) setSuccess(false);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`${BASE_URL}/add_student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setStudent({
          name: "",
          dob: "",
          maatramId: "",
          phone: "",
        });
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || "Failed to add student");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStudent({
      name: "",
      dob: "",
      maatramId: "",
      phone: "",
    });
    setSuccess(false);
    setError("");
  };

  return (
    <div className="student-container">
       <Admintop activeTab="assignments" />
      <form 
        className={`student-form ${loading ? 'loading' : ''}`} 
        onSubmit={handleSubmit}
      >
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
        
        <h2>Add Student</h2>

        {success && (
          <div className="success-message">
            Student added successfully!
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              placeholder="Enter student name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={student.dob}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Maatram ID</label>
            <input
              type="text"
              name="maatramId"
              value={student.maatramId}
              onChange={handleChange}
              placeholder="Enter Maatram ID"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={student.phone}
              onChange={handleChange}
              placeholder="Enter phone number (optional)"
              disabled={loading}
            />
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
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStudent;