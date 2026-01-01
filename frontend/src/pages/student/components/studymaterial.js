import { useState } from "react";
import "./Studymaterial.css";
import StudentTopBar from "../../nav/studenttop";


function StudyGuide() {
  const [subject, setSubject] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Clean ugly / spam titles
  const cleanTitle = (title) => {
    return title
      .replace(/\|.*$/g, "")
      .replace(/- YouTube.*$/gi, "")
      .replace(/Top 20.*$/gi, "")
      .replace(/\[.*?\]/g, "")
      .trim();
  };

  const fetchGuide = async () => {
    setError("");
    setData(null);

    if (!subject.trim()) {
      setError("Subject is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/study/guide?subject=${encodeURIComponent(subject)}`
      );

      if (!response.ok) {
        throw new Error("Failed request");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch study guide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StudentTopBar/>
  
    <div className="study-container">
      <h1 className="study-heading">📘 Study Guide Generator</h1>

      <div className="input-container">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject (e.g. Python, Java, React)"
        />
        <button onClick={fetchGuide}>Get Guide</button>
      </div>

      {loading && <p className="info-text">Loading study guide...</p>}
      {error && <p className="error-text">{error}</p>}

      {data && (
        <div className="results">
          <h2 className="section-heading">
            📚 Study Guide: {data.subject.toUpperCase()}
          </h2>

          {/* Certification Courses */}
          <section>
            <h3 className="sub-heading">🎓 Certification Courses</h3>

            {data.certification_courses.length === 0 && (
              <p>No certification courses found.</p>
            )}

            {data.certification_courses.map((course, index) => (
              <div key={index} className="card">
                <h4>{cleanTitle(course.title)}</h4>
                <a href={course.link} target="_blank" rel="noreferrer">
                  Visit Course →
                </a>
              </div>
            ))}
          </section>

          {/* YouTube Courses */}
          <section className="section-gap">
            <h3 className="sub-heading">📺 YouTube Full Courses</h3>

            {data.youtube_courses.length === 0 && (
              <p>No YouTube courses found.</p>
            )}

            {data.youtube_courses.map((video, index) => (
              <div key={index} className="card">
                <h4>{cleanTitle(video.title)}</h4>
                <a href={video.link} target="_blank" rel="noreferrer">
                  Watch on YouTube →
                </a>
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
    </div>
  );
}

export default StudyGuide;
