import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]); // MUST be array

  // CSS Styles
  const styles = {
    container: {
      padding: "2rem",
      backgroundColor: "#f5f7fa",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      color: "#2c3e50",
      marginBottom: "1.5rem",
      paddingBottom: "0.5rem",
      borderBottom: "3px solid #3498db",
      fontSize: "1.8rem",
      fontWeight: "600",
    },
    tableContainer: {
      overflowX: "auto",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      backgroundColor: "white",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "800px",
    },
    tableHeader: {
      backgroundColor: "#3498db",
      color: "white",
    },
    tableHeaderCell: {
      padding: "1rem",
      textAlign: "left",
      fontWeight: "600",
      fontSize: "0.9rem",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    tableRow: {
      borderBottom: "1px solid #e0e0e0",
      transition: "background-color 0.2s ease",
    },
    tableRowHover: {
      backgroundColor: "#f8f9fa",
      cursor: "pointer",
    },
    tableCell: {
      padding: "1rem",
      fontSize: "0.95rem",
      color: "#333",
    },
    evenRow: {
      backgroundColor: "#f9f9f9",
    },
    oddRow: {
      backgroundColor: "white",
    },
    loading: {
      textAlign: "center",
      padding: "2rem",
      color: "#7f8c8d",
      fontSize: "1.1rem",
    },
    error: {
      textAlign: "center",
      padding: "2rem",
      color: "#e74c3c",
      backgroundColor: "#ffeaea",
      borderRadius: "6px",
      margin: "1rem 0",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      color: "#7f8c8d",
      fontSize: "1rem",
    },
    mentorBadge: {
      backgroundColor: "#2ecc71",
      color: "white",
      padding: "0.3rem 0.8rem",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "500",
      display: "inline-block",
    },
    noMentorBadge: {
      backgroundColor: "#e74c3c",
      color: "white",
      padding: "0.3rem 0.8rem",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "500",
      display: "inline-block",
    },
    idCell: {
      color: "#3498db",
      fontWeight: "600",
      fontFamily: "monospace",
      fontSize: "0.9rem",
    },
    phoneCell: {
      color: "#2c3e50",
      fontFamily: "monospace",
    },
  };

  const [hoveredRow, setHoveredRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/admin/users")
      .then((res) => {
        setUsers(res.data.data); // 👈 IMPORTANT
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load users. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.header}>Admin Users</h2>
        <div style={styles.loading}>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.header}>Admin Users</h2>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admin Users</h2>

      <div style={styles.tableContainer}>
        {users.length === 0 ? (
          <div style={styles.emptyState}>No users found.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>ID</th>
                <th style={styles.tableHeaderCell}>Name</th>
                <th style={styles.tableHeaderCell}>Username</th>
                <th style={styles.tableHeaderCell}>Phone</th>
                <th style={styles.tableHeaderCell}>Mentor</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.username}
                  style={{
                    ...styles.tableRow,
                    ...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
                    ...(hoveredRow === user.username && styles.tableRowHover),
                  }}
                  onMouseEnter={() => setHoveredRow(user.username)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ ...styles.tableCell, ...styles.idCell }}>
                    {user.id}
                  </td>
                  <td style={styles.tableCell}>{user.name}</td>
                  <td style={styles.tableCell}>
                    <strong>{user.username}</strong>
                  </td>
                  <td style={{ ...styles.tableCell, ...styles.phoneCell }}>
                    {user.phno}
                  </td>
                  <td style={styles.tableCell}>
                    {user.assigned_mentor ? (
                      <span style={styles.mentorBadge}>
                        {user.assigned_mentor}
                      </span>
                    ) : (
                      <span style={styles.noMentorBadge}>No Mentor</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;