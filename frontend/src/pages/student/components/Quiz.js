import React, { useState, useEffect, useRef } from "react";
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

export default function StudentQuiz() {
  const studentId = localStorage.getItem("loggedUser");
  
  // Quiz state
  const [quizSubject, setQuizSubject] = useState("");
  const [quizLevel, setQuizLevel] = useState("Beginner");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizStep, setQuizStep] = useState(1); // 1: Setup, 2: Test, 3: Results
  
  // Security state
  const [securityWarning, setSecurityWarning] = useState("");
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [remainingTime, setRemainingTime] = useState(1800); // 30 minutes
  const [timerActive, setTimerActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const quizContainerRef = useRef(null);
  const timerRef = useRef(null);

  // Quiz levels configuration
  const quizLevels = [
    { value: "Beginner", label: "Beginner", questions: 10, time: 1800, color: "var(--success)" },
    { value: "Intermediate", label: "Intermediate", questions: 10, time: 2700, color: "var(--warning)" },
    { value: "Hard", label: "Hard", questions: 10, time: 3600, color: "var(--error)" }
  ];

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
  }, [studentId]);

  /* ================= QUIZ SECURITY FEATURES ================= */
  useEffect(() => {
    if (quizStep !== 2) return;

    // Block keyboard shortcuts
    const handleKeyDown = (e) => {
      // Block F5, F12, Ctrl+R, Ctrl+Shift+R
      if (e.key === "F5" || e.key === "F12" || 
          (e.ctrlKey && e.key === "r") || 
          (e.ctrlKey && e.shiftKey && e.key === "r")) {
        e.preventDefault();
        setSecurityWarning("⚠️ Refresh/DevTools disabled during quiz");
      }
      
      // Block Ctrl+C, Ctrl+V, Ctrl+X
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setSecurityWarning("⚠️ Copy/Paste disabled during quiz");
      }
    };

    // Detect tab/window switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        
        if (newCount >= 2) {
          handleDisqualify("Multiple tab switches detected");
        } else {
          setSecurityWarning(`⚠️ Warning: Tab switch detected (${newCount}/2)`);
        }
      }
    };

    // Prevent context menu (right-click)
    const handleContextMenu = (e) => {
      e.preventDefault();
      setSecurityWarning("⚠️ Right-click disabled during quiz");
      return false;
    };

    // Block page leave
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "You have an active quiz in progress. Leaving will submit your quiz.";
    };

    // Apply security features
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.body.classList.add("quiz-active");

    // Start timer
    if (timerActive && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.body.classList.remove("quiz-active");
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizStep, timerActive, remainingTime, tabSwitchCount]);

  /* ================= QUIZ TIMER FUNCTIONS ================= */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUp = () => {
    setSecurityWarning("⏰ Time's up! Submitting your quiz...");
    setTimeout(() => submitQuiz("Time's up"), 2000);
  };

  /* ================= QUIZ ACTIONS ================= */
  const startQuiz = async () => {
    if (!quizSubject.trim()) {
      setSecurityWarning("Please enter a subject");
      return;
    }

    try {
      const response = await fetch(`${baseurl}/subject-test/mcq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: quizSubject, level: quizLevel })
      });

      const data = await response.json();

      if (data.success) {
        setQuizQuestions(data.mcqs || []);
        setQuizAnswers({});
        setTimerActive(true);
        setRemainingTime(
          quizLevels.find(l => l.value === quizLevel)?.time || 1800
        );
        setQuizStep(2);

        // Enter fullscreen
        setTimeout(() => {
          const elem = quizContainerRef.current || document.documentElement;
          if (elem.requestFullscreen) {
            elem.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
          }
        }, 100);
      } else {
        setSecurityWarning("Failed to load quiz");
      }
    } catch {
      setSecurityWarning("Unable to connect to quiz server");
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
          subject: quizSubject,
          level: quizLevel,
          mcqs: quizQuestions,
          answers: quizAnswers,
          time_spent: (quizLevels.find(l => l.value === quizLevel)?.time || 1800) - remainingTime,
          disqualified: isDisqualified,
          disqualification_reason: disqualifyReason
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQuizResult({
          ...data,
          disqualified: isDisqualified,
          disqualificationReason: disqualifyReason
        });
        setTimerActive(false);
        setQuizStep(3);
        
        // Exit fullscreen
        if (document.fullscreenElement) {
          document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
        }
        
        // Refresh history
        if (!isDisqualified) {
          const historyResponse = await fetch(`${baseurl}/subject-test/history/${studentId}`);
          const historyData = await historyResponse.json();
          if (historyData.success) setQuizHistory(historyData.history || []);
        }
      }
    } catch (error) {
      setSecurityWarning("Failed to submit quiz");
    }
  };

  const handleDisqualify = (reason) => {
    if (window.confirm(`${reason}. Submit quiz now?`)) {
      submitQuiz(reason);
    }
  };

  const resetQuiz = () => {
    setQuizSubject("");
    setQuizLevel("Beginner");
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizResult(null);
    setQuizStep(1);
    setSecurityWarning("");
    setTabSwitchCount(0);
    setTimerActive(false);
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const optionLetter = String.fromCharCode(65 + optionIndex);
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: optionLetter
    }));
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
            <BookOpen size={18} />
            Subject
          </label>
          <input
            type="text"
            className="quiz-input"
            placeholder="Enter subject (e.g., Python, Mathematics, Physics)"
            value={quizSubject}
            onChange={(e) => setQuizSubject(e.target.value)}
          />
        </div>

        <div className="quiz-input-group">
          <label className="quiz-label">
            <Award size={18} />
            Difficulty Level
          </label>
          <div className="quiz-level-selector">
            {quizLevels.map((level) => (
              <button
                key={level.value}
                className={`quiz-level-btn ${quizLevel === level.value ? 'quiz-level-active' : ''}`}
                onClick={() => setQuizLevel(level.value)}
                style={{ '--level-color': level.color }}
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
              <li>Tab switching monitored</li>
              <li>Copy/paste disabled</li>
              <li>Right-click disabled</li>
            </ul>
          </div>
        </div>

        <button
          className="quiz-start-btn"
          onClick={startQuiz}
          disabled={!quizSubject.trim()}
        >
          Start Quiz
          <ChevronRight size={20} />
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
              <div className="quiz-history-level">{quiz.level}</div>
              <div className="quiz-history-score">
                <Award size={20} />
                <span>{quiz.score}/{quiz.total_questions || 10}</span>
              </div>
              <div className="quiz-history-percentage">{quiz.percentage}%</div>
              <div className="quiz-history-date">{quiz.date}  {quiz.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

const renderQuizTest = () => (
  <div className={`quiz-test-container ${isFullscreen ? 'quiz-fullscreen' : ''}`} ref={quizContainerRef}>
    <div className="quiz-test-header">
      <div className="quiz-test-info">
        <h3>{quizSubject} • {quizLevel} Level</h3>
        <p>{quizQuestions.length} Questions</p>
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
            {/* Show correct/wrong indicator in results */}
            {quizStep === 3 && quizAnswers[index] && (
              <span className={`quiz-result-indicator ${
                quizAnswers[index] === question.correct ? 'correct' : 'wrong'
              }`}>
                {quizAnswers[index] === question.correct ? '✓ Correct' : '✗ Wrong'}
              </span>
            )}
          </div>
          
          <div 
            className="quiz-question-text"
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
          >
            {question.question}
          </div>

          <div className="quiz-options-grid">
            {question.options.map((option, optIndex) => {
              const optionLetter = String.fromCharCode(65 + optIndex);
              const correctAnswer = question.correct;
              const userAnswer = quizAnswers[index];

              let optionClass = "quiz-option-card";

              if (quizStep === 3) {
                // Show correct answer in green
                if (optionLetter === correctAnswer) {
                  optionClass += " quiz-option-correct";
                } 
                // Show user's wrong answer in red
                else if (optionLetter === userAnswer && userAnswer !== correctAnswer) {
                  optionClass += " quiz-option-wrong";
                }
                // Show user's correct answer with both styles
                else if (optionLetter === userAnswer && userAnswer === correctAnswer) {
                  optionClass += " quiz-option-correct quiz-option-selected-correct";
                }
              } else if (userAnswer === optionLetter) {
                optionClass += " quiz-option-selected";
              }

              return (
                <div
                  key={optIndex}
                  className={optionClass}
                  onClick={() =>
                    quizStep !== 3 && handleAnswerSelect(index, optIndex)
                  }
                >
                  <div className="quiz-option-selector">
                    {userAnswer === optionLetter ? (
                      <CheckCircle size={16} />
                    ) : (
                      <span className="quiz-option-letter">{optionLetter}</span>
                    )}
                    {quizStep === 3 && optionLetter === correctAnswer && (
                      <span className="correct-answer-marker">✓ Correct Answer</span>
                    )}
                  </div>

                  <div className="quiz-option-text">{option}</div>
                  
                  {/* Explanation in results mode */}
                  {quizStep === 3 && optionLetter === correctAnswer && question.explanation && (
                    <div className="answer-explanation">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Question score in results */}
          {quizStep === 3 && (
            <div className="question-score-display">
              {quizAnswers[index] === question.correct ? (
                <span className="score-correct">+1 point</span>
              ) : (
                <span className="score-wrong">0 points</span>
              )}
            </div>
          )}
        </div>
      ))}

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
);

  const renderQuizResults = () => (
    <div className="quiz-results">
      <div className="quiz-results-header">
        {quizResult?.disqualified ? (
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

      {!quizResult?.disqualified && (
        <div className="quiz-results-stats">
          <div className="quiz-stat-card">
            <div className="quiz-stat-icon quiz-stat-score">
              <Award size={24} />
            </div>
            <div className="quiz-stat-content">
              <h3>{quizResult?.score || 0}/{quizQuestions.length}</h3>
              <p>Score</p>
            </div>
          </div>

          <div className="quiz-stat-card">
            <div className="quiz-stat-icon quiz-stat-percentage">
              <BarChart3 size={24} />
            </div>
            <div className="quiz-stat-content">
              <h3>{quizResult?.percentage || 0}%</h3>
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
      )}

      <div className="quiz-results-actions">
        <button
          className="quiz-action-btn quiz-action-primary"
          onClick={() => {
            resetQuiz();
          }}
        >
          <Home size={20} />
          Back to Dashboard
        </button>
        
        <button
          className="quiz-action-btn quiz-action-secondary"
          onClick={() => {
            setQuizStep(1);
            setQuizResult(null);
          }}
        >
          <RefreshCw size={20} />
          Take Another Quiz
        </button>
      </div>
    </div>
  );

  return (
    <div className="quiz-container">
      {quizStep !== 2 && <StudentTopBar />}
      
      <div className="quiz-content">
        {quizStep === 1 && (
          <>
            {renderQuizSetup()}
            {quizHistory.length > 0 && renderQuizHistory()}
          </>
        )}
        
        {quizStep === 2 && renderQuizTest()}
        {quizStep === 3 && renderQuizResults()}
      </div>
    </div>
  );
}