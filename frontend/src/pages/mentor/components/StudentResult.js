import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MentorTopBar from "../../mentornav/mentortop";

export default function StudentProgress() {
  const { student_id } = useParams(); // ✅ inside component
  const BASE_URL = "http://localhost:5000/api"; // ✅ define here

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student_id) return; // wait until student_id exists

    const fetchStudentTests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/mentor/student/${student_id}/progress`);
        setTests(res.data.tests || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student tests:", err);
        setError("Failed to fetch student tests");
        setLoading(false);
      }
    };

    fetchStudentTests();
  }, [student_id]);

  if (loading) return <p>Loading student tests...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="StudentResult">
      <MentorTopBar />
      <h1>Student Progress</h1>
      <h3>Student ID: {student_id}</h3>

      {tests.length === 0 ? (
        <p>No tests found for this student.</p>
      ) : (
        <table className="test-results" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Level</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{test.subject}</td>
                <td>{test.level}</td>
                <td>{test.score}</td>
                <td>{test.percentage}%</td>
                <td>{test.date}</td>
                <td>{test.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
