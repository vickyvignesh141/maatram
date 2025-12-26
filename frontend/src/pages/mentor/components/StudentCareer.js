import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MentorTopBar from "../../mentornav/mentortop";

export default function StudentProgress() {
  // Get username from route params
  const { username } = useParams();
  const BASE_URL = "http://localhost:5000/api";

  // State for career data, loading, and errors
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchStudentCareer = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/mentor/student/${username}/career`
        );

        // Check if response has data
        if (res.data?.success) {
          setCareer(res.data.career_data);
        } else {
          setError(res.data?.message || "No career data found");
        }
      } catch (err) {
        console.error("Error fetching career data:", err);
        setError("Failed to fetch student career");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCareer();
  }, [username]);

  // Loading or error states
  if (loading) return <p>Loading student career...</p>;
  if (error) return <p>{error}</p>;

  // Render career data
  return (
    <div className="StudentResult">
      <MentorTopBar />

      <h1>Student Career Profile</h1>
      <h3>Student ID: {username}</h3>

      {career ? (
        <>
          {/* Initial Assessment */}
          <h2>Initial Assessment</h2>
          {career.initial_assessment?.responses &&
            Object.entries(career.initial_assessment.responses).map(([question, answer], i) => (
              <p key={i}>
                <strong>{question}</strong>: {answer}
              </p>
            ))}

          {/* Career Recommendations */}
          <h2>Career Recommendations</h2>
          {career.initial_assessment?.recommendations?.career_options?.map((option, i) => (
            <div key={i}>
              <strong>{option.name}</strong> ({option.match_score}%)
              <p>{option.description}</p>
            </div>
          ))}

          {/* Selected Career */}
          <h2>Selected Career</h2>
          <p><strong>Career:</strong> {career.selected_career?.career}</p>
          <p><strong>Status:</strong> {career.selected_career?.study_plan?.status}</p>
          <p><strong>Estimated Completion:</strong> {career.selected_career?.study_plan?.estimated_completion}</p>

          {/* Topic Progress */}
          <h2>Topic Progress</h2>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {career.topic_progress &&
                Object.entries(career.topic_progress).map(([topic, value], i) => (
                  <tr key={i}>
                    <td>{topic}</td>
                    <td>{value.percentage}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No career data found</p>
      )}
    </div>
  );
}
