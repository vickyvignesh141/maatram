import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MentorTopBar from "../../mentornav/mentortop";

const BASE_URL = "http://localhost:5000/api";

export default function MentorViewCertificates() {
  const { username } = useParams();

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

        // normalize file name
        const certs = (res.data.certificates || []).map(cert => ({
          ...cert,
          file: cert.file || cert.file_id
        }));

        setCertificates(certs);
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

      <div style={{ padding: "20px", maxWidth: "800px" }}>
        <h2>Certificates – {username}</h2>

        {loading && <p>Loading certificates...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && certificates.length === 0 && (
          <p>No certificates uploaded by this student</p>
        )}

        {certificates.map((cert, index) => (
          <div
            key={cert.id || index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            <strong>{cert.name}</strong>

            <p style={{ fontSize: "12px", color: "#666" }}>
              Uploaded: {cert.uploaded_at}
            </p>

            <div style={{ marginTop: "8px" }}>
              {/* VIEW */}
              <a
                href={`${BASE_URL}/mentor/student/${username}/certificates/view/${cert.file}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "15px" }}
              >
                View
              </a>

              {/* DOWNLOAD */}
              <a
                href={`${BASE_URL}/mentor/student/${username}/certificates/download/${cert.file}`}
              >
                Download
              </a>
            </div>
          </div>
        ))}

        {/* EXPORT ALL */}
        {!loading && certificates.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <a
              href={`${BASE_URL}/mentor/student/${username}/certificates/export`}
            >
              Export All Certificates (ZIP)
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
