import React, { useEffect, useState } from "react";
import baseurl from "../../baseurl";
// import "./StudentDashboard.css";
import { User, Settings, LogOut } from "lucide-react";

export default function StudentDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("loggedUser");

    if (username) {
      fetch(`${baseurl}/get_student/${username}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setData(json.data);
          }
        })
        .catch(() => console.log("Error fetching student data"));
    }
  }, []);

  if (!data) {
    return (
      <div style={{ padding: "30px", fontFamily: "Poppins" }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      {/* Header */}
      <header style={styles.header}>
        <h1>Student Dashboard</h1>
        <p>Welcome back, <strong>{data.name}</strong></p>
      </header>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.photoWrapper}>
          {data.photo ? (
            <img src={data.photo} alt="profile" style={styles.photo} />
          ) : (
            <div style={styles.noPhoto}>No Photo</div>
          )}
        </div>

        <div>
          <h2 style={{ marginBottom: "6px" }}>{data.name}</h2>
          <p><strong>Maatram ID:</strong> {data.username}</p>
          <p><strong>Phone:</strong> {data.phno}</p>
          <p><strong>Student No:</strong> {data.id}</p>
          <p><strong>Assigned Mentor:</strong> {data.assigned_mentor}</p>
        </div>
      </div>

      {/* Tasks Section */}
      <div style={styles.section}>
        <h2>Upcoming Tasks</h2>
        <ul style={styles.list}>
          <li>Complete Career Assessment Test</li>
          <li>Upload Personal Bio</li>
          <li>Check Recommended Careers</li>
        </ul>
      </div>
    </div>
  );
}



// ---------- Styles ----------
const styles = {
  wrap: {
    padding: "28px",
    fontFamily: "Poppins, sans-serif",
    background: "#f4f7fb",
    minHeight: "100vh",
  },

  header: {
    marginBottom: "30px",
  },

  profileCard: {
    display: "flex",
    gap: "30px",
    alignItems: "center",
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "30px",
    boxShadow: "0 12px 30px rgba(16, 24, 40, 0.06)",
  },

  photoWrapper: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    overflow: "hidden",
    background: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  noPhoto: {
    color: "#6b7280",
    fontWeight: "600",
  },

  section: {
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 12px 30px rgba(16, 24, 40, 0.06)",
  },

  list: {
    marginTop: "10px",
    lineHeight: "1.6",
  }
};

