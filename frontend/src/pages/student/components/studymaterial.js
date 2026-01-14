import { useEffect, useState } from "react";
import styles from "./StudyMaterial.module.css";
import StudentTopBar from "../../nav/studenttop";
import { Search, X, BookOpen, Play, GraduationCap, Clock, Trash2, Loader2, ExternalLink } from "lucide-react";

const USERNAME = "MAA042626";

function StudyGuide() {
  const [subject, setSubject] = useState("");
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/study/saved-guides?username=${USERNAME}`
      );
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  // Fetch study guide
  const fetchGuide = async () => {
    if (!subject.trim()) {
      setError("Please enter a subject");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/study/guide?subject=${encodeURIComponent(subject)}&username=${USERNAME}`
      );

      if (response.ok) {
        const result = await response.json();
        setData(result);
        fetchHistory(); // Refresh history
      } else {
        setError("Failed to generate study guide");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete guide
  const deleteGuide = async (id, e) => {
    e.stopPropagation();
    
    try {
      await fetch(`http://localhost:5000/study/saved-guides/${id}?username=${USERNAME}`, {
        method: "DELETE"
      });

      setHistory(history.filter(item => item._id !== id));
      if (data?._id === id) {
        setData(null);
        setSubject("");
      }
    } catch (err) {
      console.error("Failed to delete guide:", err);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchGuide();
    }
  };

  // Filter history based on search
  const filteredHistory = history.filter(item =>
    item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <StudentTopBar />
      
      <div className={styles.mainContent}>
        {/* Sidebar with history */}
        <div className={styles.sidebar}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <h3>Previous Guides</h3>
          <div className={styles.historyList}>
            {filteredHistory.map((item) => (
              <div
                key={item._id}
                className={styles.historyItem}
                onClick={() => {
                  setData(item);
                  setSubject(item.subject);
                }}
              >
                <GraduationCap size={16} />
                <div>
                  <h4>{item.subject}</h4>
                  <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => deleteGuide(item._id, e)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className={styles.content}>
          <h1>Study Guide Generator</h1>
          
          {/* Search input */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter subject (e.g., Python, Machine Learning)"
              disabled={loading}
            />
            <button onClick={fetchGuide} disabled={loading || !subject.trim()}>
              {loading ? (
                <>
                  <Loader2 size={18} className={styles.spin} />
                  Generating...
                </>
              ) : (
                "Generate Guide"
              )}
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {loading ? (
            <div className={styles.loading}>
              <Loader2 size={32} className={styles.spin} />
              <p>Creating your study guide...</p>
            </div>
          ) : data ? (
            <div className={styles.guide}>
              <h2>{data.subject}</h2>
              
              <div className={styles.section}>
                <h3>Certification Courses</h3>
                <div className={styles.courses}>
                  {data.certification_courses.map((course, index) => (
                    <a
                      key={index}
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.courseCard}
                    >
                      <GraduationCap size={20} />
                      <div>
                        <h4>{course.title.replace(/\|.*$/g, "").trim()}</h4>
                        <p>Certification Course</p>
                      </div>
                      <ExternalLink size={16} />
                    </a>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <h3>Video Tutorials</h3>
                <div className={styles.courses}>
                  {data.youtube_courses.map((video, index) => (
                    <a
                      key={index}
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.courseCard}
                    >
                      <Play size={20} />
                      <div>
                        <h4>{video.title.replace(/\|.*$/g, "").trim()}</h4>
                        <p>Video Tutorial</p>
                      </div>
                      <ExternalLink size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.empty}>
              <BookOpen size={48} />
              <p>Enter a subject to generate a study guide</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudyGuide;