import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MentorTopBar from "../../mentornav/mentortop";

const BASE_URL = "http://localhost:5000/api";

export default function MentorViewCertificates() {
  const { username } = useParams();   // student username from URL
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) {
      setError("Student username not found");
      setLoading(false);
      return;
    }

    const fetchCertificates = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/mentor/student/${username}/certificates`
        );
        setCertificates(res.data.certificates || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load certificates");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [username]);

  return (
    <div>
      <MentorTopBar />

      <div style={{ padding: "20px" }}>
        <h2>🎓 Certificates – {username}</h2>

        {loading && <p>Loading certificates...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && certificates.length === 0 && (
          <p>No certificates uploaded by this student</p>
        )}

        {certificates.map((c, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <strong>{c.name}</strong>
            <br />

            <a
              href={`http://localhost:5000${c.file_url}`}
              target="_blank"
              rel="noreferrer"
            >
              👁 View Certificate
            </a>

            <br />
            <small>
              Uploaded on:{" "}
              {c.uploaded_at
                ? new Date(c.uploaded_at).toLocaleString()
                : "N/A"}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
