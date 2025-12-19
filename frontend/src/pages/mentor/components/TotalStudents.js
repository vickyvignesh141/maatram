import { useEffect, useState } from "react";
import baseurl from "../../../baseurl";

export default function TotalStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading students...</p>;

  return (
    <div className="students-list">
      {students.length === 0 && <p>No students assigned</p>}

      {students.map(student => (
        <div key={student.id} className="student-item">
          <div className="student-avatar">
            <div className="student-avatar-placeholder">
              {student.name?.charAt(0)}
            </div>
          </div>

          <div className="student-info">
            <div className="student-name">{student.name}</div>
            <div className="student-email">{student.username}</div>
            <div className="student-phone">{student.phno}</div>

            {/* 🔽 Future reports button */}
            <button
              className="view-report-btn"
              onClick={() => console.log("View report for", student.username)}
            >
              View Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
