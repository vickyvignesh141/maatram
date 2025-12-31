import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import baseurl from "../../../baseurl";
import styles from "./admin_men.module.css";
const AdminMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [allMentors, setAllMentors] = useState([]); // Store all mentors for filtering
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // CSS Styles Object (added search styles)


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
        `${baseurl}/admin/mentors`
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
        <span key={index} className={styles.highlightMatch}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <style>{spinnerStyle}</style>
        <h2 className={styles.header}>Admin - Mentor List</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Loading mentors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <style>{spinnerStyle}</style>
      <h2 className={styles.header}>Admin - Mentor List</h2>

      {/* Search Box */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>🔍</div>
          <input
            type="text"
            placeholder="Search mentors by name, username, ID, or phone number..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={{
              ...styles.searchInput,
              ...(isSearchFocused && styles.searchInputFocus)
            }}
          />
        </div>
        {searchTerm && (
          <div className={styles.searchResultsInfo}>
            <span className={styles.resultsCount}>
              {filteredMentors.length} {filteredMentors.length === 1 ? 'match' : 'matches'}
            </span>
            <span>found for "{searchTerm}"</span>
          </div>
        )}
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table} cellPadding="10">
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableHeaderCell}>ID</th>
              <th className={styles.tableHeaderCell}>Name</th>
              <th className={styles.tableHeaderCell}>Username</th>
              <th className={styles.tableHeaderCell}>Phone</th>
              <th className={styles.tableHeaderCell}>No. of Students</th>
            </tr>
          </thead>

          <tbody>
            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor, index) => (
                <tr
                  key={mentor.username}
                  className={{
                    ...styles.tableRow,
                    ...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
                    ...(hoveredRow === mentor.username && styles.tableRowHover),
                  }}
                  onMouseEnter={() => setHoveredRow(mentor.username)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className={{ ...styles.tableCell, ...styles.idCell }}>
                    {highlightText(mentor.id, searchTerm)}
                  </td>
                  <td className={{ ...styles.tableCell, ...styles.nameCell }}>
                    {highlightText(mentor.name, searchTerm)}
                  </td>
                  <td className={{ ...styles.tableCell, ...styles.usernameCell }}>
                    {highlightText(mentor.username, searchTerm)}
                  </td>
                  <td className={{ ...styles.tableCell, ...styles.phoneCell }}>
                    {highlightText(mentor.phone, searchTerm)}
                  </td>
                  <td className={{ ...styles.tableCell, ...styles.studentCountCell }}>
                    <span className={styles.studentCountBadge}>
                      {mentor.student_count}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" align="center" className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    {searchTerm ? "🔍" : "👨‍🏫"}
                  </div>
                  <div className={styles.emptyStateText}>
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