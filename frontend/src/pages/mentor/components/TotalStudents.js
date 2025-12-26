import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import baseurl from "../../../baseurl";
import "./TotalStudents.css";
import MentorTopBar from "../../mentornav/mentortop";



export default function TotalStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    const mentorUsername = localStorage.getItem("loggedUser");
    if (!mentorUsername) return;

    fetch(`${baseurl}/students/${mentorUsername}`)
      .then(res => res.json())
      .then(json => {
        console.log("STUDENTS RESPONSE:", json);

        if (json.success) {
          setStudents(json.students);
        }
      })
      .catch(err => console.error("Error fetching students:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleStudentExpansion = (studentId) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };

  if (loading) return <p className="loading-text">Loading students...</p>;

  return (
    <div classname="TotalStudents">
      <MentorTopBar/>
    <div className="students-list-container">
      <h2 className="students-title">Students Assigned to You</h2>
      
      {students.length === 0 && (
        <p className="no-students">No students assigned</p>
      )}

      <div className="students-list">
        {students.map(student => (
          <div 
            key={student.id || student.username} 
            className={`student-item ${expandedStudent === student.id ? 'expanded' : ''}`}
          >
            <div className="student-main-info" onClick={() => toggleStudentExpansion(student.id)}>
              <div className="student-avatar">
                <div className="student-avatar-placeholder">
                  {student.name?.charAt(0).toUpperCase() || 'S'}
                </div>
              </div>

              <div className="student-info">
                <div className="student-name">{student.name || 'Unknown Student'}</div>
                <div className="student-email">{student.username}</div>
                <div className="student-phone">{student.phno || 'No phone'}</div>
                
                <div className="expansion-indicator">
                  {expandedStudent === student.id ? '▼' : '▶'}
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
                    <span className="action-icon">👤</span>
                    <span className="action-text">View Profile</span>
                  </Link>
                  
                  <Link 
                    to={`/mentor/student/${student.username}/career`}
                    className="action-btn career-btn"
                  >
                    <span className="action-icon">🎯</span>
                    <span className="action-text">Selected Career</span>
                  </Link>
                  
                  <Link 
                    to={`/mentor/student/${student.username}/progress`}
                    className="action-btn progress-btn"
                  >
                    <span className="action-icon">📊</span>
                    <span className="action-text">Progress Graph</span>
                  </Link>
                  
                  <Link 
                    to={`/mentor/student/${student.username}/certifications`}
                    className="action-btn certification-btn"
                  >
                    <span className="action-icon">🏆</span>
                    <span className="action-text">View Certification</span>
                  </Link>
                </div>
                
                <div className="additional-actions">
                  <button
                    className="view-report-btn"
                    onClick={() => console.log("View report for", student.username)}
                  >
                    View Full Report
                  </button>
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


