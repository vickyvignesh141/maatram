import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import baseurl from "../../../baseurl";
import StudentTopBar from "../../nav/studenttop";
import "./SubjectSkillTest.css";

import {
  BookOpen,
  Clock,
  Award,
  BarChart3,
  History,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  Home,
  Zap
} from "lucide-react";

// Constants moved outside component for better organization
const QUIZ_LEVELS = [
  { value: "Beginner", label: "Beginner", questions: 10, time: 1800, color: "var(--success)" },
  { value: "Intermediate", label: "Intermediate", questions: 10, time: 2700, color: "var(--warning)" },
  { value: "Hard", label: "Hard", questions: 10, time: 3600, color: "var(--error)" }
];

const PREDEFINED_TOPICS = [
  "Profit & Loss",
  "Number System",
  "Simple Interest",
  "Algebra",
  "Physics - Mechanics",
  "Chemistry - Periodic Table",
  "Boat & Stream",
  "Ages"
];

// Custom hook for timer logic
const useQuizTimer = (initialTime, isActive, onTimeUp) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, onTimeUp]);

  const resetTimer = useCallback((newTime) => {
    setRemainingTime(newTime);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return { remainingTime, formatTime, resetTimer };
};

// Custom hook for security features
const useQuizSecurity = (isActive, onDisqualify) => {
  const [securityWarning, setSecurityWarning] = useState("");
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      // Block refresh and developer tools
      if (e.key === "F5" || e.key === "F12" || 
          (e.ctrlKey && e.key === "r") || 
          (e.ctrlKey && e.shiftKey && e.key === "r")) {
        e.preventDefault();
        setSecurityWarning("⚠️ Refresh/DevTools disabled during quiz");
      }
      
      // Block copy/paste
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setSecurityWarning("⚠️ Copy/Paste disabled during quiz");
      }
      
      // Block print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setSecurityWarning("⚠️ Print disabled during quiz");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        
        if (newCount >= 3) {
          onDisqualify("Excessive tab switching detected (3+ times)");
        } else {
          setSecurityWarning(`⚠️ Warning: Tab switch detected (${newCount}/3)`);
        }
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      setSecurityWarning("⚠️ Right-click disabled during quiz");
      return false;
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "You have an active quiz in progress. Leaving will submit your quiz.";
      return e.returnValue;
    };

    // Prevent drag and drop
    const handleDragStart = (e) => e.preventDefault();
    const handleDrop = (e) => e.preventDefault();

    // Apply event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("drop", handleDrop);
    document.body.classList.add("quiz-active");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("drop", handleDrop);
      document.body.classList.remove("quiz-active");
    };
  }, [isActive, tabSwitchCount, onDisqualify]);

  return { securityWarning, setSecurityWarning, tabSwitchCount };
};

export default function StudentQuiz() {
  const studentId = localStorage.getItem("loggedUser");
  
  // Quiz state
  const [quizMode, setQuizMode] = useState("subject"); // "subject" or "topic"
  const [quizSubject, setQuizSubject] = useState("");
  const [quizTopic, setQuizTopic] = useState("");
  const [quizLevel, setQuizLevel] = useState("Beginner");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizStep, setQuizStep] = useState(1); // 1: Setup, 2: Test, 3: Results
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const quizContainerRef = useRef(null);

  // Get current level configuration
  const currentLevelConfig = useMemo(() => 
    QUIZ_LEVELS.find(l => l.value === quizLevel) || QUIZ_LEVELS[0],
    [quizLevel]
  );

  // Timer hook
  const handleTimeUp = useCallback(() => {
    submitQuiz("Time's up");
  }, []);

  const { remainingTime, formatTime, resetTimer } = useQuizTimer(
    currentLevelConfig.time,
    quizStep === 2,
    handleTimeUp
  );

  // Security hook
  const handleDisqualify = useCallback((reason) => {
    if (window.confirm(`${reason}. Submit quiz now?`)) {
      submitQuiz(reason);
    }
  }, []);

  const { securityWarning, setSecurityWarning } = useQuizSecurity(
    quizStep === 2,
    handleDisqualify
  );

  /* ================= QUIZ HISTORY ================= */
  useEffect(() => {
    if (!studentId) return;

    const fetchQuizHistory = async () => {
      try {
        const response = await fetch(`${baseurl}/subject-test/history/${studentId}`);
        const data = await response.json();
        if (data.success) setQuizHistory(data.history || []);
      } catch (error) {
        console.error("Failed to fetch quiz history:", error);
      }
    };

    fetchQuizHistory();
  }, [studentId, quizStep]);

  /* ================= FULLSCREEN HANDLING ================= */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  /* ================= QUIZ ACTIONS ================= */
  const startQuiz = async () => {
    let subjectToSend = quizMode === "subject" ? quizSubject.trim() : quizTopic;
    
    if (!subjectToSend) {
      setSecurityWarning("Please select a subject or topic");
      return;
    }

    if (quizMode === "subject" && subjectToSend.length < 2) {
      setSecurityWarning("Please enter a valid subject name");
      return;
    }

    setIsLoading(true);
    setSecurityWarning("");

    try {
      const response = await fetch(`${baseurl}/subject-test/mcq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject: subjectToSend, 
          level: quizLevel,
          mode: quizMode 
        })
      });

      const data = await response.json();
      
      if (data.success && data.mcqs?.length > 0) {
        setQuizQuestions(data.mcqs);
        setQuizAnswers({});
        setQuizStep(2);
        resetTimer(currentLevelConfig.time);

        // Enter fullscreen
        try {
          const elem = quizContainerRef.current || document.documentElement;
          if (elem.requestFullscreen) {
            await elem.requestFullscreen();
          }
        } catch (error) {
          console.warn("Fullscreen not supported:", error);
        }
      } else {
        setSecurityWarning(data.message || "No questions available for this topic");
      }
    } catch (error) {
      console.error("Quiz start error:", error);
      setSecurityWarning("Unable to connect to quiz server");
    } finally {
      setIsLoading(false);
    }
  };

  const submitQuiz = async (disqualifyReason = "") => {
    const isDisqualified = !!disqualifyReason;
    
    try {
      const response = await fetch(`${baseurl}/subject-test/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          subject: quizMode === "subject" ? quizSubject : quizTopic,
          level: quizLevel,
          mode: quizMode,
          mcqs: quizQuestions,
          answers: quizAnswers,
          time_spent: currentLevelConfig.time - remainingTime,
          disqualified: isDisqualified,
          disqualification_reason: disqualifyReason,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQuizResult({
          ...data,
          disqualified: isDisqualified,
          disqualificationReason: disqualifyReason
        });
        setQuizStep(3);
        
        // Exit fullscreen
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        
        // Refresh history if not disqualified
        if (!isDisqualified) {
          const historyResponse = await fetch(`${baseurl}/subject-test/history/${studentId}`);
          const historyData = await historyResponse.json();
          if (historyData.success) setQuizHistory(historyData.history || []);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSecurityWarning("Failed to submit quiz results");
    }
  };

  const resetQuiz = () => {
    setQuizSubject("");
    setQuizTopic("");
    setQuizLevel("Beginner");
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizResult(null);
    setQuizStep(1);
    setSecurityWarning("");
    setIsFullscreen(false);
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const optionLetter = String.fromCharCode(65 + optionIndex);
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: optionLetter
    }));
  };

  const calculateScore = () => {
    if (!quizQuestions.length) return { score: 0, percentage: 0 };
    
    let correctCount = 0;
    quizQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correctCount++;
      }
    });
    
    const percentage = Math.round((correctCount / quizQuestions.length) * 100);
    return { score: correctCount, percentage };
  };

  /* ================= RENDER FUNCTIONS ================= */
  const renderQuizSetup = () => (
    <div className="quiz-setup">
      <div className="quiz-setup-header">
        <BookOpen size={32} />
        <div>
          <h1 className="quiz-title">Subject Skill Assessment</h1>
          <p className="quiz-subtitle">Test your knowledge and track progress</p>
        </div>
      </div>

      <div className="quiz-setup-card">
        <div className="quiz-input-group">
          <label className="quiz-label">
            <BookOpen size={18} /> Select Quiz Mode
          </label>
          
          <div className="quiz-mode-buttons">
            <button 
              className={`quiz-mode-btn ${quizMode === "subject" ? 'active' : ''}`}
              onClick={() => setQuizMode("subject")}
            >
              By Subject
            </button>
            
            <button 
              className={`quiz-mode-btn ${quizMode === "topic" ? 'active' : ''}`}
              onClick={() => setQuizMode("topic")}
            >
              By Topic(Q/A)
            </button>
          </div>
        </div>

        {quizMode === "subject" && (
          <div className="quiz-input-group">
            <label className="quiz-label">
              <BookOpen size={18} /> Subject
            </label>
            <input
              type="text"
              className="quiz-input"
              placeholder="Enter subject (e.g., Python, Mathematics, Physics)"
              value={quizSubject}
              onChange={(e) => setQuizSubject(e.target.value)}
              maxLength="50"
            />
          </div>
        )}

        {quizMode === "topic" && (
          <div className="quiz-input-group">
            <label className="quiz-label">
              <BookOpen size={18} /> Select Topic
            </label>
            <select
              className="quiz-input"
              value={quizTopic}
              onChange={(e) => setQuizTopic(e.target.value)}
            >
              <option value="">-- Select a Topic --</option>
              {PREDEFINED_TOPICS.map((topic, index) => (
                <option key={index} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        )}

        <div className="quiz-input-group">
          <label className="quiz-label">
            <Award size={18} />
            Difficulty Level
          </label>
          <div className="quiz-level-selector">
            {QUIZ_LEVELS.map((level) => (
              <button
                key={level.value}
                className={`quiz-level-btn ${quizLevel === level.value ? 'quiz-level-active' : ''}`}
                onClick={() => setQuizLevel(level.value)}
                style={{ '--level-color': level.color }}
                disabled={isLoading}
              >
                <Zap size={20} />
                <div className="quiz-level-info">
                  <h4>{level.label}</h4>
                  <p>{level.questions} questions • {level.time / 60} min</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-security-notice">
          <Shield size={20} />
          <div>
            <h4>Quiz Security Features</h4>
            <ul className="quiz-security-list">
              <li>Full-screen mode required</li>
              <li>Tab switching monitored (max 2 allowed)</li>
              <li>Copy/paste disabled</li>
              <li>Right-click disabled</li>
              <li>Keyboard shortcuts blocked</li>
            </ul>
          </div>
        </div>

        {securityWarning && (
          <div className="quiz-security-warning">
            <AlertTriangle size={16} />
            {securityWarning}
          </div>
        )}

        <button
          className="quiz-start-btn"
          onClick={startQuiz}
          disabled={!((quizMode === "subject" && quizSubject.trim()) || (quizMode === "topic" && quizTopic)) || isLoading}
        >
          {isLoading ? "Loading..." : "Start Quiz"}
          {!isLoading && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );

  const renderQuizHistory = () => (
    <div className="quiz-history">
      <div className="quiz-history-header">
        <History size={24} />
        <h2>Quiz History</h2>
      </div>

      {quizHistory.length === 0 ? (
        <div className="quiz-empty-state">
          <BookOpen size={48} />
          <p>No quizzes taken yet</p>
        </div>
      ) : (
        <div className="quiz-history-grid">
          {quizHistory.slice(0, 6).map((quiz, index) => (
            <div key={index} className="quiz-history-card">
              <div className="quiz-history-subject">{quiz.subject}</div>
              <div className={`quiz-history-level ${quiz.level?.toLowerCase()}`}>
                {quiz.level}
              </div>
              <div className="quiz-history-score">
                <Award size={20} />
                <span>{quiz.score}/{quiz.total_questions || 10}</span>
              </div>
              <div className={`quiz-history-percentage ${quiz.percentage >= 70 ? 'high' : quiz.percentage >= 50 ? 'medium' : 'low'}`}>
                {quiz.percentage}%
              </div>
              <div className="quiz-history-date">
                {new Date(quiz.timestamp || quiz.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderQuizTest = () => {
    const answeredCount = Object.keys(quizAnswers).length;
    const progressPercentage = (answeredCount / quizQuestions.length) * 100;
    
    return (
      <div className={`quiz-test-container ${isFullscreen ? 'quiz-fullscreen' : ''}`} ref={quizContainerRef}>
        <div className="quiz-test-header">
          <div className="quiz-test-info">
            <h3>
              {quizMode === "subject" ? quizSubject : quizTopic} • {quizLevel} Level
            </h3>
            <p>{answeredCount}/{quizQuestions.length} Questions Answered</p>
          </div>
          
          <div className="quiz-test-timer">
            <Clock size={20} />
            <span className={remainingTime < 300 ? 'quiz-time-warning' : ''}>
              {formatTime(remainingTime)}
            </span>
          </div>

          {securityWarning && (
            <div className="quiz-security-warning">
              <AlertTriangle size={16} />
              {securityWarning}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="quiz-progress-bar">
          <div 
            className="quiz-progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="quiz-questions-container">
          {quizQuestions.map((question, index) => (
            <div key={index} className="quiz-question-card">
              <div className="quiz-question-header">
                <span className="quiz-question-number">Q{index + 1}</span>
                {quizAnswers[index] && (
                  <span className="quiz-answered-badge">
                    <CheckCircle size={14} />
                    Answered
                  </span>
                )}
              </div>
              
              <div 
                className="quiz-question-text"
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              >
                {question.question}
              </div>

              <div className="quiz-options-grid">
                {question.options.map((option, optIndex) => {
                  const optionLetter = String.fromCharCode(65 + optIndex);
                  const isSelected = quizAnswers[index] === optionLetter;
                  
                  return (
                    <div
                      key={optIndex}
                      className={`quiz-option-card ${isSelected ? 'quiz-option-selected' : ''}`}
                      onClick={() => handleAnswerSelect(index, optIndex)}
                    >
                      <div className="quiz-option-selector">
                        {isSelected ? (
                          <CheckCircle size={16} />
                        ) : (
                          <span className="quiz-option-letter">{optionLetter}</span>
                        )}
                      </div>
                      <div className="quiz-option-text">{option}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="quiz-test-actions">
            <button
              className="quiz-submit-btn quiz-submit-danger"
              onClick={() => {
                if (window.confirm("Are you sure you want to submit the quiz?")) {
                  submitQuiz();
                }
              }}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuizResults = () => {
    const { score, percentage } = calculateScore();
    const isDisqualified = quizResult?.disqualified;
    
    return (
      <div className="quiz-results">
        <div className="quiz-results-header">
          {isDisqualified ? (
            <>
              <XCircle size={48} className="quiz-disqualified-icon" />
              <h2>Quiz Disqualified</h2>
              <p>{quizResult.disqualificationReason}</p>
            </>
          ) : (
            <>
              <Award size={48} className="quiz-success-icon" />
              <h2>Quiz Completed</h2>
              <p>Great job completing the assessment!</p>
            </>
          )}
        </div>

        {!isDisqualified && (
          <>
            <div className="quiz-results-stats">
              <div className="quiz-stat-card">
                <div className="quiz-stat-icon quiz-stat-score">
                  <Award size={24} />
                </div>
                <div className="quiz-stat-content">
                  <h3>{score}/{quizQuestions.length}</h3>
                  <p>Score</p>
                </div>
              </div>

              <div className="quiz-stat-card">
                <div className="quiz-stat-icon quiz-stat-percentage">
                  <BarChart3 size={24} />
                </div>
                <div className="quiz-stat-content">
                  <h3>{percentage}%</h3>
                  <p>Percentage</p>
                </div>
              </div>

              <div className="quiz-stat-card">
                <div className="quiz-stat-icon quiz-stat-time">
                  <Clock size={24} />
                </div>
                <div className="quiz-stat-content">
                  <h3>{formatTime(remainingTime)}</h3>
                  <p>Time Remaining</p>
                </div>
              </div>
            </div>

            <div className="quiz-answer-review">
  {quizQuestions.map((question, index) => {
    const userAnswer = quizAnswers[index];
    const correctAnswer = question.correct;

    return (
      <div key={index} className="quiz-question-card">
        <h4>Q{index + 1}: {question.question}</h4>

        <div className="quiz-options-grid">
          {question.options.map((option, optIndex) => {
            const optionLetter = String.fromCharCode(65 + optIndex);
            let optionClass = "quiz-option-card";

            if (optionLetter === correctAnswer) optionClass += " quiz-option-correct"; // Green
            if (optionLetter === userAnswer && userAnswer !== correctAnswer) optionClass += " quiz-option-wrong"; // Red

            return (
              <div key={optIndex} className={optionClass}>
                <strong>{optionLetter}.</strong> {option}
                {optionLetter === userAnswer && <span> ← Your Answer</span>}
                {optionLetter === correctAnswer && <span> ← Correct Answer</span>}
              </div>
            );
          })}
        </div>

        {/* Optional explanation if available */}
        {question.explanation && (
          <div className="quiz-explanation">
            <strong>Explanation:</strong> {question.explanation}
          </div>
        )}
      </div>
    );
  })}
</div>


            <div className="quiz-results-actions">
              <button
                className="quiz-action-btn quiz-action-primary"
                onClick={resetQuiz}
              >
                <Home size={20} />
                Back to Dashboard
              </button>
              
              <button
                className="quiz-action-btn quiz-action-secondary"
                onClick={() => {
                  resetQuiz();
                  setQuizStep(1);
                }}
              >
                <RefreshCw size={20} />
                Take Another Quiz
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="quiz-container">
      {quizStep !== 2 && <StudentTopBar />}
      
      <div className="quiz-content">
        {quizStep === 1 && (
          <>
            {renderQuizSetup()}
            {renderQuizHistory()}
          </>
        )}
        
        {quizStep === 2 && renderQuizTest()}
        {quizStep === 3 && renderQuizResults()}
      </div>
    </div>
  );
}