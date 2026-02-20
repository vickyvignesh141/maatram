import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from "../../../baseurl";
import MentorTopBar from "../../mentornav/mentortop";
import styles from './Men_Studetails.module.css';
import { 
  UserCircle, Linkedin, Github, Globe as Web, FileType, AlertCircle 
} from "lucide-react";

const MentorViewStudentProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  


  useEffect(() => {
    const mentorId = localStorage.getItem("loggedUser");

    if (!mentorId) {
      setError("You must be logged in as a mentor to view this page");
      setLoading(false);
      return;
    }

    if (!username) {
      setError("Student username not found");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch(`${BASE_URL}/mentor/view-student/${username}`, {
          headers: { Authorization: mentorId }
        });
        const data = await res.json();

        if (data?.success && data?.data) {
          setStudentInfo(data.data);
        } else {
          setError(data?.msg || "Student not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [username]);

  if (loading) return <p className={styles.loading}>Loading student profile...</p>;

  if (error) return (
    <div className={styles.errorContainer}>
      <p><AlertCircle size={16} /> {error}</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  // Safe optional chaining
  const s = studentInfo || {};
  console.log("Profile Image:", s.profileImage);


  return (
    <div className={styles.container}>
      <MentorTopBar />
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImageContainer}>
            {s.profileImage ? (
              <img src={`${BASE_URL}/uploads/${s.profileImage}`} alt="Profile" className={styles.profileImage} />
            ) : (
              <UserCircle size={80} />
            )}
          </div>
          <div className={styles.profileInfo}>
            <h2>{s.name || "N/A"}</h2>
            <p>student ID: {s.username || "N/A"}</p>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoRow}><span>Email</span><span>{s.email || "N/A"}</span></div>
          <div className={styles.infoRow}><span>Phone</span><span>{s.phoneNumber || s.phno || "N/A"}</span></div>
          <div className={styles.infoRow}><span>College</span><span>{s.collegeName || "N/A"}</span></div>
          <div className={styles.infoRow}><span>Program</span><span>{s.program || "N/A"}</span></div>
          <div className={styles.infoRow}><span>Department</span><span>{s.department || "N/A"}</span></div>
          <div className={styles.infoRow}><span>Batch Year</span><span>{s.batchYear || "N/A"}</span></div>
          <div className={styles.infoRow}><span>Semester</span><span>{s.semester || "N/A"}</span></div>
          <div className={styles.infoRow}><span>Address</span><span>{s.address || "N/A"}</span></div>
          <div className={styles.infoRow}>
            <span>LinkedIn</span>
            <span>{s.linkedinId ? <a href={s.linkedinId} target="_blank" rel="noreferrer"><Linkedin size={16} /> View</a> : "N/A"}</span>
          </div>
          <div className={styles.infoRow}>
            <span>GitHub</span>
            <span>{s.githubId ? <a href={s.githubId} target="_blank" rel="noreferrer"><Github size={16} /> View</a> : "N/A"}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Other Profile</span>
            <span>{s.otherProfile ? <a href={s.otherProfile} target="_blank" rel="noreferrer"><Web size={16} /> View</a> : "N/A"}</span>
          </div>
        </div>

        {s.resumeImage && (
          <div className={styles.resumeSection}>
            <a href={`${BASE_URL}/uploads/${s.resumeImage}`} target="_blank" rel="noreferrer" className={styles.resumeBtn}>
              <FileType size={16} /> View Resume
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorViewStudentProfile;
