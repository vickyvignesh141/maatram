import React, { useState, useEffect, useRef } from "react";
import baseurl from "../../../baseurl";
import StudentTopBar from "../../nav/studenttop";
import "./SubjectSkillTest.css";

import {
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  BarChart3,
  History,
  Shield,
  Lock,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Home,
  Flag,
  Zap
} from "lucide-react";

export default function SubjectSkillTest() {
  const studentId = localStorage.getItem("loggedUser");
  const [fullScreen, setFullScreen] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [copyAttemptCount, setCopyAttemptCount] = useState(0);
  
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testContainerRef = useRef(null);
  const timerRef = useRef(null);

  const levels = [
    { value: "Beginner", label: "Beginner", questions: 10, time: 1800 },
    { value: "Intermediate", label: "Intermediate", questions: 15, time: 2700 },
    { value: "Advanced", label: "Advanced", questions: 20, time: 3600 }
  ];

  /* ================= FULLSCREEN HANDLING ================= */
  const enterFullScreen = () => {
    const elem = testContainerRef.current;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setFullScreen(true);
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setFullScreen(false);
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  /* ================= ANTI-CHEAT PROTECTIONS ================= */
  useEffect(() => {
    if (!timerActive || step !== 2) return;

    // Prevent copy/paste
    const handleCopy = (e) => {
      e.preventDefault();
      setCopyAttemptCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          submitTestEarly("Disqualified for multiple copy attempts");
        }
        return newCount;
      });
      return false;
    };

    // Prevent context menu (right-click)
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Detect tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        
        if (newCount >= 2) {
          submitTestEarly("Disqualified for multiple tab switches");
        } else {
          alert("⚠️ Warning: Switching tabs during test is not allowed!");
        }
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timerActive, step, tabSwitchCount]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            submitTestEarly("Time's up!");
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
  }, [timerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /* ================= HISTORY ================= */
  useEffect(() => {
    if (!studentId) return;

    fetch(`${baseurl}/subject-test/history/${studentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setHistory(data.history || []);
      })
      .catch(() => setHistory([]));
  }, [studentId]);

  /* ================= START TEST ================= */
  const startTest = async () => {
    if (!subject.trim()) {
      setError("Please enter a subject");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${baseurl}/subject-test/mcq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, level })
      });

      const data = await res.json();
      
      if (data.success) {
        setMcqs(data.mcqs || []);
        setAnswers({});
        setTimerActive(true);
        setTimeLeft(levels.find(l => l.value === level)?.time || 1800);
        setStep(2);
        enterFullScreen();
      } else {
        setError(data.message || "Failed to load test questions");
      }
    } catch (err) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT TEST ================= */
  const submitTest = async (disqualificationReason = "") => {
    const isDisqualified = !!disqualificationReason;
    
    try {
      const res = await fetch(`${baseurl}/subject-test/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          subject,
          level,
          mcqs,
          answers,
          time_spent: levels.find(l => l.value === level)?.time - timeLeft,
          disqualified: isDisqualified,
          disqualification_reason: disqualificationReason
        })
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          ...data,
          disqualified: isDisqualified,
          disqualificationReason
        });
        setTimerActive(false);
        setStep(3);
        exitFullScreen();
        
        // Refresh history
        if (!isDisqualified) {
          fetch(`${baseurl}/subject-test/history/${studentId}`)
            .then(res => res.json())
            .then(data => {
              if (data.success) setHistory(data.history || []);
            });
        }
      }
    } catch (err) {
      setError("Failed to submit test");
    }
  };

  const submitTestEarly = (reason) => {
    if (window.confirm(`⚠️ ${reason}. Submit test now?`)) {
      submitTest(reason);
    }
  };

  /* ================= QUESTION NAVIGATION ================= */
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleNext = () => {
    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionLetter
    }));
  };

  /* ================= RENDER FUNCTIONS ================= */
  const renderHistory = () => (
    <div className="history-section">
      <div className="section-header">
        <History size={24} />
        <h2>Test History</h2>
        <button 
          className="icon-btn" 
          onClick={() => setHistory([])}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <p>No tests taken yet</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.slice(0, 5).map((test, index) => (
            <div key={index} className="history-card">
              <div className="history-header">
                <div className="subject-badge">
                  {test.subject.substring(0, 2).toUpperCase()}
                </div>
                <div className="history-meta">
                  <span className="level-badge">{test.level}</span>
                  <span className="date">{new Date(test.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="history-score">
                <div className="score-circle">
                  <span>{test.percentage}%</span>
                </div>
                <div className="score-details">
                  <p><b>Score:</b> {test.score}/{test.total_questions || 10}</p>
                  <p><b>Time:</b> {test.time_spent ? `${Math.floor(test.time_spent / 60)}m ${test.time_spent % 60}s` : 'N/A'}</p>
                </div>
              </div>

              {test.disqualified && (
                <div className="disqualified-badge">
                  <AlertTriangle size={14} />
                  Disqualified
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div className="setup-section">
      <div className="setup-header">
        <BookOpen size={32} />
        <h2>Subject Skill Test</h2>
        <p>Assess your knowledge and track progress</p>
      </div>

      <div className="setup-card">
        <div className="input-group">
          <label>
            <BookOpen size={18} />
            Subject
          </label>
          <input
            type="text"
            className="subject-input"
            placeholder="Enter subject (e.g., Python, Mathematics, Physics)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>
            <Award size={18} />
            Difficulty Level
          </label>
          <div className="level-options">
            {levels.map((lvl) => (
              <button
                key={lvl.value}
                className={`level-btn ${level === lvl.value ? 'active' : ''}`}
                onClick={() => setLevel(lvl.value)}
              >
                <div className="level-icon">
                  {lvl.value === 'Beginner' && <Zap size={20} />}
                  {lvl.value === 'Intermediate' && <BarChart3 size={20} />}
                  {lvl.value === 'Advanced' && <Award size={20} />}
                </div>
                <div className="level-info">
                  <h4>{lvl.label}</h4>
                  <p>{lvl.questions} questions • {lvl.time / 60} mins</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="security-notice">
          <Shield size={20} />
          <div>
            <h4>Test Security</h4>
            <ul>
              <li>Full-screen mode required</li>
              <li>Tab switching is monitored</li>
              <li>Copy/paste is disabled</li>
              <li>Time-limited assessment</li>
            </ul>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          className="start-test-btn"
          onClick={startTest}
          disabled={loading || !subject.trim()}
        >
          {loading ? (
            <>
              <RefreshCw size={20} className="spinner" />
              Preparing Test...
            </>
          ) : (
            <>
              Start Test
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={`test-container ${fullScreen ? 'fullscreen' : ''}`} ref={testContainerRef}>
      {/* Test Header */}
      <div className="test-header">
        <div className="test-info">
          <h3>{subject} • {level} Level</h3>
          <p>Question {currentQuestion + 1} of {mcqs.length}</p>
        </div>
        
        <div className="test-controls">
          <div className="timer">
            <Clock size={20} />
            <span className={timeLeft < 300 ? 'warning' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <div className="security-indicators">
            {tabSwitchCount > 0 && (
              <span className="warning-badge">
                <AlertTriangle size={16} />
                Tab Switches: {tabSwitchCount}
              </span>
            )}
            {copyAttemptCount > 0 && (
              <span className="warning-badge">
                <Lock size={16} />
                Copy Attempts: {copyAttemptCount}
              </span>
            )}
          </div>

          <button className="icon-btn" onClick={exitFullScreen}>
            <Minimize2 size={20} />
            Exit Fullscreen
          </button>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="question-nav">
        {mcqs.map((_, index) => (
          <button
            key={index}
            className={`nav-btn ${index === currentQuestion ? 'active' : ''} ${answers[index] ? 'answered' : ''}`}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Current Question */}
      <div className="question-card">
        <div className="question-header">
          <span className="question-number">Question {currentQuestion + 1}</span>
          <button 
            className="flag-btn"
            onClick={() => {
              // Mark question for review
              setAnswers(prev => ({
                ...prev,
                [`flag_${currentQuestion}`]: !prev[`flag_${currentQuestion}`]
              }));
            }}
          >
            <Flag size={18} />
            {answers[`flag_${currentQuestion}`] ? 'Unflag' : 'Flag'}
          </button>
        </div>

        <div className="question-text" onCopy={(e) => e.preventDefault()}>
          {mcqs[currentQuestion]?.question}
        </div>

        <div className="options-grid">
          {mcqs[currentQuestion]?.options?.map((option, optIndex) => {
            const optionLetter = String.fromCharCode(65 + optIndex);
            const isSelected = answers[currentQuestion] === optionLetter;
            
            return (
              <div
                key={optIndex}
                className={`option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQuestion, optIndex)}
              >
                <div className="option-selector">
                  {isSelected ? (
                    <CheckCircle size={20} />
                  ) : (
                    <div className="option-letter">{optionLetter}</div>
                  )}
                </div>
                <div className="option-text">{option}</div>
              </div>
            );
          })}
        </div>

        {/* Question Navigation Buttons */}
        <div className="question-actions">
          <button
            className="nav-action-btn"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className="progress-indicator">
            {Math.round(((currentQuestion + 1) / mcqs.length) * 100)}% Complete
          </div>
          
          {currentQuestion < mcqs.length - 1 ? (
            <button
              className="nav-action-btn primary"
              onClick={handleNext}
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              className="nav-action-btn submit"
              onClick={() => {
                if (window.confirm("Are you sure you want to submit the test?")) {
                  submitTest();
                }
              }}
            >
              Submit Test
            </button>
          )}
        </div>
      </div>

      {/* Warning Overlay */}
      {warningCount > 0 && (
        <div className="warning-overlay">
          <AlertTriangle size={32} />
          <h3>⚠️ Warning {warningCount}</h3>
          <p>Please focus on the test. Further violations may result in disqualification.</p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="result-section">
      <div className="result-header">
        {result?.disqualified ? (
          <div className="disqualified-header">
            <XCircle size={48} />
            <h2>Test Disqualified</h2>
          </div>
        ) : (
          <div className="success-header">
            <Award size={48} />
            <h2>Test Completed</h2>
          </div>
        )}
        
        <p>{result?.disqualified ? result.disqualificationReason : 'Great job completing the test!'}</p>
      </div>

      {!result?.disqualified && (
        <div className="result-stats">
          <div className="stat-card">
            <div className="stat-icon score">
              <Award size={24} />
            </div>
            <div className="stat-content">
              <h3>{result?.score || 0}/{mcqs.length}</h3>
              <p>Score</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon percentage">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <h3>{result?.percentage || 0}%</h3>
              <p>Percentage</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon time">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{formatTime(levels.find(l => l.value === level)?.time - timeLeft)}</h3>
              <p>Time Taken</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon level">
              <Zap size={24} />
            </div>
            <div className="stat-content">
              <h3>{level}</h3>
              <p>Difficulty</p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Results */}
      <div className="detailed-results">
        <h3>Question Review</h3>
        <div className="results-grid">
          {mcqs.map((q, index) => {
            const userAnswer = answers[index];
            const correctAnswer = q.correct;
            const isCorrect = userAnswer === correctAnswer;
            
            return (
              <div key={index} className="result-item">
                <div className="result-question">
                  <span className="question-num">Q{index + 1}</span>
                  <p>{q.question}</p>
                </div>
                <div className="result-answers">
                  <div className="user-answer">
                    <span>Your Answer:</span>
                    <span className={isCorrect ? 'correct' : 'incorrect'}>
                      {userAnswer || 'Not answered'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="correct-answer">
                      <span>Correct Answer:</span>
                      <span className="correct">{correctAnswer}</span>
                    </div>
                  )}
                </div>
                {answers[`flag_${index}`] && (
                  <div className="flagged-note">
                    <Flag size={14} />
                    You flagged this question
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="result-actions">
        <button
          className="action-btn primary"
          onClick={() => {
            setStep(1);
            setSubject("");
            setResult(null);
            setMcqs([]);
            setAnswers({});
          }}
        >
          <Home size={20} />
          Back to Dashboard
        </button>
        
        <button
          className="action-btn secondary"
          onClick={() => {
            setStep(1);
            setResult(null);
            setMcqs([]);
            setAnswers({});
          }}
        >
          <RefreshCw size={20} />
          Take Another Test
        </button>
      </div>
    </div>
  );

  return (
    <div className="subject-skill-test">
      <StudentTopBar />
      
      <div className="container">
        {/* Main Content */}
        <div className="main-content">
          {step === 1 && (
            <>
              {renderStep1()}
              {history.length > 0 && renderHistory()}
            </>
          )}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Test Rules Sidebar (Only in step 1) */}
        {step === 1 && (
          <div className="rules-sidebar">
            <div className="rules-header">
              <Shield size={24} />
              <h3>Test Rules</h3>
            </div>
            
            <div className="rules-list">
              <div className="rule-item">
                <Maximize2 size={20} />
                <div>
                  <h4>Full Screen Mode</h4>
                  <p>Test will automatically enter full screen</p>
                </div>
              </div>
              
              <div className="rule-item">
                <Clock size={20} />
                <div>
                  <h4>Time Limit</h4>
                  <p>Timer starts immediately. No extra time</p>
                </div>
              </div>
              
              <div className="rule-item">
                <AlertCircle size={20} />
                <div>
                  <h4>No Tab Switching</h4>
                  <p>Switching tabs will trigger warnings</p>
                </div>
              </div>
              
              <div className="rule-item">
                <Lock size={20} />
                <div>
                  <h4>Copy Protection</h4>
                  <p>Copy/paste is disabled during test</p>
                </div>
              </div>
              
              <div className="rule-item">
                <Flag size={20} />
                <div>
                  <h4>Question Flagging</h4>
                  <p>Flag questions for review</p>
                </div>
              </div>
            </div>

            <div className="tips-section">
              <h4>Tips for Success</h4>
              <ul>
                <li>Read each question carefully</li>
                <li>Manage your time effectively</li>
                <li>Review flagged questions</li>
                <li>Stay focused throughout</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}