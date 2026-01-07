import { useEffect, useState } from "react";
import axios from "axios";
import "./Wallets.css";
import StudentTopBar from "../../nav/studenttop";
import BASE_URL from "../../../baseurl";

/* ✅ Lucide Icons */
import { 
  BookOpen, 
  Edit3, 
  ClipboardList, 
  Trash2, 
  Save, 
  X,
  Plus,
  FileText,
  GraduationCap,
  Calculator,
  Calendar,
  TrendingUp,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Download
} from "lucide-react";

export default function StudentWallet() {
  const username = localStorage.getItem("loggedUser");

  /* ================= CERTIFICATE STATES ================= */
  const [certificates, setCertificates] = useState([]);
  const [certName, setCertName] = useState("");
  const [certFile, setCertFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [editCertName, setEditCertName] = useState("");

  /* ================= ACADEMIC STATES ================= */
  const [semester, setSemester] = useState(1);
  const [semesterGPA, setSemesterGPA] = useState("");
  const [semesterGrade, setSemesterGrade] = useState("");
  const [cgpa, setCgpa] = useState(null);
  
  /* Subject Management - Store in localStorage */
  const [allSubjects, setAllSubjects] = useState(() => {
    const saved = localStorage.getItem(`student_${username}_subjects`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSubjects, setCurrentSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  
  /* Marks Management - Store in localStorage */
  const [subjectMarks, setSubjectMarks] = useState(() => {
    const saved = localStorage.getItem(`student_${username}_marks`);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [semesterResults, setSemesterResults] = useState(() => {
    const saved = localStorage.getItem(`student_${username}_results`);
    return saved ? JSON.parse(saved) : [];
  });
  
  /* UI States */
  const [activeTab, setActiveTab] = useState("subjects");
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [viewMode, setViewMode] = useState(false); // true = view, false = edit
  const [selectedSubjectForView, setSelectedSubjectForView] = useState(null);

  /* ================= FETCH CERTIFICATES ================= */
  const fetchCertificates = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/student/${username}/certificates`
      );
      setCertificates(res.data?.certificates || []);
    } catch {
      setCertificates([]);
    }
  };

  /* ================= CERTIFICATE OPERATIONS ================= */
  const uploadCertificate = async () => {
    if (!certName || !certFile) return alert("Enter name and file");

    const formData = new FormData();
    formData.append("file", certFile);
    formData.append("name", certName);

    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/student/${username}/certificate`,
        formData
      );
      setCertName("");
      setCertFile(null);
      fetchCertificates();
      alert("Certificate uploaded successfully!");
    } catch (error) {
      alert("Error uploading certificate");
    } finally {
      setLoading(false);
    }
  };

  const updateCertificate = async (certId) => {
    if (!editCertName) return alert("Enter certificate name");
    
    try {
      await axios.put(
        `${BASE_URL}/student/${username}/certificate/${certId}`,
        { name: editCertName }
      );
      setEditingCertId(null);
      setEditCertName("");
      fetchCertificates();
      alert("Certificate updated successfully!");
    } catch (error) {
      alert("Error updating certificate");
    }
  };

  const deleteCertificate = async (certId) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) return;
    
    try {
      await axios.delete(
        `${BASE_URL}/student/${username}/certificate/${certId}`
      );
      fetchCertificates();
      alert("Certificate deleted successfully!");
    } catch (error) {
      alert("Error deleting certificate");
    }
  };

  /* ================= SUBJECT MANAGEMENT ================= */
  const addSubject = () => {
    if (!newSubject.trim()) {
      alert("Please enter a subject name");
      return;
    }

    const subjectId = Date.now().toString();
    const subjectCode = `SUB${subjectId.slice(-4)}`;
    
    const newSubjectData = {
      id: subjectId,
      name: newSubject,
      code: subjectCode,
      semester: semester,
      credits: 3,
      createdAt: new Date().toISOString()
    };

    const updatedAllSubjects = [...allSubjects, newSubjectData];
    setAllSubjects(updatedAllSubjects);
    localStorage.setItem(`student_${username}_subjects`, JSON.stringify(updatedAllSubjects));
    
    setCurrentSubjects(prev => [...prev, newSubjectData]);
    
    const updatedMarks = {
      ...subjectMarks,
      [subjectId]: {
        internal1: "",
        internal2: "",
        internal3: "",
        semesterEndMarks: "",
        semesterEndGrade: "",
        semester: semester
      }
    };
    setSubjectMarks(updatedMarks);
    localStorage.setItem(`student_${username}_marks`, JSON.stringify(updatedMarks));
    
    setNewSubject("");
    setIsAddingSubject(false);
    alert("Subject added successfully!");
  };

  const updateSubject = (subjectId) => {
    if (!editSubjectName.trim()) {
      alert("Please enter a subject name");
      return;
    }

    const updatedAllSubjects = allSubjects.map(subject =>
      subject.id === subjectId 
        ? { ...subject, name: editSubjectName } 
        : subject
    );
    
    setAllSubjects(updatedAllSubjects);
    localStorage.setItem(`student_${username}_subjects`, JSON.stringify(updatedAllSubjects));
    
    setCurrentSubjects(prev =>
      prev.map(subject =>
        subject.id === subjectId 
          ? { ...subject, name: editSubjectName } 
          : subject
      )
    );
    
    setEditingSubjectId(null);
    setEditSubjectName("");
    alert("Subject updated successfully!");
  };

  const deleteSubject = (subjectId) => {
    if (!window.confirm("Are you sure you want to delete this subject and all its marks?")) return;
    
    const updatedAllSubjects = allSubjects.filter(subject => subject.id !== subjectId);
    setAllSubjects(updatedAllSubjects);
    localStorage.setItem(`student_${username}_subjects`, JSON.stringify(updatedAllSubjects));
    
    setCurrentSubjects(prev => prev.filter(subject => subject.id !== subjectId));
    
    const updatedMarks = { ...subjectMarks };
    delete updatedMarks[subjectId];
    setSubjectMarks(updatedMarks);
    localStorage.setItem(`student_${username}_marks`, JSON.stringify(updatedMarks));
    
    alert("Subject deleted successfully!");
  };

  /* ================= MARKS MANAGEMENT ================= */
  const handleMarksChange = (subjectId, field, value) => {
    const updatedMarks = {
      ...subjectMarks,
      [subjectId]: {
        ...subjectMarks[subjectId],
        [field]: value
      }
    };
    
    setSubjectMarks(updatedMarks);
    localStorage.setItem(`student_${username}_marks`, JSON.stringify(updatedMarks));
  };

  const saveMarksForSubject = (subjectId, subjectName) => {
    const marks = subjectMarks[subjectId];
    if (!marks) return;
    
    const hasMarks = marks.internal1 || marks.internal2 || marks.internal3 || 
                    marks.semesterEndMarks || marks.semesterEndGrade;
    
    if (!hasMarks) {
      alert("Please enter at least one mark");
      return;
    }
    
    alert(`Marks saved for ${subjectName}!`);
    setExpandedSubjects(prev => ({ ...prev, [subjectId]: false }));
  };

  const saveAllMarksForSemester = () => {
    const subjectsWithMarks = currentSubjects.filter(subject => {
      const marks = subjectMarks[subject.id];
      return marks && (
        marks.internal1 || 
        marks.internal2 || 
        marks.internal3 || 
        marks.semesterEndMarks || 
        marks.semesterEndGrade
      );
    });

    if (subjectsWithMarks.length === 0) {
      alert("No marks entered for any subject");
      return;
    }

    alert(`Marks saved for ${subjectsWithMarks.length} subject(s)!`);
  };

  /* ================= VIEW/EDIT FUNCTIONS ================= */
  const toggleViewMode = () => {
    setViewMode(!viewMode);
    if (viewMode) {
      setSelectedSubjectForView(null);
    }
  };

  const viewSubjectDetails = (subjectId) => {
    setSelectedSubjectForView(subjectId);
    setViewMode(true);
  };

  const exportData = () => {
    const data = {
      subjects: allSubjects,
      marks: subjectMarks,
      results: semesterResults,
      cgpa: cgpa,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `academic_records_${username}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert("Data exported successfully!");
  };

  /* ================= SEMESTER RESULTS ================= */
  const uploadSemesterResults = () => {
    if (!semesterGPA || !semesterGrade) {
      alert("Enter Semester GPA and Grade");
      return;
    }

    const newResult = {
      id: Date.now().toString(),
      semester: semester,
      gpa: semesterGPA,
      grade: semesterGrade,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    const updatedResults = [...semesterResults, newResult];
    setSemesterResults(updatedResults);
    localStorage.setItem(`student_${username}_results`, JSON.stringify(updatedResults));
    
    calculateCGPA(updatedResults);
    
    alert("Semester results saved successfully!");
    setSemesterGPA("");
    setSemesterGrade("");
  };

  const deleteSemesterResult = (resultId) => {
    if (!window.confirm("Are you sure you want to delete this semester's result?")) return;
    
    const updatedResults = semesterResults.filter(result => result.id !== resultId);
    setSemesterResults(updatedResults);
    localStorage.setItem(`student_${username}_results`, JSON.stringify(updatedResults));
    
    calculateCGPA(updatedResults);
    
    alert("Semester result deleted successfully!");
  };

  const calculateCGPA = (results) => {
    if (results.length === 0) {
      setCgpa(null);
      return;
    }
    
    const totalGPA = results.reduce((sum, result) => sum + parseFloat(result.gpa), 0);
    const averageCGPA = (totalGPA / results.length).toFixed(2);
    setCgpa(averageCGPA);
  };

  /* ================= HELPER FUNCTIONS ================= */
  const toggleSubjectExpansion = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

  const calculateInternalAverage = (subjectId) => {
    const marks = subjectMarks[subjectId];
    if (!marks) return 0;
    
    const values = [
      marks.internal1,
      marks.internal2,
      marks.internal3
    ].filter(val => val !== "" && !isNaN(parseFloat(val)));
    
    if (values.length === 0) return 0;
    
    const sum = values.reduce((acc, val) => acc + parseFloat(val), 0);
    return (sum / values.length).toFixed(2);
  };

  const getSubjectStats = (subjectId) => {
    const marks = subjectMarks[subjectId] || {};
    
    const internalTests = ['internal1', 'internal2', 'internal3'];
    const completedInternals = internalTests.filter(test => marks[test] && marks[test] !== "").length;
    
    return {
      completedInternals,
      hasSemesterMarks: marks.semesterEndMarks && marks.semesterEndMarks !== "",
      hasSemesterGrade: marks.semesterEndGrade && marks.semesterEndGrade !== "",
      totalInternals: 3
    };
  };

  /* ================= INITIAL FETCHES ================= */
  useEffect(() => {
    if (username) {
      fetchCertificates();
      calculateCGPA(semesterResults);
    }
  }, [username]);

  useEffect(() => {
    const currentSemSubjects = allSubjects.filter(subject => subject.semester === semester);
    setCurrentSubjects(currentSemSubjects);
  }, [semester, allSubjects]);

  return (
    <div className="progress-container">
      <StudentTopBar />

      <div className="wallet-split-container">
        {/* ================= LEFT : CERTIFICATES ================= */}
        <div className="wallet-left">
          <div className="section-header">
            <FileText size={24} />
            <h2>Certificates</h2>
          </div>

          <div className="upload-form">
            <input
              type="text"
              placeholder="Certificate Name"
              value={certName}
              onChange={e => setCertName(e.target.value)}
            />

            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={e => setCertFile(e.target.files[0])}
            />

            <button 
              onClick={uploadCertificate} 
              disabled={loading}
              className="upload-btn"
            >
              {loading ? "Uploading..." : "Upload Certificate"}
            </button>
          </div>

          <div className="certificates-list">
            {certificates.map(cert => (
              <div key={cert.id} className="certificate-item">
                {editingCertId === cert.id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editCertName}
                      onChange={e => setEditCertName(e.target.value)}
                      placeholder="Edit certificate name"
                    />
                    <div className="action-buttons">
                      <button 
                        onClick={() => updateCertificate(cert.id)}
                        className="save-btn"
                      >
                        <Save size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingCertId(null);
                          setEditCertName("");
                        }}
                        className="cancel-btn"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="cert-name">{cert.name}</span>
                    <div className="cert-actions">
                      <button
                        onClick={() => window.open(
                          `${BASE_URL}/certificate/${username}/${cert.file}`,
                          "_blank"
                        )}
                        className="view-btn"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setEditingCertId(cert.id);
                          setEditCertName(cert.name);
                        }}
                        className="edit-btn"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteCertificate(cert.id)}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {certificates.length === 0 && (
              <p className="no-data">No certificates uploaded yet</p>
            )}
          </div>
        </div>

        {/* ================= RIGHT : ACADEMICS ================= */}
        <div className="wallet-right">
          <div className="section-header">
            <GraduationCap size={24} />
            <h2>Academic Records - Semester {semester}</h2>
            <div className="view-edit-controls">
              <button 
                className={`mode-toggle-btn ${viewMode ? 'view-mode' : 'edit-mode'}`}
                onClick={toggleViewMode}
              >
                {viewMode ? (
                  <>
                    <Edit3 size={16} />
                    Switch to Edit Mode
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    Switch to View Mode
                  </>
                )}
              </button>
              <button 
                className="export-btn"
                onClick={exportData}
              >
                <Download size={16} />
                Export Data
              </button>
            </div>
          </div>

          {/* Academic Stats Overview */}
          <div className="academic-stats-overview">
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Current Semester</span>
                <span className="stat-value">Semester {semester}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Calculator size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">CGPA</span>
                <span className="stat-value">{cgpa || "N/A"}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <BookOpen size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Subjects</span>
                <span className="stat-value">{currentSubjects.length}</span>
              </div>
            </div>
          </div>

          {/* Semester Selector */}
          <div className="semester-selector-card">
            <div className="selector-header">
              <Calendar size={20} />
              <h3>Select Semester</h3>
            </div>
            <div className="semester-buttons">
              {[1,2,3,4,5,6,7,8].map(sem => (
                <button
                  key={sem}
                  className={`sem-btn ${semester === sem ? 'active' : ''}`}
                  onClick={() => setSemester(sem)}
                >
                  Semester {sem}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Tabs */}
          <div className="academic-tabs">
            <button 
              className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
              onClick={() => setActiveTab('subjects')}
            >
              <BookOpen size={18} />
              Subjects & Marks
            </button>
            <button 
              className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              <CheckCircle size={18} />
              Final Results
            </button>
          </div>

          {/* Subjects & Marks Tab */}
          {activeTab === 'subjects' && (
            <div className="subjects-marks-container">
              <div className="section-header-with-action">
                <h3>
                  {viewMode ? 'View Subjects & Marks' : 'Manage Subjects & Marks'} 
                  {viewMode && selectedSubjectForView && (
                    <span className="viewing-subject"> - Viewing Subject Details</span>
                  )}
                </h3>
                <div className="action-buttons">
                  {!viewMode && (
                    <>
                      <button 
                        className="add-subject-btn"
                        onClick={() => setIsAddingSubject(true)}
                      >
                        <Plus size={16} />
                        Add Subject
                      </button>
                      <button 
                        className="save-all-btn"
                        onClick={saveAllMarksForSemester}
                      >
                        <Save size={16} />
                        Save All Marks
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Add Subject Input (Only in Edit Mode) */}
              {!viewMode && isAddingSubject && (
                <div className="add-subject-form">
                  <input
                    type="text"
                    placeholder="Enter subject name"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                  />
                  <div className="form-actions">
                    <button 
                      onClick={addSubject}
                      className="save-btn"
                    >
                      <Save size={16} />
                      Add
                    </button>
                    <button 
                      onClick={() => {
                        setIsAddingSubject(false);
                        setNewSubject("");
                      }}
                      className="cancel-btn"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* View Mode - Subject Details */}
              {viewMode && selectedSubjectForView && (
                <div className="subject-detail-view">
                  <div className="detail-header">
                    <h4>Subject Details</h4>
                    <button 
                      onClick={() => setSelectedSubjectForView(null)}
                      className="close-view-btn"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {(() => {
                    const subject = allSubjects.find(s => s.id === selectedSubjectForView);
                    const marks = subjectMarks[selectedSubjectForView];
                    if (!subject) return null;
                    
                    return (
                      <div className="detail-content">
                        <div className="detail-section">
                          <h5>Subject Information</h5>
                          <div className="detail-grid">
                            <div className="detail-item">
                              <span className="detail-label">Name:</span>
                              <span className="detail-value">{subject.name}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Code:</span>
                              <span className="detail-value">{subject.code}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Semester:</span>
                              <span className="detail-value">Semester {subject.semester}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Credits:</span>
                              <span className="detail-value">{subject.credits}</span>
                            </div>
                          </div>
                        </div>
                        
                        {marks && (
                          <div className="detail-section">
                            <h5>Marks Details</h5>
                            <div className="marks-detail-grid">
                              {/* Internal Tests */}
                              <div className="marks-category">
                                <h6>Internal Tests</h6>
                                <div className="marks-list">
                                  <div className="mark-item">
                                    <span>Internal Test 1:</span>
                                    <span className={marks.internal1 ? "filled" : "empty"}>
                                      {marks.internal1 || "Not Entered"}
                                    </span>
                                  </div>
                                  <div className="mark-item">
                                    <span>Internal Test 2:</span>
                                    <span className={marks.internal2 ? "filled" : "empty"}>
                                      {marks.internal2 || "Not Entered"}
                                    </span>
                                  </div>
                                  <div className="mark-item">
                                    <span>Internal Test 3:</span>
                                    <span className={marks.internal3 ? "filled" : "empty"}>
                                      {marks.internal3 || "Not Entered"}
                                    </span>
                                  </div>
                                  <div className="mark-item average">
                                    <span>Internal Average:</span>
                                    <span className="average-value">
                                      {calculateInternalAverage(subject.id)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Semester End Exam */}
                              <div className="marks-category">
                                <h6>Semester End Examination</h6>
                                <div className="marks-list">
                                  <div className="mark-item">
                                    <span>Marks Obtained:</span>
                                    <span className={marks.semesterEndMarks ? "filled" : "empty"}>
                                      {marks.semesterEndMarks || "Not Entered"}
                                    </span>
                                  </div>
                                  <div className="mark-item">
                                    <span>Grade:</span>
                                    <span className={marks.semesterEndGrade ? "filled" : "empty"}>
                                      {marks.semesterEndGrade || "Not Entered"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Subjects List */}
              <div className="subjects-list">
                {currentSubjects.length === 0 ? (
                  <div className="no-subjects">
                    <BookOpen size={48} />
                    <p>No subjects added for Semester {semester}</p>
                    {!viewMode && (
                      <button 
                        className="add-first-subject-btn"
                        onClick={() => setIsAddingSubject(true)}
                      >
                        <Plus size={16} />
                        Add Your First Subject
                      </button>
                    )}
                  </div>
                ) : (
                  currentSubjects.map(subject => (
                    <div key={subject.id} className="subject-card">
                      <div className="subject-header">
                        <div className="subject-info">
                          {editingSubjectId === subject.id ? (
                            <div className="edit-subject-form">
                              <input
                                type="text"
                                value={editSubjectName}
                                onChange={(e) => setEditSubjectName(e.target.value)}
                                placeholder="Edit subject name"
                              />
                              <div className="edit-actions">
                                <button 
                                  onClick={() => updateSubject(subject.id)}
                                  className="save-btn"
                                >
                                  <Save size={14} />
                                </button>
                                <button 
                                  onClick={() => {
                                    setEditingSubjectId(null);
                                    setEditSubjectName("");
                                  }}
                                  className="cancel-btn"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="subject-name-row">
                                <h4>{subject.name}</h4>
                                <div className="subject-stats">
                                  <span className="stat-badge">
                                    {getSubjectStats(subject.id).completedInternals}/3 Internals
                                  </span>
                                  {getSubjectStats(subject.id).hasSemesterMarks && (
                                    <span className="stat-badge success">
                                      Semester: {subjectMarks[subject.id]?.semesterEndGrade || ""}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="subject-meta">
                                <span className="subject-code">Code: {subject.code}</span>
                                <span className="subject-credits">Credits: {subject.credits}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="subject-actions">
                          {viewMode ? (
                            <button
                              onClick={() => viewSubjectDetails(subject.id)}
                              className="view-details-btn"
                            >
                              <Eye size={14} />
                              View Details
                            </button>
                          ) : (
                            editingSubjectId !== subject.id && (
                              <>
                                <button
                                  onClick={() => toggleSubjectExpansion(subject.id)}
                                  className="expand-btn"
                                >
                                  {expandedSubjects[subject.id] ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                  {expandedSubjects[subject.id] ? 'Hide Marks' : 'Enter Marks'}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingSubjectId(subject.id);
                                    setEditSubjectName(subject.name);
                                  }}
                                  className="edit-btn"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => deleteSubject(subject.id)}
                                  className="delete-btn"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )
                          )}
                        </div>
                      </div>

                      {/* Expanded Marks Section (Edit Mode Only) */}
                      {!viewMode && expandedSubjects[subject.id] && (
                        <div className="marks-section">
                          <div className="marks-header">
                            <h5>Enter Marks for {subject.name}</h5>
                          </div>
                          
                          {/* Internal Tests */}
                          <div className="internal-tests-section">
                            <h6>Internal Tests</h6>
                            <div className="test-inputs">
                              {[
                                { key: 'internal1', label: 'Internal Test 1' },
                                { key: 'internal2', label: 'Internal Test 2' },
                                { key: 'internal3', label: 'Internal Test 3' }
                              ].map(test => (
                                <div key={test.key} className="test-input">
                                  <label>{test.label}</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={subjectMarks[subject.id]?.[test.key] || ""}
                                    onChange={(e) => handleMarksChange(subject.id, test.key, e.target.value)}
                                    placeholder="Marks out of 100"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Semester End Exam */}
                          <div className="semester-exam-section">
                            <h6>Semester End Examination</h6>
                            <div className="semester-inputs">
                              <div className="semester-input">
                                <label>Marks Obtained</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={subjectMarks[subject.id]?.semesterEndMarks || ""}
                                  onChange={(e) => handleMarksChange(subject.id, 'semesterEndMarks', e.target.value)}
                                  placeholder="Marks out of 100"
                                />
                              </div>
                              <div className="semester-input">
                                <label>Grade</label>
                                <select
                                  value={subjectMarks[subject.id]?.semesterEndGrade || ""}
                                  onChange={(e) => handleMarksChange(subject.id, 'semesterEndGrade', e.target.value)}
                                >
                                  <option value="">Select Grade</option>
                                  <option value="A+">A+</option>
                                  <option value="A">A</option>
                                  <option value="B+">B+</option>
                                  <option value="B">B</option>
                                  <option value="C+">C+</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="F">F</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Stats and Actions */}
                          <div className="marks-footer">
                            <div className="marks-stats">
                              <div className="stat">
                                <span className="stat-label">Average:</span>
                                <span className="stat-value">
                                  {calculateInternalAverage(subject.id)}%
                                </span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">Internals Done:</span>
                                <span className="stat-value">
                                  {getSubjectStats(subject.id).completedInternals}/3
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => saveMarksForSubject(subject.id, subject.name)}
                              className="save-marks-btn"
                            >
                              <Save size={16} />
                              Save Marks
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* All Subjects Summary */}
              {allSubjects.length > 0 && (
                <div className="all-subjects-summary">
                  <h4>All Subjects Across Semesters</h4>
                  <div className="summary-grid">
                    {[1,2,3,4,5,6,7,8].map(sem => {
                      const semSubjects = allSubjects.filter(subj => subj.semester === sem);
                      if (semSubjects.length === 0) return null;
                      
                      return (
                        <div key={sem} className="semester-summary">
                          <h5>Semester {sem}</h5>
                          <ul>
                            {semSubjects.map(subj => (
                              <li key={subj.id}>
                                <span className="subject-name">{subj.name}</span>
                                <span className="subject-code">{subj.code}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Final Results Tab */}
          {activeTab === 'results' && (
            <div className="final-results-container">
              {/* Existing Results */}
              {semesterResults.filter(r => r.semester === semester).length > 0 ? (
                <div className="existing-results-section">
                  <h3>Results for Semester {semester}</h3>
                  {semesterResults
                    .filter(result => result.semester === semester)
                    .map(result => (
                      <div key={result.id} className="result-card">
                        <div className="result-info">
                          <div className="result-item">
                            <span className="result-label">Semester GPA:</span>
                            <span className="result-value">{result.gpa}</span>
                          </div>
                          <div className="result-item">
                            <span className="result-label">Grade:</span>
                            <span className="result-value">{result.grade}</span>
                          </div>
                          <div className="result-item">
                            <span className="result-label">Date:</span>
                            <span className="result-timestamp">
                              {new Date(result.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteSemesterResult(result.id)}
                          className="delete-result-btn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="no-results-message">
                  <p>No results saved for this semester yet.</p>
                </div>
              )}

              {/* Upload New Results */}
              <div className="upload-final-results">
                <h3>Save Final Results</h3>
                <div className="final-results-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Semester Grade</label>
                      <input
                        type="text"
                        placeholder="e.g., A, B+, etc."
                        value={semesterGrade}
                        onChange={e => setSemesterGrade(e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Semester GPA</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="e.g., 8.5"
                        value={semesterGPA}
                        onChange={e => setSemesterGPA(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="form-summary">
                    <div className="summary-item">
                      <span>Total Subjects:</span>
                      <span>{currentSubjects.length}</span>
                    </div>
                    <div className="summary-item">
                      <span>Subjects with Marks:</span>
                      <span>
                        {currentSubjects.filter(subj => {
                          const marks = subjectMarks[subj.id];
                          return marks && (
                            marks.internal1 || 
                            marks.internal2 || 
                            marks.internal3 ||
                            marks.semesterEndMarks
                          );
                        }).length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      onClick={uploadSemesterResults}
                      className="upload-final-btn"
                      disabled={!semesterGPA || !semesterGrade}
                    >
                      <Save size={18} />
                      Save Semester Results
                    </button>
                  </div>
                </div>
              </div>

              {/* All Semester Results Summary */}
              {semesterResults.length > 0 && (
                <div className="all-results-summary">
                  <h4>All Semester Results</h4>
                  <div className="results-table">
                    <div className="table-header">
                      <div className="header-cell">Semester</div>
                      <div className="header-cell">GPA</div>
                      <div className="header-cell">Grade</div>
                      <div className="header-cell">Date</div>
                    </div>
                    {semesterResults
                      .sort((a, b) => b.semester - a.semester)
                      .map(result => (
                        <div key={result.id} className="table-row">
                          <div className="cell">Semester {result.semester}</div>
                          <div className="cell">{result.gpa}</div>
                          <div className="cell">{result.grade}</div>
                          <div className="cell">
                            {new Date(result.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}