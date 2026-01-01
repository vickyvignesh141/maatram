import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import baseurl from "../../../baseurl";
import "./TotalStudents.css";
import MentorTopBar from "../../mentornav/mentortop";

export default function TotalStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ added

  useEffect(() => {
    const mentorUsername = localStorage.getItem("loggedUser");
    if (!mentorUsername) return;

    fetch(`${baseurl}/students/${mentorUsername}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setStudents(json.students);
        }
      })
      .catch(err => console.error("Error fetching students:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleStudentExpansion = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  // ✅ filter logic
  const filteredStudents = students.filter(student => {
    const term = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(term) ||
      student.username?.toLowerCase().includes(term) ||
      student.phno?.toString().includes(term)
    );
  });

  if (loading) return <p className="loading-text">Loading students...</p>;

  return (
    <div className="TotalStudents">
      <MentorTopBar />

      {/* ✅ Search Bar *
      <div style={{ padding: "10px 20px" }}>
        <input
          type="text"
          placeholder="Search by Name / Maatram ID / Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px"
          }}
        />
      </div>*/}

      <div className="students-list-container">
        <h2 className="students-title">Students Assigned to You</h2>

        {filteredStudents.length === 0 && (
          <p className="no-students">No matching students found</p>
        )}
         <div style={{ padding: "10px 20px" }}>
        <input
          type="text"
          placeholder="Search by Name / Maatram ID / Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px"
          }}
        />
      </div>

        <div className="students-list">
          {filteredStudents.map(student => (
            <div
              key={student.id || student.username}
              className={`student-item ${expandedStudent === student.id ? "expanded" : ""}`}
            >
              <div
                className="student-main-info"
                onClick={() => toggleStudentExpansion(student.id)}
              >
                <div className="student-avatar">
                  <div className="student-avatar-placeholder">
                    {student.name?.charAt(0).toUpperCase() || "S"}
                  </div>
                </div>

                <div className="student-info">
                  <div className="student-name">{student.name || "Unknown Student"}</div>
                  <div className="student-email">{student.username}</div>
                  {/*<div className="student-phone">{student.phno || "No phone"}</div>*/}
                  <div className="expansion-indicator">
                    {expandedStudent === student.id ? "▼" : "▶"}
                  </div>
                </div>
              </div>

              {expandedStudent === student.id && (
                <div className="student-actions-panel">
                  <div className="actions-grid">
                    <Link
                      to={`/mentor/student/${student.username}/profile`}
                      className="action-btn profile-btn"
                    >
                      👤 View Profile
                    </Link>

                    <Link
                      to={`/mentor/student/${student.username}/career`}
                      className="action-btn career-btn"
                    >
                      🎯 Selected Career
                    </Link>

                    <Link
                      to={`/mentor/student/${student.username}/progress`}
                      className="action-btn progress-btn"
                    >
                      📊 Progress Graph
                    </Link>

                    <Link
                      to={`/mentor/student/${student.username}/certifications`}
                      className="action-btn certification-btn"
                    >
                      🏆 View Certification
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
