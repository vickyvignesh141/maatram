import { useEffect, useState } from "react";
import axios from "axios";
import "./Wallets.css";
import StudentTopBar from "../../nav/studenttop";


const BASE_URL = "http://localhost:5000/api";

export default function StudentWallet() {
  const username = localStorage.getItem("loggedUser"); // MAA000001

  const [certificates, setCertificates] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // ================= FETCH =================
  const fetchCertificates = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/student/${username}/certificates`
      );
      // Ensure certificates is always an array
      setCertificates(res.data?.certificates || []);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      setCertificates([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    if (username) fetchCertificates();
  }, [username]);

  // ================= UPLOAD =================
  const uploadCertificate = async () => {
    if (!file || !name.trim()) {
      alert("Please enter a certificate name and choose a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name.trim());

    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/student/${username}/certificate`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setName("");
      setFile(null);
      setFileName("");
      fetchCertificates();
    } catch (err) {
      alert("Upload failed. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteCertificate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) return;

    try {
      await axios.delete(
        `${BASE_URL}/student/${username}/certificate/${id}`
      );
      fetchCertificates();
    } catch (err) {
      alert("Delete failed. Please try again.");
      console.error("Delete error:", err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(selectedFile.type)) {
        alert("Please select a valid file type (PDF, PNG, JPG, JPEG)");
        return;
      }
      
      if (selectedFile.size > maxSize) {
        alert("File size exceeds 10MB limit");
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(droppedFile.type)) {
        alert("Please drop a valid file type (PDF, PNG, JPG, JPEG)");
        return;
      }
      
      if (droppedFile.size > maxSize) {
        alert("File size exceeds 10MB limit");
        return;
      }
      
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileExtension = (fileName) => {
    if (!fileName) return "UNK";
    const parts = fileName.split('.');
    if (parts.length > 1) {
      return parts.pop().toUpperCase();
    }
    return "FILE";
  };

  // Safe certificate viewing
  const handleViewCertificate = (certificateFile) => {
    if (!certificateFile || !username) {
      alert("Cannot view certificate: File information is missing");
      return;
    }
    
    const viewUrl = `${BASE_URL}/certificate/${username}/${certificateFile}`;
    window.open(viewUrl, "_blank");
  };

  return (
     <div className="progress-container">
          <StudentTopBar />
    <div className="student-wallet-container">
      {/* Header */}
      <div className="wallet-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="wallet-title">
              <span className="title-icon">🎓</span>
              Student Certificate Wallet
            </h1>
            <p className="wallet-subtitle">Manage and organize your academic certificates securely</p>
          </div>
          
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon upload-icon">📤</div>
          <div className="stat-content">
            <h3 className="stat-value">Upload Ready</h3>
            <p className="stat-label">Add new certificates</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total-icon">📜</div>
          <div className="stat-content">
            <h3 className="stat-value">{certificates.length}</h3>
            <p className="stat-label">Total Certificates</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon storage-icon">💾</div>
          <div className="stat-content">
            <h3 className="stat-value">Unlimited</h3>
            <p className="stat-label">Storage Available</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">📁</span>
            Upload Certificate
          </h2>
          <p className="section-description">Upload your certificate files in PDF, PNG, or JPG format</p>
        </div>

        <div className="upload-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Certificate Name *</label>
              <input
                type="text"
                placeholder="e.g., Bachelor of Science in Computer Science"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group file-group">
              <label className="form-label">Certificate File *</label>
              <div 
                className={`file-upload-area ${isDragging ? 'dragging' : ''} ${loading ? 'disabled' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !loading && document.getElementById('fileInput').click()}
              >
                <div className="upload-icon-large">📄</div>
                <p className="upload-instruction">
                  <span className="upload-text">Click to browse or drag & drop</span>
                </p>
                <p className="upload-hint">Supports: PDF, PNG, JPG, JPEG (Max 10MB)</p>
                
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="file-input-hidden"
                  disabled={loading}
                />
              </div>
              
              {fileName && (
                <div className="file-preview">
                  <div className="file-info">
                    <span className="file-icon">📎</span>
                    <div className="file-details">
                      <span className="file-name">{fileName}</span>
                      {file && (
                        <span className="file-size">{formatFileSize(file.size)}</span>
                      )}
                    </div>
                    <button 
                      className="clear-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setFileName("");
                      }}
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <button 
              onClick={uploadCertificate} 
              disabled={loading || !file || !name.trim()}
              className={`upload-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <span className="button-icon">📤</span>
                  Upload Certificate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="certificates-section">
        <div className="section-header">
          <div className="section-title-row">
            <h2 className="section-title">
              <span className="section-icon">📋</span>
              My Certificates
            </h2>
            <div className="certificates-count">
              <span className="count-badge">{certificates.length} items</span>
            </div>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3 className="empty-title">No certificates uploaded yet</h3>
            <p className="empty-description">Upload your first certificate using the form above</p>
          </div>
        ) : (
          <div className="certificates-grid">
            {certificates.map((certificate) => (
              <div key={certificate.id || Math.random()} className="certificate-card">
                <div className="certificate-header">
                  <div className="certificate-type-icon">📜</div>
                  <div className="certificate-info">
                    <h3 className="certificate-name">{certificate.name || "Unnamed Certificate"}</h3>
                    <div className="certificate-meta">
                      <span className="meta-item">
                        <span className="meta-icon">📅</span>
                        {formatDate(certificate.uploaded_at)}
                      </span>
                      {certificate.id && (
                        <span className="meta-item">
                          <span className="meta-icon">🆔</span>
                          {certificate.id.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="certificate-footer">
                  <div className="certificate-actions">
                    <button
                      className="action-button view-button"
                      onClick={() => handleViewCertificate(certificate.file)}
                      title="View Certificate"
                      disabled={!certificate.file}
                    >
                      <span className="action-icon">👁</span>
                      View
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => certificate.id && deleteCertificate(certificate.id)}
                      title="Delete Certificate"
                      disabled={!certificate.id}
                    >
                      <span className="action-icon">🗑</span>
                      Delete
                    </button>
                  </div>
                  {certificate.file && (
                    <div className="certificate-file-info">
                      <span className="file-format">
                        {getFileExtension(certificate.file)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}