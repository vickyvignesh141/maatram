import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const AdminMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [allMentors, setAllMentors] = useState([]); // Store all mentors for filtering
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // CSS Styles Object (added search styles)
  const styles = {
    container: {
      padding: "2rem",
      backgroundColor: "#f5f8ff",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    },
    header: {
      color: "#1a365d",
      marginBottom: "1.8rem",
      paddingBottom: "0.75rem",
      borderBottom: "3px solid #4f46e5",
      fontSize: "1.8rem",
      fontWeight: "700",
      letterSpacing: "-0.5px",
    },
    searchContainer: {
      marginBottom: "2rem",
    },
    searchWrapper: {
      position: "relative",
      width: "100%",
    },
    searchInput: {
      width: "100%",
      padding: "1rem 1rem 1rem 3rem",
      fontSize: "1rem",
      borderRadius: "10px",
      border: "2px solid #e2e8f0",
      backgroundColor: "white",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      outline: "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxSizing: "border-box",
    },
    searchInputFocus: {
      borderColor: "#4f46e5",
      boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.1), 0 4px 6px -2px rgba(79, 70, 229, 0.05)",
    },
    searchIcon: {
      position: "absolute",
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#94a3b8",
      fontSize: "1.2rem",
    },
    searchResultsInfo: {
      marginTop: "0.75rem",
      color: "#64748b",
      fontSize: "0.9rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    resultsCount: {
      backgroundColor: "#4f46e5",
      color: "white",
      padding: "0.2rem 0.6rem",
      borderRadius: "12px",
      fontSize: "0.8rem",
      fontWeight: "600",
    },
    tableContainer: {
      overflowX: "auto",
      boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)",
      borderRadius: "12px",
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
      minWidth: "900px",
      overflow: "hidden",
    },
    tableHeader: {
      backgroundColor: "#4f46e5",
      color: "white",
      position: "sticky",
      top: "0",
    },
    tableHeaderCell: {
      padding: "1.25rem 1rem",
      textAlign: "left",
      fontWeight: "600",
      fontSize: "0.85rem",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      borderBottom: "2px solid #3730a3",
    },
    tableRow: {
      borderBottom: "1px solid #f1f5f9",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    tableRowHover: {
      backgroundColor: "#f8fafc",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.08)",
    },
    tableCell: {
      padding: "1.25rem 1rem",
      fontSize: "0.95rem",
      color: "#334155",
      verticalAlign: "middle",
    },
    evenRow: {
      backgroundColor: "#f8fafc",
    },
    oddRow: {
      backgroundColor: "white",
    },
    idCell: {
      color: "#4f46e5",
      fontWeight: "700",
      fontFamily: "'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace",
      fontSize: "0.9rem",
    },
    nameCell: {
      color: "#1e293b",
      fontWeight: "600",
    },
    usernameCell: {
      color: "#64748b",
      fontStyle: "italic",
    },
    phoneCell: {
      color: "#475569",
      fontFamily: "'JetBrains Mono', monospace",
    },
    studentCountCell: {
      color: "#059669",
      fontWeight: "700",
      fontSize: "1.1rem",
      textAlign: "center",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem",
    },
    loadingSpinner: {
      width: "50px",
      height: "50px",
      border: "4px solid #e2e8f0",
      borderTopColor: "#4f46e5",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      marginTop: "1rem",
      color: "#64748b",
      fontSize: "1rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "4rem",
      color: "#94a3b8",
    },
    emptyStateIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
      color: "#cbd5e1",
    },
    emptyStateText: {
      fontSize: "1.1rem",
      color: "#64748b",
    },
    errorState: {
      textAlign: "center",
      padding: "3rem",
      backgroundColor: "#fef2f2",
      borderRadius: "10px",
      border: "1px solid #fecaca",
      color: "#dc2626",
      marginTop: "1rem",
    },
    studentCountBadge: {
      display: "inline-block",
      backgroundColor: "#d1fae5",
      color: "#065f46",
      padding: "0.4rem 1rem",
      borderRadius: "20px",
      fontWeight: "600",
      fontSize: "0.85rem",
      border: "1px solid #a7f3d0",
      minWidth: "40px",
    },
    highlightMatch: {
      backgroundColor: "#fffbeb",
      padding: "0.1rem 0.3rem",
      borderRadius: "4px",
      color: "#b45309",
      fontWeight: "600",
    },
  };

  // Filter mentors based on search term
  const filteredMentors = useMemo(() => {
    if (!searchTerm.trim()) {
      return mentors;
    }

    const term = searchTerm.toLowerCase().trim();
    
    return mentors.filter(mentor => {
      // Check name
      if (mentor.name && mentor.name.toLowerCase().includes(term)) {
        return true;
      }
      
      // Check username
      if (mentor.username && mentor.username.toLowerCase().includes(term)) {
        return true;
      }
      
      // Check ID (converting to string for comparison)
      if (mentor.id && mentor.id.toString().includes(term)) {
        return true;
      }
      
      // Check phone number
      if (mentor.phone && mentor.phone.toString().includes(term)) {
        return true;
      }
      
      return false;
    });
  }, [mentors, searchTerm]);

  // Add keyframes for spinner animation
  const spinnerStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/admin/mentors"
      );

      // data is inside res.data.data
      setMentors(res.data.data);
      setAllMentors(res.data.data); // Store all mentors
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.toString().split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={styles.highlightMatch}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{spinnerStyle}</style>
        <h2 style={styles.header}>Admin - Mentor List</h2>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading mentors...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{spinnerStyle}</style>
      <h2 style={styles.header}>Admin - Mentor List</h2>

      {/* Search Box */}
      <div style={styles.searchContainer}>
        <div style={styles.searchWrapper}>
          <div style={styles.searchIcon}>🔍</div>
          <input
            type="text"
            placeholder="Search mentors by name, username, ID, or phone number..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            style={{
              ...styles.searchInput,
              ...(isSearchFocused && styles.searchInputFocus)
            }}
          />
        </div>
        {searchTerm && (
          <div style={styles.searchResultsInfo}>
            <span style={styles.resultsCount}>
              {filteredMentors.length} {filteredMentors.length === 1 ? 'match' : 'matches'}
            </span>
            <span>found for "{searchTerm}"</span>
          </div>
        )}
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table} cellPadding="10">
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableHeaderCell}>ID</th>
              <th style={styles.tableHeaderCell}>Name</th>
              <th style={styles.tableHeaderCell}>Username</th>
              <th style={styles.tableHeaderCell}>Phone</th>
              <th style={styles.tableHeaderCell}>No. of Students</th>
            </tr>
          </thead>

          <tbody>
            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor, index) => (
                <tr
                  key={mentor.username}
                  style={{
                    ...styles.tableRow,
                    ...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
                    ...(hoveredRow === mentor.username && styles.tableRowHover),
                  }}
                  onMouseEnter={() => setHoveredRow(mentor.username)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ ...styles.tableCell, ...styles.idCell }}>
                    {highlightText(mentor.id, searchTerm)}
                  </td>
                  <td style={{ ...styles.tableCell, ...styles.nameCell }}>
                    {highlightText(mentor.name, searchTerm)}
                  </td>
                  <td style={{ ...styles.tableCell, ...styles.usernameCell }}>
                    {highlightText(mentor.username, searchTerm)}
                  </td>
                  <td style={{ ...styles.tableCell, ...styles.phoneCell }}>
                    {highlightText(mentor.phone, searchTerm)}
                  </td>
                  <td style={{ ...styles.tableCell, ...styles.studentCountCell }}>
                    <span style={styles.studentCountBadge}>
                      {mentor.student_count}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" align="center" style={styles.emptyState}>
                  <div style={styles.emptyStateIcon}>
                    {searchTerm ? "🔍" : "👨‍🏫"}
                  </div>
                  <div style={styles.emptyStateText}>
                    {searchTerm 
                      ? `No mentors found matching "${searchTerm}"`
                      : "No mentors found"}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMentors;