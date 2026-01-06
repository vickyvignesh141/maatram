import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Stu_Mentordetails.module.css";
import BASE_URL from "../../../baseurl";
import StudentTopBar from "../../nav/studenttop";

import {
  User,
  Briefcase,
  Building,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  Globe,
  Linkedin,
  Github,
  Award,
  BookOpen,
  ArrowLeft,
} from "lucide-react";

const StuMentorDetails = () => {
  const { mentor_username } = useParams();
  const navigate = useNavigate();

  const [mentorInfo, setMentorInfo] = useState({
    name: "Not Provided",
    username: "",
    email: "Not Provided",
    phoneNumber: "Not Provided",
    dateOfBirth: "Not Provided",
    collegeName: "Not Provided",
    workingCompany: "Not Provided",
    role: "Not Provided",
    companyAddress: "Not Provided",
    homeAddress: "Not Provided",
    yearOfPassedOut: "Not Provided",
    yearsOfExperience: "Not Provided",
    expertise: "Not Provided",
    linkedinId: "",
    githubId: "",
    portfolioLink: "",
    profileImage: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH MENTOR PROFILE =================
  const fetchMentorProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${BASE_URL}/mentor_profile/${mentor_username}`);
      const json = await response.json();

      if (!response.ok || !json.success) {
        setError(json.msg || "Mentor profile not found");
        return;
      }

      const data = json.data;

      setMentorInfo({
        name: data.name || "Not Provided",
        username: data.username || "",
        email: data.email || "Not Provided",
        phoneNumber: data.phoneNumber || "Not Provided",
        dateOfBirth: data.dateOfBirth || "Not Provided",
        collegeName: data.collegeName || "Not Provided",
        workingCompany: data.workingCompany || "Not Provided",
        role: data.role || "Not Provided",
        companyAddress: data.companyAddress || "Not Provided",
        homeAddress: data.homeAddress || "Not Provided",
        yearOfPassedOut: data.yearOfPassedOut || "Not Provided",
        yearsOfExperience: data.yearsOfExperience || "Not Provided",
        expertise: data.expertise || "Not Provided",
        linkedinId: data.linkedinId || "",
        githubId: data.githubId || "",
        portfolioLink: data.portfolioLink || "",
        profileImage: data.profileImage || "",
      });

      if (data.profileImage) {
        setImagePreview(`${BASE_URL}/uploads/${data.profileImage}`);
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mentor_username) fetchMentorProfile();
  }, [mentor_username]);

  // ================= UI STATES =================
  if (loading) return <div className={styles.loading}>Loading mentor profile...</div>;

  if (error)
    return (
  
      <div className={styles.errorBox}>
        <h2>Mentor profile not found</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );

  // ================= MAIN UI =================
  return (
    <div>
    <StudentTopBar/>
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className={styles.profileCard}>
        <div className={styles.left}>
          <img
            src={
              imagePreview ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt={mentorInfo.name || "Mentor"}
            className={styles.avatar}
          />
          <h2>{mentorInfo.name}</h2>
          <p className={styles.id}>{mentorInfo.username}</p>
        </div>

        <div className={styles.right}>
          <Info icon={<Mail />} label="Email" value={mentorInfo.email} />
          <Info icon={<Phone />} label="Phone" value={mentorInfo.phoneNumber} />
          <Info icon={<Calendar />} label="DOB" value={mentorInfo.dateOfBirth} />
          <Info icon={<GraduationCap />} label="College" value={mentorInfo.collegeName} />
          <Info icon={<Building />} label="Company" value={mentorInfo.workingCompany} />
          <Info icon={<Briefcase />} label="Role" value={mentorInfo.role} />
          <Info icon={<MapPin />} label="Company Address" value={mentorInfo.companyAddress} />
          <Info icon={<Home />} label="Home Address" value={mentorInfo.homeAddress} />
          <Info
            icon={<Award />}
            label="Experience"
            value={
              mentorInfo.yearsOfExperience && mentorInfo.yearsOfExperience !== "Not Provided"
                ? `${mentorInfo.yearsOfExperience} years`
                : "Not Provided"
            }
          />
          <Info icon={<BookOpen />} label="Expertise" value={mentorInfo.expertise} />

          <div className={styles.links}>
            {mentorInfo.linkedinId && (
              <a href={mentorInfo.linkedinId} target="_blank" rel="noreferrer">
                <Linkedin />
              </a>
            )}
            {mentorInfo.githubId && (
              <a href={mentorInfo.githubId} target="_blank" rel="noreferrer">
                <Github />
              </a>
            )}
            {mentorInfo.portfolioLink && (
              <a href={mentorInfo.portfolioLink} target="_blank" rel="noreferrer">
                <Globe />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

// ================= REUSABLE INFO COMPONENT =================
const Info = ({ icon, label, value }) => (
  <div className={styles.infoRow}>
    <span className={styles.icon}>{icon}</span>
    <div>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value || "Not Provided"}</p>
    </div>
  </div>
);

export default StuMentorDetails;
