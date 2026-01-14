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
  User,
  GraduationCap,
  ChevronRight,
  BookOpen,
  BarChart3
} from "lucide-react";
import styles from "./StudentCertificate.module.css";

export default function MentorStudentWallet() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("certificates");

  /* ================= CERTIFICATES ================= */
  const [certificates, setCertificates] = useState([]);
  const [loadingCert, setLoadingCert] = useState(true);
  const [errorCert, setErrorCert] = useState("");

  /* ================= ACADEMICS ================= */
  const [semesters, setSemesters] = useState([]);
  const [expandedSemester, setExpandedSemester] = useState(null);
  const [loadingAcad, setLoadingAcad] = useState(true);
  const [errorAcad, setErrorAcad] = useState("");

  /* ================= FETCH CERTIFICATES ================= */
  useEffect(() => {
    if (!username) return;

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
        setErrorCert("Failed to load certificates");
      } finally {
        setLoadingCert(false);
      }
    };

    fetchCertificates();
  }, [username]);

  /* ================= FETCH ACADEMICS ================= */
  useEffect(() => {
    if (!username) return;

    const fetchAcademics = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/mentor/student/${username}/academics`
        );
        setSemesters(res.data.academics?.semesters || []);
      } catch (err) {
        setErrorAcad("Failed to load academic records");
      } finally {
        setLoadingAcad(false);
      }
    };

    fetchAcademics();
  }, [username]);

  /* ================= CERTIFICATES TAB ================= */
  const renderCertificates = () => (
    <>
      {loadingCert && (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loadingSpinner} />
          <p>Loading certificates...</p>
        </div>
      )}

      {errorCert && (
        <div className={styles.errorMessage}>
          <AlertCircle />
          <p>{errorCert}</p>
        </div>
      )}

      {!loadingCert && certificates.length === 0 && (
        <div className={styles.noData}>
          <FileText />
          <h3>No Certificates Found</h3>
        </div>
      )}

      <div className={styles.certificatesGrid}>
        {certificates.map((cert, index) => (
          <div key={cert.id || index} className={styles.certificateCard}>
            <div className={styles.certificateHeader}>
              <Trophy />
              <h3>{cert.name}</h3>
            </div>

            <div className={styles.certificateDetails}>
              <div className={styles.detailItem}>
                <Calendar />
                {cert.uploaded_at
                  ? new Date(cert.uploaded_at).toLocaleDateString()
                  : "—"}
              </div>

              {cert.issuer && (
                <div className={styles.detailItem}>
                  <Building />
                  {cert.issuer}
                </div>
              )}
            </div>

            <div className={styles.certificateActions}>
              <a
                href={`${BASE_URL}/mentor/student/${username}/certificates/view/${cert.file}`}
                target="_blank"
                rel="noreferrer"
                className={`${styles.actionButton} ${styles.viewButton}`}
              >
                <Eye /> View
              </a>

              <a
                href={`${BASE_URL}/mentor/student/${username}/certificates/download/${cert.file}`}
                className={`${styles.actionButton} ${styles.downloadButton}`}
                download
              >
                <Download /> Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  /* ================= ACADEMICS TAB ================= */
  const renderAcademics = () => (
    <>
      {loadingAcad && (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loadingSpinner} />
          <p>Loading academic records...</p>
        </div>
      )}

      {errorAcad && (
        <div className={styles.errorMessage}>
          <AlertCircle />
          <p>{errorAcad}</p>
        </div>
      )}

      {!loadingAcad && semesters.length > 0 && (
        <div className={styles.downloadAcademics}>
          <a
            href={`${BASE_URL}/mentor/student/${username}/academics/download`}
            className={`${styles.actionButton} ${styles.downloadButton}`}
            download
          >
            <Download /> Download All as CSV
          </a>
        </div>
      )}

      {semesters.map((sem) => (
        <div key={sem.id} className={styles.semesterCard}>
          <div
            className={styles.semesterHeader}
            onClick={() =>
              setExpandedSemester(
                expandedSemester === sem.id ? null : sem.id
              )
            }
          >
            <h3>
              <ChevronRight
                className={expandedSemester === sem.id ? styles.expanded : ""}
              />
              {sem.name || `Semester ${sem.semester}`}
            </h3>
            <BarChart3 />
          </div>

          {expandedSemester === sem.id && (
            <div className={styles.internalsSection}>
              {sem.internals?.map((int) => (
                <div key={int.id} className={styles.internalCard}>
                  <h4>
                    <BookOpen /> {int.name}
                  </h4>

                  <table className={styles.subjectsTable}>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {int.subjects?.map((sub) => (
                        <tr key={sub.id}>
                          <td>{sub.name}</td>
                          <td>{sub.marks ?? 0} / 100</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {semesters.length === 0 && !loadingAcad && (
        <div className={styles.noData}>
          <GraduationCap />
          <h3>No Academic Records</h3>
        </div>
      )}
    </>
  );

  /* ================= MAIN ================= */
  return (
    <div className={styles.container}>
      <MentorTopBar />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>
            <User /> Student Wallet
          </h1>
          <span>Student ID: {username}</span>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === "certificates" ? styles.active : ""}`}
            onClick={() => setActiveTab("certificates")}
          >
            <FileText /> Certificates
          </button>

          <button
            className={`${styles.tabButton} ${activeTab === "academics" ? styles.active : ""}`}
            onClick={() => setActiveTab("academics")}
          >
            <GraduationCap /> Academics
          </button>
        </div>

        {/* Content */}
        {activeTab === "certificates" ? renderCertificates() : renderAcademics()}
      </div>
    </div>
  );
}