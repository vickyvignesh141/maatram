import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MentorTopBar from "../../mentornav/mentortop";
import BASE_URL from "../../../baseurl";

export default function StudentProgress() {
  // Get username from route params
  const { username } = useParams();


  // State for career data, loading, and errors
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchStudentCareer = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/mentor/student/${username}/career`
        );

        // Check if response has data
        if (res.data?.success) {
          setCareer(res.data.career_data);
        } else {
          setError(res.data?.message || "No career data found");
        }
      } catch (err) {
        console.error("Error fetching career data:", err);
        //setError("Failed to fetch student career");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCareer();
  }, [username]);

  // Container styles - UPDATED FOR FULL SCREEN
  const containerStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    width: "100%",
    margin: "0",
    padding: "0",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh"
  };

  // Content wrapper - NEW: to add padding while keeping full width
  const contentWrapperStyle = {
    padding: "20px 30px",
    maxWidth: "1400px",
    margin: "0 auto"
  };

  // Header styles
  const headerStyle = {
    color: "#2c3e50",
    marginBottom: "10px",
    borderBottom: "2px solid #3498db",
    paddingBottom: "10px"
  };

  const subHeaderStyle = {
    color: "#7f8c8d",
    marginBottom: "30px",
    fontWeight: "normal"
  };

  // Section styles - UPDATED FOR BETTER FULL SCREEN LAYOUT
  const sectionStyle = {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "30px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderLeft: "4px solid #3498db"
  };

  const sectionTitleStyle = {
    color: "#2c3e50",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "1.5em"
  };

  const sectionTitleIcon = {
    color: "#3498db",
    fontSize: "1.2em"
  };

  // Career option card styles - UPDATED FOR FULL WIDTH
  const careerCardStyle = {
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "15px",
    transition: "all 0.3s ease",
    width: "100%"
  };

  const careerCardHoverStyle = {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    borderColor: "#3498db"
  };

  const careerTitleStyle = {
    color: "#2c3e50",
    fontSize: "1.1em",
    marginBottom: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const matchScoreStyle = (score) => ({
    backgroundColor: score >= 80 ? "#2ecc71" : score >= 60 ? "#f39c12" : "#e74c3c",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.9em",
    fontWeight: "bold"
  });

  const careerDescriptionStyle = {
    color: "#555",
    lineHeight: "1.6",
    fontSize: "0.95em"
  };

  // Selected career info styles - UPDATED FOR FULL WIDTH
  const infoGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
    marginTop: "15px"
  };

  const infoCardStyle = {
    backgroundColor: "#f1f8ff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #d1e7ff",
    height: "100%"
  };

  const infoLabelStyle = {
    fontSize: "0.9em",
    color: "#7f8c8d",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const infoValueStyle = {
    fontSize: "1.2em",
    color: "#2c3e50",
    fontWeight: "bold",
    marginTop: "5px"
  };

  // Status indicator styles
  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: "6px 16px",
      borderRadius: "20px",
      fontSize: "0.9em",
      fontWeight: "bold",
      display: "inline-block",
      marginTop: "8px"
    };

    switch (status?.toLowerCase()) {
      case 'completed':
        return { ...baseStyle, backgroundColor: "#2ecc71", color: "white" };
      case 'in progress':
        return { ...baseStyle, backgroundColor: "#3498db", color: "white" };
      case 'not started':
        return { ...baseStyle, backgroundColor: "#e74c3c", color: "white" };
      default:
        return { ...baseStyle, backgroundColor: "#95a5a6", color: "white" };
    }
  };

  // Loading and error styles - UPDATED FOR FULL SCREEN
  const loadingStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 100px)",
    fontSize: "1.2em",
    color: "#3498db",
    width: "100%"
  };

  const errorStyle = {
    color: "#e74c3c",
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    marginTop: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%"
  };

  // Loading or error states - UPDATED FOR FULL SCREEN
  if (loading) return (
    <div style={{ ...containerStyle, display: "flex", flexDirection: "column" }}>
      <MentorTopBar />
      <div style={loadingStyle}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <p style={{ fontSize: "1.2em" }}>Loading student career data...</p>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        body { margin: 0; padding: 0; }
        html { margin: 0; padding: 0; }
      `}</style>
    </div>
  );
  
  if (error) return (
    <div style={{ ...containerStyle, display: "flex", flexDirection: "column" }}>
      <MentorTopBar />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 100px)" }}>
        <div style={errorStyle}>
          <div style={{ fontSize: "4em", marginBottom: "20px" }}>⚠️</div>
          <h3 style={{ color: "#c0392b", fontSize: "1.5em" }}>Student Didnot Choose Career</h3>
          <p style={{ fontSize: "1.1em", marginTop: "10px" }}>{error}</p>
        </div>
      </div>
    </div>
  );

  // Render career data - UPDATED FOR FULL SCREEN
  return (
    <div style={{ ...containerStyle, display: "flex", flexDirection: "column" }}>
      <MentorTopBar />
      
      <div style={contentWrapperStyle}>
        <h1 style={headerStyle}>Student Career Profile</h1>
        <h3 style={subHeaderStyle}>Student ID: <span style={{ color: "#3498db", fontWeight: "bold" }}>{username}</span></h3>

        {career ? (
          <>
            {/* Career Recommendations */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>
                <span style={sectionTitleIcon}>📊</span>
                Career Recommendations
              </h2>
              {career.initial_assessment?.recommendations?.career_options?.map((option, i) => (
                <div 
                  key={i} 
                  style={careerCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = careerCardHoverStyle.transform;
                    e.currentTarget.style.boxShadow = careerCardHoverStyle.boxShadow;
                    e.currentTarget.style.borderColor = careerCardHoverStyle.borderColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = careerCardStyle.boxShadow;
                    e.currentTarget.style.borderColor = careerCardStyle.borderColor;
                  }}
                >
                  <div style={careerTitleStyle}>
                    <span style={{ fontSize: "1.2em", fontWeight: "600" }}>{option.name}</span>
                    <span style={matchScoreStyle(option.match_score)}>{option.match_score}% Match</span>
                  </div>
                  <p style={careerDescriptionStyle}>{option.description}</p>
                </div>
              ))}
            </div>

            {/* Selected Career */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>
                <span style={sectionTitleIcon}>🎯</span>
                Selected Career Path
              </h2>
              <div style={infoGridStyle}>
                <div style={infoCardStyle}>
                  <div style={infoLabelStyle}>Career</div>
                  <div style={infoValueStyle}>{career.selected_career?.career || "Not specified"}</div>
                </div>
                
                <div style={infoCardStyle}>
                  <div style={infoLabelStyle}>Status</div>
                  <div style={getStatusStyle(career.selected_career?.study_plan?.status)}>
                    {career.selected_career?.study_plan?.status || "Unknown"}
                  </div>
                </div>
                
                <div style={infoCardStyle}>
                  <div style={infoLabelStyle}>Estimated Completion</div>
                  <div style={infoValueStyle}>
                    {career.selected_career?.study_plan?.estimated_completion || "Not specified"}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ ...errorStyle, margin: "50px auto", maxWidth: "600px" }}>
            <div style={{ fontSize: "4em", marginBottom: "20px" }}>📭</div>
            <h3 style={{ color: "#7f8c8d", fontSize: "1.5em" }}>No Data Available</h3>
            <p style={{ fontSize: "1.1em", marginTop: "10px" }}>No career data found for this student</p>
          </div>
        )}
      </div>
    </div>
  );
}