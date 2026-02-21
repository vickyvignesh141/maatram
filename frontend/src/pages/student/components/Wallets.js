import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Wallets.module.css";
import StudentTopBar from "../../nav/studenttop";
import BASE_URL from "../../../baseurl";
import {
  FileText,
  Trash2,
  Eye,
  GraduationCap,
  Plus,
  Save,
  Download,
  Upload,
  BookOpen,
  Award,
  Calendar,
  Edit,
  X,
  Check,
  ChevronRight,
  Folder,
  ExternalLink,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  FileUp,
  FilePlus
} from "lucide-react";

export default function StudentWallet() {
  const username = localStorage.getItem("loggedUser");
  const [activeTab, setActiveTab] = useState("certificates");

  /* ================= CERTIFICATES ================= */
  const [certificates, setCertificates] = useState([]);
  const [certName, setCertName] = useState("");
  const [certFile, setCertFile] = useState(null);
  const [certFilePreview, setCertFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= ACADEMICS ================= */
  const [semesters, setSemesters] = useState([]);
  const [expandedSemester, setExpandedSemester] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingMarks, setEditingMarks] = useState("");
  const [semesterStats, setSemesterStats] = useState({});
  const [isAddingSemester, setIsAddingSemester] = useState(false);
  const [newSemesterName, setNewSemesterName] = useState("");

  // Filter certificates
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || cert.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (username) {
      fetchCertificates();
      fetchSemesters();
    }
  }, [username]);

  // Calculate semester statistics
  useEffect(() => {
    const stats = {};
    semesters.forEach(sem => {
      const subjects = sem.internals?.flatMap(int => int.subjects || []) || [];
      const totalMarks = subjects.reduce((sum, sub) => sum + (parseFloat(sub.marks) || 0), 0);
      const avgMarks = subjects.length > 0 ? totalMarks / subjects.length : 0;
      const maxMarks = subjects.length > 0 ? Math.max(...subjects.map(s => parseFloat(s.marks) || 0)) : 0;
      
      stats[sem.id] = {
        totalSubjects: subjects.length,
        averageMarks: avgMarks.toFixed(2),
        maxMarks: maxMarks,
        totalInternals: sem.internals?.length || 0
      };
    });
    setSemesterStats(stats);
  }, [semesters]);

  /* ================= CERTIFICATE FUNCTIONS ================= */
  const fetchCertificates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/student/${username}/certificates`);
      setCertificates(res.data.certificates || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const uploadCertificate = async () => {
    if (!certName || !certFile) {
      alert("Please provide certificate name and select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", certFile);
      formData.append("name", certName);
      formData.append("category", "academic"); // Default category, can be extended

      const res = await axios.post(`${BASE_URL}/student/${username}/certificate`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (res.data.success) {
        setCertName("");
        setCertFile(null);
        setCertFilePreview(null);
        setUploadProgress(0);
        fetchCertificates();
        alert("Certificate uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload certificate");
    }
  };

  const deleteCertificate = async (id) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      try {
        await axios.delete(`${BASE_URL}/student/${username}/certificate/${id}`);
        fetchCertificates();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const downloadCertificate = async (certificate) => {
    try {
      const response = await axios.get(`${BASE_URL}/certificate/${username}/${certificate.file}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', certificate.file);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCertFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setCertFilePreview(null);
      }
    }
  };

  /* ================= ACADEMIC FUNCTIONS ================= */
  const fetchSemesters = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/student/${username}/academics/semesters`);
      setSemesters(res.data || []);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const addSemester = async () => {
    if (!newSemesterName.trim()) {
      alert("Please enter a semester name");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/student/${username}/academics/semester`, {
        name: newSemesterName,
        semester: semesters.length + 1
      });
      
      setSemesters([...semesters, res.data]);
      setNewSemesterName("");
      setIsAddingSemester(false);
      setExpandedSemester(res.data.id);
    } catch (error) {
      console.error("Add semester error:", error);
    }
  };

  const deleteSemester = async (semesterId) => {
    if (window.confirm("Delete this semester and all its data?")) {
      try {
        await axios.delete(`${BASE_URL}/student/${username}/academics/semester/${semesterId}`);
        fetchSemesters();
      } catch (error) {
        console.error("Delete semester error:", error);
      }
    }
  };

  const addInternal = async (semesterId) => {
    const name = prompt("Enter internal name (e.g., Internal 1, Mid-term):");
    if (!name) return;

    try {
      const res = await axios.post(`${BASE_URL}/student/${username}/academics/internal`, {
        semester_id: semesterId,
        name: name
      });

      setSemesters(prev =>
        prev.map(s =>
          s.id === semesterId
            ? { ...s, internals: [...(s.internals || []), res.data] }
            : s
        )
      );
    } catch (error) {
      console.error("Add internal error:", error);
    }
  };

  const deleteInternal = async (semesterId, internalId) => {
    if (window.confirm("Delete this internal and all its subjects?")) {
      try {
        await axios.delete(`${BASE_URL}/student/${username}/academics/internal/${internalId}`);
        fetchSemesters();
      } catch (error) {
        console.error("Delete internal error:", error);
      }
    }
  };

  const addSubject = async (semesterId, internalId) => {
    const name = prompt("Enter subject name:");
    if (!name) return;

    try {
      const res = await axios.post(`${BASE_URL}/student/${username}/academics/subject`, {
        semester_id: semesterId,
        internal_id: internalId,
        name: name
      });

      setSemesters(prev =>
        prev.map(s =>
          s.id === semesterId
            ? {
                ...s,
                internals: s.internals.map(i =>
                  i.id === internalId
                    ? { ...i, subjects: [...(i.subjects || []), res.data] }
                    : i
                )
              }
            : s
        )
      );
    } catch (error) {
      console.error("Add subject error:", error);
    }
  };

  const deleteSubject = async (subjectId) => {
    if (window.confirm("Delete this subject?")) {
      try {
        await axios.delete(`${BASE_URL}/student/${username}/academics/subject/${subjectId}`);
        fetchSemesters();
      } catch (error) {
        console.error("Delete subject error:", error);
      }
    }
  };

  const updateMarks = async (subjectId, marks) => {
    if (marks === "" || marks > 100) return;

    try {
      await axios.put(`${BASE_URL}/student/${username}/academics/marks`, {
        subject_id: subjectId,
        marks: marks
      });
      fetchSemesters();
    } catch (error) {
      console.error("Update marks error:", error);
    }
  };

  const startEditingMarks = (subjectId, currentMarks) => {
    setEditingSubject(subjectId);
    setEditingMarks(currentMarks);
  };

  const saveEditedMarks = (subjectId) => {
    updateMarks(subjectId, editingMarks);
    setEditingSubject(null);
    setEditingMarks("");
  };

  /* ================= RENDER FUNCTIONS ================= */
  const renderCertificatesTab = () => (
    <div className={styles.certificatesTab}>
      <div className={styles.certificatesHeader}>
        <div className={styles.headerLeft}>
          <FileText size={28} />
          <div>
            <h2>My Certificates</h2>
            <p>Upload and manage your academic certificates</p>
          </div>
        </div>
        <div className={styles.certificateStats}>
          <div className={styles.statCard}>
            <FileText size={20} />
            <span>{certificates.length} Certificates</span>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className={styles.uploadSection}>
        <div className={styles.uploadCard}>
          <div className={styles.uploadHeader}>
            <FileUp size={24} />
            <h3>Upload New Certificate</h3>
          </div>
          
          <div className={styles.uploadForm}>
            <input
              type="text"
              className={styles.textInput}
              placeholder="Certificate Name (e.g., Python Course Certificate)"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
            />
            
            <div className={styles.fileUploadArea}>
              <FilePlus size={32} />
              <p>Drag & drop file or click to browse</p>
              <input
                type="file"
                id="certificate-upload"
                className={styles.fileInput}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label htmlFor="certificate-upload" className={styles.fileUploadBtn}>
                <Upload size={16} /> Choose File
              </label>
              {certFile && (
                <div className={styles.filePreview}>
                  <FileText size={14} />
                  <span>{certFile.name}</span>
                  <span className={styles.fileSize}>
                    ({(certFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>

            {certFilePreview && (
              <div className={styles.imagePreview}>
                <img src={certFilePreview} alt="Preview" />
              </div>
            )}

            {uploadProgress > 0 && (
              <div className={styles.uploadProgress}>
                <div 
                  className={styles.progressBar}
                  style={{ width: `${uploadProgress}%` }}
                />
                <span>{uploadProgress}%</span>
              </div>
            )}

            <button
              className={styles.uploadBtn}
              onClick={uploadCertificate}
              disabled={!certName || !certFile}
            >
              <Upload size={18} />
              Upload Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${filterCategory === 'all' ? styles.active : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All
          </button>
          <button
            className={`${styles.filterBtn} ${filterCategory === 'academic' ? styles.active : ''}`}
            onClick={() => setFilterCategory('academic')}
          >
            Academic
          </button>
          <button
            className={`${styles.filterBtn} ${filterCategory === 'achievement' ? styles.active : ''}`}
            onClick={() => setFilterCategory('achievement')}
          >
            Achievements
          </button>
          <button
            className={`${styles.filterBtn} ${filterCategory === 'skill' ? styles.active : ''}`}
            onClick={() => setFilterCategory('skill')}
          >
            Skills
          </button>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className={styles.certificatesGrid}>
        {filteredCertificates.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} />
            <h3>No Certificates Found</h3>
            <p>Upload your first certificate to get started</p>
          </div>
        ) : (
          filteredCertificates.map(cert => (
            <div key={cert.id} className={styles.certificateCard}>
              <div className={styles.certificateHeader}>
                <div className={styles.certificateIcon}>
                  <FileText size={24} />
                </div>
                <div className={styles.certificateActions}>
                  <button
                    className={styles.iconBtn}
                    onClick={() => downloadCertificate(cert)}
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    className={styles.iconBtn}
                    onClick={() => window.open(`${BASE_URL}/certificate/${username}/${cert.file}`, "_blank")}
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className={styles.iconBtn}
                    onClick={() => deleteCertificate(cert.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className={styles.certificateBody}>
                <h4>{cert.name}</h4>
                <div className={styles.certificateMeta}>
                  <span className={styles.categoryBadge}>{cert.category || 'Academic'}</span>
                  <span className={styles.date}>
                    {new Date(cert.upload_date).toLocaleDateString()}
                  </span>
                </div>
                <p className={styles.fileName}>
                  <FileText size={12} />
                  {cert.file}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAcademicsTab = () => (
    <div className={styles.academicsTab}>
      <div className={styles.academicsHeader}>
        <div className={styles.headerLeft}>
          <GraduationCap size={28} />
          <div>
            <h2>Academic Records</h2>
            <p>Manage your semester-wise academic performance</p>
          </div>
        </div>
        
        <div className={styles.academicStats}>
          <div className={styles.statCard}>
            <BookOpen size={20} />
            <span>{semesters.length} Semesters</span>
          </div>
          
        </div>
      </div>

      {/* Add Semester */}
      {isAddingSemester ? (
        <div className={styles.addSemesterCard}>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Semester Name (e.g., Fall 2023, Semester 1)"
            value={newSemesterName}
            onChange={(e) => setNewSemesterName(e.target.value)}
          />
          <div className={styles.formActions}>
            <button
              className={styles.primaryBtn}
              onClick={addSemester}
            >
              <Save size={16} /> Add Semester
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={() => setIsAddingSemester(false)}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className={styles.addSemesterBtn}
          onClick={() => setIsAddingSemester(true)}
        >
          <Plus size={18} /> Add New Semester
        </button>
      )}

      {/* Semesters List */}
      <div className={styles.semestersList}>
        {semesters.map(sem => (
          <div key={sem.id} className={styles.semesterCard}>
            <div className={styles.semesterHeader}>
              <div className={styles.semesterInfo}>
                <h3>
                  <ChevronRight 
                    size={20} 
                    className={`${styles.chevron} ${expandedSemester === sem.id ? styles.expanded : ''}`}
                    onClick={() => setExpandedSemester(expandedSemester === sem.id ? null : sem.id)}
                  />
                  {sem.name || `Semester ${sem.semester}`}
                </h3>
                <div className={styles.semesterMeta}>
                  <span className={styles.semesterStats}>
                    <BookOpen size={14} />
                    {semesterStats[sem.id]?.totalSubjects || 0} Subjects
                  </span>
                  <span className={styles.semesterStats}>
                    <BarChart3 size={14} />
                    Avg: {semesterStats[sem.id]?.averageMarks || 0}%
                  </span>
                </div>
              </div>
              
              <div className={styles.semesterActions}>
                <button
                  className={styles.iconBtn}
                  onClick={() => setExpandedSemester(expandedSemester === sem.id ? null : sem.id)}
                >
                  {expandedSemester === sem.id ? 'Collapse' : 'Expand'}
                </button>
                <button
                  className={styles.iconBtn}
                  onClick={() => deleteSemester(sem.id)}
                  title="Delete Semester"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Internals Section (Only show when expanded) */}
            {expandedSemester === sem.id && (
              <div className={styles.internalsSection}>
                <div className={styles.sectionHeader}>
                  <h4>Internal Assessments</h4>
                  <button
                    className={styles.addBtn}
                    onClick={() => addInternal(sem.id)}
                  >
                    <Plus size={16} /> Add Internal
                  </button>
                </div>

                {sem.internals?.length === 0 ? (
                  <div className={styles.emptySection}>
                    <p>No internal assessments added</p>
                  </div>
                ) : (
                  sem.internals?.map(int => (
                    <div key={int.id} className={styles.internalCard}>
                      <div className={styles.internalHeader}>
                        <h5>{int.name}</h5>
                        <div className={styles.internalActions}>
                          <button
                            className={styles.iconBtn}
                            onClick={() => addSubject(sem.id, int.id)}
                            title="Add Subject"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            className={styles.iconBtn}
                            onClick={() => deleteInternal(sem.id, int.id)}
                            title="Delete Internal"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Subjects Table */}
                      <div className={styles.subjectsTable}>
                        <div className={styles.tableHeader}>
                          <div className={styles.tableCell}>Subject</div>
                          <div className={styles.tableCell}>Marks</div>
                          <div className={styles.tableCell}>Actions</div>
                        </div>
                        
                        {int.subjects?.map(sub => (
                          <div key={sub.id} className={styles.tableRow}>
                            <div className={styles.tableCell}>
                              <BookOpen size={14} />
                              {sub.name}
                            </div>
                            <div className={styles.tableCell}>
                              {editingSubject === sub.id ? (
                                <div className={styles.editMarks}>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editingMarks}
                                    onChange={(e) => setEditingMarks(e.target.value)}
                                    className={styles.marksInput}
                                  />
                                  <button
                                    className={styles.saveBtn}
                                    onClick={() => saveEditedMarks(sub.id)}
                                  >
                                    <Check size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span className={styles.marksDisplay}>
                                  {sub.marks || '0'} / 100
                                </span>
                              )}
                            </div>
                            <div className={styles.tableCell}>
                              <div className={styles.rowActions}>
                                <button
                                  className={styles.iconBtn}
                                  onClick={() => startEditingMarks(sub.id, sub.marks)}
                                  title="Edit Marks"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  className={styles.iconBtn}
                                  onClick={() => deleteSubject(sub.id)}
                                  title="Delete Subject"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}

        {semesters.length === 0 && (
          <div className={styles.emptyState}>
            <GraduationCap size={48} />
            <h3>No Academic Records</h3>
            <p>Add your first semester to get started</p>
          </div>
        )}
      </div>
    </div>
  );

  /* ================= MAIN RENDER ================= */
  return (
    <div className={styles.container}>
      <StudentTopBar />
      
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Student Wallet</h1>
          <p className={styles.subtitle}>Manage your certificates and academic records</p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'certificates' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            <FileText size={18} />
            Certificates
            {certificates.length > 0 && (
              <span className={styles.badge}>{certificates.length}</span>
            )}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'academics' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('academics')}
          >
            <GraduationCap size={18} />
            Academics
            {semesters.length > 0 && (
              <span className={styles.badge}>{semesters.length}</span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'certificates' ? renderCertificatesTab() : renderAcademicsTab()}
        </div>
      </div>
    </div>
  );
}