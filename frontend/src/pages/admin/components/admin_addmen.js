// AddMentor.js
import React, { useState } from "react";
import "./AddMentor.css";
import BASE_URL from "../../../baseurl";

function AddMentor() {
  const [mentor, setMentor] = useState({
    name: "",
    dob: "",
    maatramId: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    setMentor({ ...mentor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert("Mentor added successfully!");
        setMentor({
          name: "",
          dob: "",
          maatramId: "",
          phone: "",
          email: "",
        });
      } else {
        alert(data.message || "Failed to add mentor");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="mentor-container">
      <form className="mentor-form" onSubmit={handleSubmit}>
        <h2>Add Mentor</h2>

        <label>Mentor Name</label>
        <input
          type="text"
          name="name"
          value={mentor.name}
          onChange={handleChange}
          required
        />

        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={mentor.dob}
          onChange={handleChange}
          required
        />

        <label>Maatram ID</label>
        <input
          type="text"
          name="maatramId"
          value={mentor.maatramId}
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={mentor.phone}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={mentor.email}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Mentor</button>
      </form>
    </div>
  );
}

export default AddMentor;
