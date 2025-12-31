import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MentorTopBar from "../../mentornav/mentortop";
import BASE_URL from "../../../baseurl";

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

        const certs = (res.data.certificates || []).map(cert => ({
          ...cert,
          file: encodeURIComponent(cert.file || cert.file_id)
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
          <h1>Student Certificates</h1>
          <p className="student-username">Student: {username}</p>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading certificates...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">!</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && certificates.length === 0 && !error && (
          <div className="no-certificates">
            <div className="empty-state-icon">📄</div>
            <h3>No Certificates Found</h3>
            <p>This student hasn't uploaded any certificates yet.</p>
          </div>
        )}

        <div className="certificates-grid">
          {certificates.map((cert, index) => (
            <div key={cert.id || index} className="certificate-card">
              <div className="certificate-header">
                <div className="certificate-icon">🏆</div>
                <h3 className="certificate-title">{cert.name || `Certificate ${index + 1}`}</h3>
              </div>
              
              <div className="certificate-details">
                <div className="detail-item">
                  <span className="detail-label">Upload Date:</span>
                  <span className="detail-value">
                    {cert.uploaded_at ? new Date(cert.uploaded_at).toLocaleDateString() : "Not specified"}
                  </span>
                </div>
                {cert.issuer && (
                  <div className="detail-item">
                    <span className="detail-label">Issuer:</span>
                    <span className="detail-value">{cert.issuer}</span>
                  </div>
                )}
                {cert.issue_date && (
                  <div className="detail-item">
                    <span className="detail-label">Issue Date:</span>
                    <span className="detail-value">
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </span>
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
                  <span className="btn-icon">👁️</span>
                  View Certificate
                </a>

                <a
  href={`${BASE_URL}/mentor/student/${username}/certificates/download/${cert.file}`}
  className="action-btn download-btn"
  download
>
  <span className="btn-icon">⬇️</span>
  Download
</a>

              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .mentor-certificates-container {
          min-height: 100vh;
          background-color: #f5f7fa;
        }

        .certificates-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px;
        }

        .certificates-header {
          margin-bottom: 40px;
          text-align: center;
        }

        .certificates-header h1 {
          color: #2c3e50;
          font-size: 2.5rem;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .student-username {
          color: #7f8c8d;
          font-size: 1.2rem;
          background: #ecf0f1;
          display: inline-block;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e0e0e0;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-container p {
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        .error-message {
          background-color: #fee;
          border-left: 4px solid #e74c3c;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          margin: 30px 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .error-icon {
          background-color: #e74c3c;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 15px;
          flex-shrink: 0;
        }

        .error-message p {
          color: #c0392b;
          margin: 0;
          font-weight: 500;
        }

        .no-certificates {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          max-width: 500px;
          margin: 40px auto;
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.6;
        }

        .no-certificates h3 {
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 1.5rem;
        }

        .no-certificates p {
          color: #7f8c8d;
          font-size: 1rem;
          line-height: 1.5;
        }

        .certificates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .certificates-grid {
            grid-template-columns: 1fr;
          }
        }

        .certificate-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 1px solid #e8e8e8;
        }

        .certificate-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.12);
          border-color: #3498db;
        }

        .certificate-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f2f5;
        }

        .certificate-icon {
          font-size: 2rem;
          margin-right: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .certificate-title {
          color: #2c3e50;
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
          flex: 1;
          line-height: 1.4;
        }

        .certificate-details {
          margin-bottom: 25px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f5f5f5;
        }

        .detail-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .detail-label {
          color: #7f8c8d;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .detail-value {
          color: #2c3e50;
          font-weight: 600;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }

        .certificate-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .action-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .view-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .download-btn {
          background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
          color: white;
        }

        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
        }

        .btn-icon {
          font-size: 1rem;
        }

        @media (max-width: 480px) {
          .certificates-content {
            padding: 20px 15px;
          }

          .certificates-header h1 {
            font-size: 2rem;
          }

          .certificate-card {
            padding: 20px;
          }

          .certificate-actions {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}