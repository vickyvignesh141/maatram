import React, { useState, useEffect } from "react";
import axios from "axios";
import Admintop from "../../nav/admintop";
import { Check, X, AlertCircle, RefreshCw, Users, UserCheck } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./admin_MenStuAssign.module.css";

const API = "http://localhost:5000/api/admin";

const AdminMentorAssignments = () => {
  const [mentors, setMentors] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [assignmentMode, setAssignmentMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  

  const [search, setSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);
  const studentsPerPage = 20;

  const [loading, setLoading] = useState({
    mentors: false,
    students: false,
    assigning: false
  });
  const [error, setError] = useState(null);

  /* ---------------- FETCH MENTORS ---------------- */
  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(prev => ({...prev, mentors: true}));
    setError(null);
    try {
      const res = await axios.get(`${API}/mentors`);
      console.log("Mentor API response:", res.data);

      if (res.data?.success && Array.isArray(res.data.data)) {
        const formatted = res.data.data.map((m) => ({
          
          id: m.username,
          mentorId: m.username || "",
          name: m.name ?? "Unnamed Mentor",
          email: m.email ?? "No email",
          currentStudents: m.student_count || 0,
          maxStudents: 25,
          students: [],
        }));
        setMentors(formatted);
        toast.success("Mentors loaded successfully");
      } else {
        setMentors([]);
        toast.warn("No mentors found");
      }
    } catch (err) {
      console.error("Failed to fetch mentors", err);
      setError("Failed to load mentors. Please try again.");
      toast.error("Failed to load mentors");
    } finally {
      setLoading(prev => ({...prev, mentors: false}));
    }
  };

  /* ---------------- FETCH AVAILABLE STUDENTS ---------------- */
  const handleAssignStudents = async (mentor) => {
    setSelectedMentor(mentor);
    setAssignmentMode(true);
    setSelectedStudents([]);
    setStudentPage(1);
    setStudentSearch("");

    setLoading(prev => ({...prev, students: true}));
    try {
      const res = await axios.get(`${API}/students/unassigned`);
      if (res.data?.success && Array.isArray(res.data.students)) {
        const formatted = res.data.students.map((s) => ({
          id: s.username || "",
          studentId: s.username || "",
          name: s.name || "Unnamed Student",
          college: s.college || "No college specified",
        }));
        setAvailableStudents(formatted);
      } else {
        setAvailableStudents([]);
      }
    } catch (err) {
      console.error("Failed to fetch students", err);
      toast.error("Failed to load students");
    } finally {
      setLoading(prev => ({...prev, students: false}));
    }
  };

  /* ---------------- HELPER FUNCTIONS ---------------- */
  const getRemainingCapacity = (mentor) => {
    return Math.max(0, mentor.maxStudents - mentor.currentStudents);
  };

  const selectAllStudents = () => {
    if (!selectedMentor) return;
    
    const maxCanSelect = getRemainingCapacity(selectedMentor);
    const studentsToSelect = filteredStudents.slice(0, maxCanSelect);
    
    setSelectedStudents(studentsToSelect);
    toast.info(`Selected ${studentsToSelect.length} students`);
  };

  const clearAllStudents = () => {
    setSelectedStudents([]);
  };

  /* ---------------- TOGGLE STUDENT SELECTION ---------------- */
  const toggleStudentSelection = (student) => {
    const exists = selectedStudents.some((s) => s.id === student.id);

    if (exists) {
      setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    } else if (
      selectedMentor &&
      selectedStudents.length < getRemainingCapacity(selectedMentor)
    ) {
      setSelectedStudents([...selectedStudents, student]);
    } else {
      toast.warn(`Cannot assign more than ${selectedMentor.maxStudents} students to this mentor`);
    }
  };

  /* ---------------- CONFIRM ASSIGNMENT ---------------- */
  const confirmAssignment = async () => {
    if (!selectedStudents.length || !selectedMentor) {
      toast.warn("Please select at least one student");
      return;
    }

    setLoading(prev => ({...prev, assigning: true}));
    try {
      const res = await axios.post(`${API}/assign`, {
        mentorUsername: selectedMentor.mentorId,
        studentUsernames: selectedStudents.map((s) => s.studentId),
      });

      if (res.data?.success) {
        toast.success(`Successfully assigned ${selectedStudents.length} student(s) to ${selectedMentor.name}`);
        fetchMentors();
        setAssignmentMode(false);
        setShowConfirm(false);
        setSelectedMentor(null);
        setSelectedStudents([]);
        setStudentSearch("");
      }
    } catch (err) {
      console.error("Assignment failed", err);
      toast.error("Assignment failed. Please try again.");
    } finally {
      setLoading(prev => ({...prev, assigning: false}));
    }
  };

  const handleConfirmClick = () => {
    if (selectedStudents.length === 0) {
      toast.warn("Please select at least one student");
      return;
    }
    setShowConfirm(true);
  };

  /* ---------------- FILTERING ---------------- */
  const filteredMentors = mentors.filter((m) => {
    const term = search.toLowerCase();
    const name = (m.name || "").toLowerCase();
    const mentorId = (m.mentorId || "").toLowerCase();
    const email = (m.email || "").toLowerCase();

    return (
      name.includes(term) ||
      mentorId.includes(term) ||
      email.includes(term)
    );
  });

  const filteredStudents = availableStudents.filter((s) => {
    const term = studentSearch.toLowerCase();
    const name = (s.name || "").toLowerCase();
    const studentId = (s.studentId || "").toLowerCase();
    const college = (s.college || "").toLowerCase();

    return (
      name.includes(term) ||
      studentId.includes(term) ||
      college.includes(term)
    );
  });

  const paginatedStudents = filteredStudents.slice(
    (studentPage - 1) * studentsPerPage,
    studentPage * studentsPerPage
  );

  /* ---------------- STATS ---------------- */
  const totalCapacity = mentors.reduce((a, b) => a + b.maxStudents, 0);
  const totalAssigned = mentors.reduce((a, b) => a + b.currentStudents, 0);
  const totalAvailable = totalCapacity - totalAssigned;

  /* ---------------- KEYBOARD SHORTCUTS ---------------- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && assignmentMode) {
        if (showConfirm) {
          setShowConfirm(false);
        } else {
          setAssignmentMode(false);
        }
      }
      if (e.key === 'Enter' && e.ctrlKey && selectedStudents.length > 0 && assignmentMode) {
        handleConfirmClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [assignmentMode, selectedStudents, showConfirm]);

  return (
    <div className={styles.page}>
      <Admintop activeTab="assignments" />

      <div className={styles.container}>
        <h1 className={styles.title}>
          <Users size={28} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Mentor Management
        </h1>

        {/* Error Display */}
        {error && (
          <div className={styles.error}>
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={fetchMentors}>
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        )}

        {/* STATS */}
        <div className={styles.capacityStats}>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>{totalCapacity}</div>
            <div style={{ fontSize: '14px', fontWeight: 'normal' }}>Total Capacity</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>{totalAssigned}</div>
            <div style={{ fontSize: '14px', fontWeight: 'normal' }}>Assigned</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>{totalAvailable}</div>
            <div style={{ fontSize: '14px', fontWeight: 'normal' }}>Available</div>
          </div>
        </div>

        {/* SEARCH */}
        <input
          className={styles.searchInput}
          placeholder="Search mentors by name, ID, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        {loading.mentors ? (
          <div className={styles.loading}>
            <RefreshCw className="spin" style={{ animation: 'spin 1s linear infinite' }} />
            <p>Loading mentors...</p>
          </div>
        ) : (
          <table className={styles.mentorsTable}>
            <thead>
              <tr>
                <th>Mentor Information</th>
                <th>Capacity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentors.length === 0 ? (
                <tr>
                  <td colSpan="3" className={styles.emptyState}>
                    <h4>No mentors found</h4>
                    <p>Try adjusting your search or add new mentors</p>
                  </td>
                </tr>
              ) : (
                filteredMentors.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <b>{m.name}</b>
                      <div>ID: {m.mentorId}</div>
                      <div>{m.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '20px' }}>
                        {m.currentStudents}/{m.maxStudents}
                      </div>
                      {getRemainingCapacity(m) > 0 ? (
                        <div className={styles.capacityRemaining}>
                          ({getRemainingCapacity(m)} slots available)
                        </div>
                      ) : (
                        <div className={styles.capacityWarning}>
                          Capacity full
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleAssignStudents(m)}
                        disabled={m.currentStudents >= m.maxStudents}
                        aria-label={`Assign students to ${m.name}`}
                      >
                        {m.currentStudents >= m.maxStudents ? 'Full' : 'Assign'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* ASSIGN MODAL */}
        {assignmentMode && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>
                <UserCheck size={22} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                Assign Students to {selectedMentor?.name}
                <span className={styles.selectedCount}>
                  {selectedStudents.length} selected
                </span>
              </h3>

              <input
                placeholder="Search students by name, ID, or college..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />

              {/* Bulk Actions */}
              <div className={styles.bulkActions}>
                <button onClick={selectAllStudents}>
                  Select All (Up to Capacity)
                </button>
                <button onClick={clearAllStudents}>
                  Clear All
                </button>
              </div>

              {/* Students List */}
              <div className={styles.studentsList}>
                {loading.students ? (
                  <div className={styles.loading}>
                    <RefreshCw className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <p>Loading students...</p>
                  </div>
                ) : paginatedStudents.length === 0 ? (
                  <div className={styles.emptyState}>
                    <h4>No students found</h4>
                    <p>Try adjusting your search or check if all students are already assigned</p>
                  </div>
                ) : (
                  paginatedStudents.map((s) => (
                    <div
                      key={s.id}
                      className={`${styles.studentOption} ${
                        selectedStudents.some((sel) => sel.id === s.id)
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => toggleStudentSelection(s)}
                    >
                      <div>
                        <div style={{ fontWeight: '600' }}>{s.name}</div>
                        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                          ID: {s.studentId} | {s.college}
                        </div>
                      </div>
                      {selectedStudents.some((sel) => sel.id === s.id) && (
                        <Check size={18} />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {filteredStudents.length > studentsPerPage && (
                <div className={styles.bulkActions}>
                  <button 
                    onClick={() => setStudentPage(p => Math.max(1, p - 1))}
                    disabled={studentPage === 1}
                  >
                    Previous
                  </button>
                  <span style={{ flex: 1, textAlign: 'center', padding: '10px' }}>
                    Page {studentPage} of {Math.ceil(filteredStudents.length / studentsPerPage)}
                  </span>
                  <button 
                    onClick={() => setStudentPage(p => p + 1)}
                    disabled={studentPage * studentsPerPage >= filteredStudents.length}
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Modal Actions */}
              <div className={styles.modalActions}>
                <button 
                  onClick={handleConfirmClick}
                  disabled={selectedStudents.length === 0 || loading.assigning}
                >
                  {loading.assigning ? (
                    <>
                      <RefreshCw size={16} className="spin" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                      Assigning...
                    </>
                  ) : (
                    `Assign ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}`
                  )}
                </button>
                <button onClick={() => setAssignmentMode(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRMATION MODAL */}
        {showConfirm && (
          <div className={styles.confirmOverlay}>
            <div className={styles.confirmBox}>
              <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Confirm Assignment</h3>
              <p>
                Are you sure you want to assign <strong>{selectedStudents.length}</strong> student(s) to mentor <strong>{selectedMentor?.name}</strong>?
              </p>
              
              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                <strong>Selected Students:</strong>
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  {selectedStudents.slice(0, 10).map((s, idx) => (
                    <li key={s.id} style={{ marginBottom: '5px' }}>
                      {s.name} ({s.studentId})
                    </li>
                  ))}
                  {selectedStudents.length > 10 && (
                    <li style={{ fontStyle: 'italic', color: '#64748b' }}>
                      ...and {selectedStudents.length - 10} more
                    </li>
                  )}
                </ul>
              </div>

              <div className={styles.confirmActions}>
                <button onClick={confirmAssignment}>
                  {loading.assigning ? 'Assigning...' : 'Yes, Assign Students'}
                </button>
                <button onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className={styles.toastContainer}
      />
    </div>
  );
};

export default AdminMentorAssignments;