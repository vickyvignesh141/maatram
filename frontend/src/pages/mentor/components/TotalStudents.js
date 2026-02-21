import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Target,
  LineChart,
  Award,
  Search
} from "lucide-react";
import baseurl from "../../../baseurl";
import "./TotalStudents.css";
import MentorTopBar from "../../mentornav/mentortop";

export default function TotalStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);

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

  const toggleStudentExpansion = (studentUsername) => {
    setExpandedStudent(
      expandedStudent === studentUsername ? null : studentUsername
    );
  };

  // ✅ SORT + FILTER
  const filteredStudents = [...students]
    .sort((a, b) =>
      (a.name || "").toLowerCase().localeCompare(
        (b.name || "").toLowerCase()
      )
    )
    .filter(student => {
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

      <div className="students-list-container">
        <h2 className="students-title">Students Assigned to You</h2>

        {/* Search */}
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Name /  ID / Phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredStudents.length === 0 && (
          <p className="no-students">No matching students found</p>
        )}

        {/* Students Grid */}
        <div className="students-grid">
          {filteredStudents.map(student => (
            <div
              key={student.username}
              className="student-card"
            >
              {/* Header */}
              <div
                className="student-card-header"
                onClick={() => toggleStudentExpansion(student.username)}
              >
                <div className="student-avatar">
                  {student.name?.charAt(0).toUpperCase() || "S"}
                </div>

                <div className="student-basic-info">
                  <h3>{student.name || "Unknown Student"}</h3>
                  <p>{student.username}</p>
                </div>

                
              </div>

              {/* Actions (expandable) */}
              { (
                <div className="student-card-actions">
                  <Link
                    to={`/mentor/student/${student.username}/profile`}
                    className="card-btn profile-btn"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to={`/mentor/student/${student.username}/career`}
                    className="card-btn career-btn"
                  >
                    <Target size={16} />
                    <span>Career</span>
                  </Link>

                  <Link
                    to={`/mentor/student/${student.username}/progress`}
                    className="card-btn progress-btn"
                  >
                    <LineChart size={16} />
                    <span>Progress</span>
                  </Link>

                  <Link
                    to={`/mentor/student/${student.username}/certifications`}
                    className="card-btn certification-btn"
                  >
                    <Award size={16} />
                    <span>Certificates</span>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
