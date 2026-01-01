import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MentorTopBar from "../../mentornav/mentortop";
import BASE_URL from "../../../baseurl";
import {
  FileText,
  Trophy,
  Calendar,
  Building,
  Download,
  Eye,
  Loader2,
  AlertCircle,
  User
} from "lucide-react";
import "./StudentCertificate.css";
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

        const certs = (res.data.certificates || []).map((cert) => ({
          ...cert,
          file: encodeURIComponent(cert.file || cert.file_id),
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
    <div className="mentor-certificates-container">
      <MentorTopBar />

      <div className="certificates-content">
        <div className="certificates-header">
          <h1>
            <Trophy className="header-icon" />
            Student Certificates
          </h1>
          <div className="student-info">
            <User className="student-icon" />
            <span className="student-username">Student ID: {username}</span>
          </div>
        </div>

        {loading && (
          <div className="loading-container">
            <Loader2 className="loading-spinner" />
            <p>Loading certificates...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertCircle className="error-icon" />
            <p>{error}</p>
          </div>
        )}

        {!loading && certificates.length === 0 && !error && (
          <div className="no-certificates">
            <FileText className="empty-state-icon" />
            <h3>No Certificates Found</h3>
            <p>This student hasn't uploaded any certificates yet.</p>
          </div>
        )}

        <div className="certificates-grid">
          {certificates.map((cert, index) => (
            <div
              key={cert.id || index}
              className="certificate-card"
            >
              <div className="certificate-header">
                <div className="certificate-icon">
                  <Trophy />
                </div>
                <h3 className="certificate-title">
                  {cert.name || `Certificate ${index + 1}`}
                </h3>
              </div>

              <div className="certificate-details">
                <div className="detail-item">
                  <Calendar className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Upload Date:</span>
                    <span className="detail-value">
                      {cert.uploaded_at
                        ? new Date(cert.uploaded_at).toLocaleDateString()
                        : "Not specified"}
                    </span>
                  </div>
                </div>

                {cert.issuer && (
                  <div className="detail-item">
                    <Building className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Issuer:</span>
                      <span className="detail-value">
                        {cert.issuer}
                      </span>
                    </div>
                  </div>
                )}

                {cert.issue_date && (
                  <div className="detail-item">
                    <Calendar className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Issue Date:</span>
                      <span className="detail-value">
                        {new Date(cert.issue_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="certificate-actions">
                <a
                  href={`${BASE_URL}/mentor/student/${username}/certificates/view/${cert.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn view-btn"
                >
                  <Eye className="btn-icon" />
                  View Certificate
                </a>

                <a
                  href={`${BASE_URL}/mentor/student/${username}/certificates/download/${cert.file}`}
                  className="action-btn download-btn"
                  download
                >
                  <Download className="btn-icon" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}