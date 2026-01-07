import React, { useState, useEffect } from "react";
import baseurl from "../../../baseurl";
import StudentTopBar from "../../nav/studenttop";
import "./StudentCareer.css";

import {
  Target,
  Brain,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Users,
  Calendar,
  Award,
  ChevronRight,
  CheckCircle,
  Star,
  Zap,
  Compass,
  Clock,
  FileText,
  PlayCircle,
  BarChart3,
  Download,
  RefreshCw,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function StudentCareer() {
  const [step, setStep] = useState(1); // 1: Questions, 2: Recommendations, 3: Study Plan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [recommendations, setRecommendations] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [progress, setProgress] = useState({});
  
  const studentId = localStorage.getItem("loggedUser");

  // Fetch career questions on mount
  useEffect(() => {
    fetchQuestions();
    loadProgress();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${baseurl}/career/questions`);
      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
        // Initialize responses
        const initialResponses = {};
        data.questions.forEach(q => {
          initialResponses[q] = "";
        });
        setResponses(initialResponses);
      }
    } catch (err) {
      setError("Failed to load questions");
    }
  };

  const loadProgress = async () => {
    try {
      const response = await fetch(`${baseurl}/career/progress/${studentId}`);
      const data = await response.json();
      if (data.success && data.data) {
        setProgress(data.data);
        // If student already has assessment, skip to recommendations
        if (data.data.initial_assessment) {
          setRecommendations(data.data.initial_assessment.recommendations);
          setStep(2);
        }
        if (data.data.selected_career) {
          setSelectedCareer(data.data.selected_career.career);
          setStudyPlan(data.data.selected_career.study_plan);
          setStep(3);
        }
      }
    } catch (err) {
      console.log("No previous progress found");
    }
  };

  const handleResponseChange = (question, value) => {
    setResponses(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const submitAssessment = async () => {
    // Validate all responses
    const emptyResponses = Object.entries(responses).filter(([_, value]) => !value.trim());
    if (emptyResponses.length > 0) {
      setError("Please answer all questions before proceeding");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        student_id: studentId,
        responses: responses
      };

      const response = await fetch(`${baseurl}/career/assess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.data);
        setStep(2);
      } else {
        setError(data.message || "Failed to process assessment");
      }
    } catch (err) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const selectCareer = async (career) => {
    setSelectedCareer(career);
    
    // Show topic selection modal or move to next step
    // For now, move directly to step 3
    setStep(3);
    
    // Generate study plan
    generateStudyPlan(career);
  };

  const generateStudyPlan = async (career) => {
    setLoading(true);
    
    try {
      const payload = {
        student_id: studentId,
        career: career,
        known_topics: [], // Could be collected from user
        daily_hours: 2,
        weekly_hours: 10
      };

      const response = await fetch(`${baseurl}/career/select-career`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setStudyPlan(data.data.study_plan);
      } else {
        setError(data.message || "Failed to generate study plan");
      }
    } catch (err) {
      setError("Unable to generate study plan");
    } finally {
      setLoading(false);
    }
  };

  const updateTopicProgress = async (topic, percentage) => {
    try {
      const payload = {
        student_id: studentId,
        topic: topic,
        percentage: percentage
      };

      const response = await fetch(`${baseurl}/career/update-progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local progress state
        setProgress(prev => ({
          ...prev,
          topic_progress: {
            ...prev.topic_progress,
            [topic]: {
              percentage,
              last_updated: new Date().toISOString()
            }
          }
        }));
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const resetAssessment = async () => {
    try {
      const response = await fetch(`${baseurl}/career/reset/${studentId}`, {
        method: "POST"
      });

      const data = await response.json();
      
      if (data.success) {
        setStep(1);
        setRecommendations(null);
        setSelectedCareer(null);
        setStudyPlan(null);
        setProgress({});
        
        // Reset responses
        const initialResponses = {};
        questions.forEach(q => {
          initialResponses[q] = "";
        });
        setResponses(initialResponses);
      }
    } catch (err) {
      console.error("Failed to reset:", err);
    }
  };

  // Step 1: Questions Form
  const renderQuestionsStep = () => (
    <div className="career-step">
      <div className="step-header">
        <div className="step-indicator">
          <span className="step-number active">1</span>
          <span className="step-label">Career Assessment</span>
        </div>
        <div className="step-indicator">
          <span className="step-number">2</span>
          <span className="step-label">Recommendations</span>
        </div>
        <div className="step-indicator">
          <span className="step-number">3</span>
          <span className="step-label">Study Plan</span>
        </div>
      </div>

      <div className="assessment-card">
        <div className="assessment-header">
          <Sparkles size={28} />
          <div>
            <h2>Career Discovery Assessment</h2>
            <p>Answer these 7 questions to get personalized career recommendations</p>
          </div>
        </div>

        <div className="questions-container">
          {questions.map((question, index) => (
            <div key={index} className="question-card">
              <div className="question-number">Q{index + 1}</div>
              <div className="question-content">
                <label className="question-text">{question}</label>
                <textarea
                  className="response-input"
                  placeholder="Type your answer here..."
                  value={responses[question] || ""}
                  onChange={(e) => handleResponseChange(question, e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="action-buttons">
          <button
            className="primary-btn"
            onClick={submitAssessment}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="spinner" />
                Analyzing Responses...
              </>
            ) : (
              <>
                Get Career Recommendations
                <ArrowRight size={20} />
              </>
            )}
          </button>
          
          {progress.initial_assessment && (
            <button
              className="secondary-btn"
              onClick={() => {
                setRecommendations(progress.initial_assessment.recommendations);
                setStep(2);
              }}
            >
              View Previous Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Step 2: Career Recommendations
  const renderRecommendationsStep = () => (
    <div className="career-step">
      <div className="step-header">
        <div className="step-indicator">
          <span className="step-number completed">✓</span>
          <span className="step-label">Assessment</span>
        </div>
        <div className="step-indicator">
          <span className="step-number active">2</span>
          <span className="step-label">Recommendations</span>
        </div>
        <div className="step-indicator">
          <span className="step-number">3</span>
          <span className="step-label">Study Plan</span>
        </div>
      </div>

      <div className="recommendations-section">
        <div className="section-header">
          <div>
            <h2>Your Career Recommendations</h2>
            <p>Based on your interests and skills</p>
          </div>
          <button className="icon-btn" onClick={resetAssessment}>
            <RefreshCw size={20} />
            Retake Assessment
          </button>
        </div>

        {recommendations?.career_options && (
          <>
            {/* Top Recommendation */}
            {recommendations.top_recommendation && (
              <div className="top-recommendation-card">
                <div className="top-recommendation-badge">
                  <Star size={24} />
                  <span>Top Recommendation</span>
                </div>
                <h3>{recommendations.top_recommendation.career}</h3>
                <p className="reasoning">{recommendations.top_recommendation.reasoning}</p>
                
                <div className="short-term-plan">
                  <h4>6-12 Month Starter Plan:</h4>
                  <p>{recommendations.top_recommendation.short_term_plan}</p>
                </div>

                <button
                  className="primary-btn select-career-btn"
                  onClick={() => selectCareer(recommendations.top_recommendation.career)}
                >
                  Choose This Career Path
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* All Career Options */}
            <div className="career-options-grid">
              <h3>Other Suitable Career Paths</h3>
              <div className="options-grid">
                {recommendations.career_options.map((career, index) => (
                  <div key={index} className="career-option-card">
                    <div className="career-header">
                      <div className="match-badge">
                        {career.match_score}% Match
                      </div>
                      <Target size={24} className="career-icon" />
                    </div>
                    <h4>{career.name}</h4>
                    <p className="career-description">{career.description}</p>
                    
                    <div className="career-stats">
                      <div className="stat">
                        <TrendingUp size={16} />
                        <span>High Demand</span>
                      </div>
                      <div className="stat">
                        <BookOpen size={16} />
                        <span>Learn & Grow</span>
                      </div>
                    </div>

                    <button
                      className="secondary-btn"
                      onClick={() => selectCareer(career.name)}
                    >
                      Explore This Path
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Step 3: Study Plan
  const renderStudyPlanStep = () => (
    <div className="career-step">
      <div className="step-header">
        <div className="step-indicator">
          <span className="step-number completed">✓</span>
          <span className="step-label">Assessment</span>
        </div>
        <div className="step-indicator">
          <span className="step-number completed">✓</span>
          <span className="step-label">Recommendations</span>
        </div>
        <div className="step-indicator">
          <span className="step-number active">3</span>
          <span className="step-label">Study Plan</span>
        </div>
      </div>

      {studyPlan && (
        <div className="study-plan-section">
          <div className="plan-header">
            <div>
              <h2>Your Personalized Study Plan</h2>
              <p>For {selectedCareer} • {studyPlan.status === 'beginner' ? 'Beginner Path' : 'Advanced Path'}</p>
            </div>
            <div className="header-actions">
              {/* <button className="icon-btn">
                <Download size={20} />
                Export Plan
              </button> */}
              <button className="icon-btn" onClick={() => setStep(2)}>
                <ArrowRight size={20} />
                Change Career
              </button>
            </div>
          </div>

          {studyPlan.status === 'beginner' ? (
            <>
              {/* Missing Topics */}
              <div className="topics-section">
                <h3><BookOpen size={24} /> Topics to Learn</h3>
                <div className="topics-grid">
                  {studyPlan.missing_topics?.map((topic, index) => {
                    const topicProgress = progress.topic_progress?.[topic]?.percentage || 0;
                    return (
                      <div key={index} className="topic-card">
                        <div className="topic-header">
                          <h4>{topic}</h4>
                          <span className="progress-badge">{topicProgress}%</span>
                        </div>
                        <p>Focus: {studyPlan.daily_schedule?.[topic]?.focus_areas || 'Fundamentals & Practice'}</p>
                        
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${topicProgress}%` }}
                          ></div>
                        </div>
                        
                        <div className="topic-actions">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={topicProgress}
                            onChange={(e) => updateTopicProgress(topic, parseInt(e.target.value))}
                            className="progress-slider"
                          />
                          {/* <button className="small-btn">
                            <PlayCircle size={16} />
                            Resources
                          </button> */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Schedule */}
              <div className="schedule-section">
                <h3><Clock size={24} /> Daily Study Schedule</h3>
                <div className="schedule-card">
                  <div className="schedule-header">
                    <span>Total Daily Hours: {studyPlan.daily_schedule ? 
                      Object.values(studyPlan.daily_schedule)[0]?.hours_per_day : 2}</span>
                  </div>
                  <div className="schedule-grid">
                    {studyPlan.missing_topics?.map((topic, index) => (
                      <div key={index} className="schedule-item">
                        <div className="time-slot">
                          <Clock size={16} />
                          <span>{studyPlan.daily_schedule?.[topic]?.hours_per_day || 0.5}h</span>
                        </div>
                        <div className="schedule-topic">
                          <h5>{topic}</h5>
                          <p>Daily study session</p>
                        </div>
                        <div className="schedule-actions">
                          <button className="icon-btn small">
                            <FileText size={16} />
                          </button>
                          <button className="icon-btn small">
                            <PlayCircle size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="recommendations-card">
                <h3><Sparkles size={24} /> Learning Recommendations</h3>
                <ul className="recommendations-list">
                  {studyPlan.recommendations?.map((rec, index) => (
                    <li key={index}>
                      <CheckCircle size={18} />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="advanced-plan-card">
              <div className="advanced-badge">
                <Award size={32} />
                <span>Advanced Learner Path</span>
              </div>
              <h3>You're Ready for Advanced Learning!</h3>
              <p>Since you already know the foundational topics, here's what you can focus on next:</p>
              
              <div className="advanced-suggestions">
                <div className="suggestion">
                  <Target size={20} />
                  <div>
                    <h4>Specialized Projects</h4>
                    <p>Build real-world applications in your chosen field</p>
                  </div>
                </div>
                <div className="suggestion">
                  <Users size={20} />
                  <div>
                    <h4>Industry Networking</h4>
                    <p>Connect with professionals and join communities</p>
                  </div>
                </div>
                <div className="suggestion">
                  <TrendingUp size={20} />
                  <div>
                    <h4>Advanced Certifications</h4>
                    <p>Pursue specialized certifications in your field</p>
                  </div>
                </div>
              </div>

              <button className="primary-btn">
                Get Advanced Learning Path
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Progress Overview */}
          {progress.topic_progress && Object.keys(progress.topic_progress).length > 0 && (
            <div className="progress-overview">
              <h3><BarChart3 size={24} /> Learning Progress</h3>
              <div className="progress-chart">
                {Object.entries(progress.topic_progress).map(([topic, data]) => (
                  <div key={topic} className="chart-item">
                    <div className="chart-bar">
                      <div 
                        className="chart-fill"
                        style={{ height: `${data.percentage}%` }}
                      ></div>
                    </div>
                    <span className="chart-label">{topic}</span>
                    <span className="chart-value">{data.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="student-career">
      <StudentTopBar />
      
      <div className="container">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="banner-content">
            <Target size={40} />
            <div>
              <h1>Career Command</h1>
              <p>AI-powered career guidance and personalized learning paths</p>
            </div>
          </div>
          <div className="banner-actions">
            <button className="help-btn">
              <HelpCircle size={20} />
              Need Help?
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="career-content">
          {step === 1 && renderQuestionsStep()}
          {step === 2 && renderRecommendationsStep()}
          {step === 3 && renderStudyPlanStep()}
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <Compass size={24} />
            <div>
              <h4>Career Paths</h4>
              <p>{recommendations?.career_options?.length || 0} Options</p>
            </div>
          </div>
          <div className="stat-card">
            <BookOpen size={24} />
            <div>
              <h4>Topics</h4>
              <p>{studyPlan?.missing_topics?.length || studyPlan?.topics?.length || 0} to Learn</p>
            </div>
          </div>
          <div className="stat-card">
            <Clock size={24} />
            <div>
              <h4>Time Commitment</h4>
              <p>{studyPlan?.total_weekly_hours || 10} hrs/week</p>
            </div>
          </div>
          <div className="stat-card">
            <TrendingUp size={24} />
            <div>
              <h4>Progress</h4>
              <p>
                {progress.topic_progress ? 
                  Math.round(Object.values(progress.topic_progress).reduce((a, b) => a + b.percentage, 0) / 
                  Object.keys(progress.topic_progress).length) || 0 : 0}% Overall
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}