import React, { useEffect, useState } from "react";
import API_URL from "../../../baseurl";
import StudentTopBar from "../../nav/studenttop";
import "./StudentProgress.css";

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
  Title
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

import {
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Calendar,
  BookOpen,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Circle,
  Star,
  Zap,
  Clock,
  AlertTriangle
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function StudentProgress() {
  const studentId = localStorage.getItem("loggedUser");
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [chartType, setChartType] = useState("line");
  
  const [overallStats, setOverallStats] = useState({
    averageScore: 0,
    highestScore: 0,
    totalTests: 0,
    improvementRate: 0,
    streakDays: 0,
    favoriteSubject: ""
  });

  // Fetch progress data
  useEffect(() => {
    fetchProgressData();
  }, [studentId]);

  const fetchProgressData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_URL}/student/progress/${studentId}`);
      const data = await response.json();
      
      if (data.success) {
        setProgressData(data.progress || []);
        calculateOverallStats(data.progress || []);
      } else {
        setError("Failed to load progress data");
      }
    } catch (err) {
      setError("Unable to connect to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall statistics
  const calculateOverallStats = (progress) => {
    if (!progress.length) return;

    const scores = progress.map(p => p.percentage);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highestScore = Math.max(...scores);
    
    // Calculate improvement rate (last 5 tests vs first 5 tests)
    let improvementRate = 0;
    if (progress.length >= 10) {
      const firstHalf = progress.slice(0, 5);
      const lastHalf = progress.slice(-5);
      const firstAvg = firstHalf.reduce((a, b) => a + b.percentage, 0) / firstHalf.length;
      const lastAvg = lastHalf.reduce((a, b) => a + b.percentage, 0) / lastHalf.length;
      improvementRate = ((lastAvg - firstAvg) / firstAvg) * 100;
    }

    // Find favorite subject (subject with highest average)
    const subjectScores = {};
    progress.forEach(p => {
      if (!subjectScores[p.subject]) {
        subjectScores[p.subject] = { total: 0, count: 0 };
      }
      subjectScores[p.subject].total += p.percentage;
      subjectScores[p.subject].count++;
    });

    let favoriteSubject = "";
    let highestAvg = 0;
    Object.entries(subjectScores).forEach(([subject, data]) => {
      const avg = data.total / data.count;
      if (avg > highestAvg) {
        highestAvg = avg;
        favoriteSubject = subject;
      }
    });

    setOverallStats({
      averageScore: Math.round(averageScore),
      highestScore: Math.round(highestScore),
      totalTests: progress.length,
      improvementRate: Math.round(improvementRate),
      streakDays: calculateStreak(progress),
      favoriteSubject
    });
  };

  // Calculate learning streak
  const calculateStreak = (progress) => {
    if (!progress.length) return 0;
    
    const sortedProgress = [...progress]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 1;
    let currentDate = new Date(sortedProgress[0].date);
    
    for (let i = 1; i < sortedProgress.length; i++) {
      const nextDate = new Date(sortedProgress[i].date);
      const diffDays = Math.floor((currentDate - nextDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentDate = nextDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Filter progress data based on selected filters
  const filteredProgress = progressData.filter(item => {
    if (timeFilter !== "all") {
      const daysAgo = parseInt(timeFilter);
      const itemDate = new Date(item.date);
      const today = new Date();
      const diffDays = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays > daysAgo) return false;
    }
    
    if (subjectFilter !== "all" && item.subject !== subjectFilter) {
      return false;
    }
    
    return true;
  });

  // Get unique subjects for filter
  const uniqueSubjects = [...new Set(progressData.map(p => p.subject))];

  // Prepare chart data
  const chartData = {
    labels: filteredProgress.map(p => `${p.subject}\n${formatDate(p.date)}`),
    datasets: [
      {
        label: "Progress %",
        data: filteredProgress.map(p => p.percentage),
        borderWidth: 3,
        tension: 0.4,
        fill: chartType === "line" ? true : false,
        backgroundColor: chartType === "line" 
          ? 'rgba(30, 58, 138, 0.1)' 
          : 'rgba(30, 58, 138, 0.8)',
        borderColor: 'rgba(30, 58, 138, 1)',
        pointBackgroundColor: 'rgba(30, 58, 138, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  // Subject distribution data for pie chart
  const subjectDistributionData = {
    labels: uniqueSubjects,
    datasets: [
      {
        data: uniqueSubjects.map(subject => {
          const subjectTests = progressData.filter(p => p.subject === subject);
          return subjectTests.reduce((sum, p) => sum + p.percentage, 0) / subjectTests.length;
        }),
        backgroundColor: [
          'rgba(30, 58, 138, 0.8)',
          'rgba(46, 107, 230, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 6,
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const test = filteredProgress[index];
            return [
              `Score: ${test.percentage}%`,
              `Subject: ${test.subject}`,
              `Date: ${formatDate(test.date)}`,
              test.level && `Level: ${test.level}`
            ].filter(Boolean);
          }
        }
      }
    },
    scales: chartType === "line" || chartType === "bar" ? {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage (%)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tests',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          },
          maxRotation: 45
        }
      }
    } : undefined
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.parsed.toFixed(1)}% average`;
          }
        }
      }
    }
  };

  // Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}


  // Export data as CSV
  const exportToCSV = () => {
    const headers = ['Subject', 'Percentage', 'Date', 'Level', 'Score'];
    const csvContent = [
      headers.join(','),
      ...filteredProgress.map(p => [
        p.subject,
        p.percentage,
        p.date,
        p.level || 'N/A',
        p.score || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Render loading state
  if (loading) {
    return (
      <div className="progress-container">
        <StudentTopBar />
        <div className="progress-loading">
          <div className="loading-spinner"></div>
          <p>Loading your progress data...</p>
        </div>
      </div>
    );
  }

  console.log(progressData);


  return (
    <div className="progress-container">
      <StudentTopBar />
      
      <div className="progress-content">
        {/* Header */}
        <div className="progress-header">
          <div className="header-content">
            <h1 className="progress-title">
              <TrendingUp size={32} />
              Learning Progress Dashboard
            </h1>
            <p className="progress-subtitle">
              Track your performance and improvement over time
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="action-btn secondary"
              onClick={fetchProgressData}
              disabled={loading}
            >
              <RefreshCw size={18} />
              Refresh Data
            </button>
            <button 
              className="action-btn primary"
              onClick={exportToCSV}
              disabled={filteredProgress.length === 0}
            >
              <Download size={18} />
              Export Data
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {/* Overall Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <h3>{overallStats.averageScore}%</h3>
              <p>Average Score</p>
            </div>
            <div className="stat-trend">
              {overallStats.improvementRate > 0 ? (
                <span className="trend-up">+{overallStats.improvementRate}%</span>
              ) : (
                <span className="trend-down">{overallStats.improvementRate}%</span>
              )}
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <div className="stat-content">
              <h3>{overallStats.highestScore}%</h3>
              <p>Highest Score</p>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <h3>{overallStats.totalTests}</h3>
              <p>Total Tests</p>
            </div>
          </div>

          <div className="stat-card stat-card-info">
            <div className="stat-icon">
              <Zap size={24} />
            </div>
            <div className="stat-content">
              <h3>{overallStats.streakDays}</h3>
              <p>Day Streak</p>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="controls-section">
          <div className="filters-group">
            <div className="filter-item">
              <label>
                <Calendar size={18} />
                Time Period
              </label>
              <select 
                className="filter-select"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </div>

            <div className="filter-item">
              <label>
                <BookOpen size={18} />
                Subject
              </label>
              <select 
                className="filter-select"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="all">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>
                <BarChart3 size={18} />
                Chart Type
              </label>
              <div className="chart-type-buttons">
                <button 
                  className={`chart-type-btn ${chartType === "line" ? "active" : ""}`}
                  onClick={() => setChartType("line")}
                >
                  Line
                </button>
                <button 
                  className={`chart-type-btn ${chartType === "bar" ? "active" : ""}`}
                  onClick={() => setChartType("bar")}
                >
                  Bar
                </button>
                <button 
                  className={`chart-type-btn ${chartType === "pie" ? "active" : ""}`}
                  onClick={() => setChartType("pie")}
                  disabled={uniqueSubjects.length === 0}
                >
                  Pie
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {progressData.length === 0 ? (
          <div className="empty-state">
            <TrendingUp size={48} />
            <h3>No Progress Data Available</h3>
            <p>Take some tests to see your progress visualized here</p>
          </div>
        ) : (
          <div className="charts-section">
            {/* Main Chart */}
            <div className="chart-container main-chart">
              <div className="chart-header">
                <h3>
                  {chartType === "line" && "Progress Trend"}
                  {chartType === "bar" && "Performance Comparison"}
                  {chartType === "pie" && "Subject Distribution"}
                </h3>
                <div className="chart-summary">
                  <span className="summary-item">
                    <Circle size={10} fill="rgba(30, 58, 138, 1)" />
                    {filteredProgress.length} Tests
                  </span>
                  {subjectFilter !== "all" && (
                    <span className="summary-item">
                      <Star size={14} />
                      Subject: {subjectFilter}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="chart-wrapper">
                {chartType === "line" && (
                  <Line data={chartData} options={chartOptions} />
                )}
                {chartType === "bar" && (
                  <Bar data={chartData} options={chartOptions} />
                )}
                {chartType === "pie" && (
                  <Pie data={subjectDistributionData} options={pieOptions} />
                )}
              </div>
            </div>

            {/* Recent Tests Table */}
            <div className="table-container">
              <div className="table-header">
                <h3>Recent Tests</h3>
                <span>Showing {Math.min(filteredProgress.length, 5)} of {filteredProgress.length}</span>
              </div>
              
              <div className="table-scroll">
                <table className="progress-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Score</th>
                      <th>Level</th>
                      <th>Date</th>
                      {/* <th>Performance</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProgress.slice(0, 5).map((test, index) => (
                      <tr key={index}>
                        <td>
                          <div className="subject-cell">
                            <div className="subject-icon">
                              {test.subject.charAt(0)}
                            </div>
                            {test.subject}
                          </div>
                        </td>
                        <td>
                          <span className="score-badge">
                            {test.percentage}%
                          </span>
                        </td>
                        <td>
                            {/* {test.level} */}
                          <span className={`level-badge level-${test.level?.toLowerCase() || 'unknown'}`}>
                            {test.level || 'N/A'}
                          </span>
                        </td>
                        <td className="date-cell">
                          {test.date}
                        </td>
                        {/* <td>
                          <div className="performance-bar">
                            <div 
                              className="performance-fill"
                              style={{ width: `${test.percentage}%` }}
                            ></div>
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Insights Section */}
        {progressData.length > 0 && (
          <div className="insights-section">
            <h3>
              <Zap size={24} />
              Performance Insights
            </h3>
            
            <div className="insights-grid">
              <div className="insight-card">
                <h4>📊 Best Subject</h4>
                <p>{overallStats.favoriteSubject || "Not enough data"}</p>
                <small>Based on average scores</small>
              </div>
              
              <div className="insight-card">
                <h4>📈 Improvement Rate</h4>
                <p className={overallStats.improvementRate > 0 ? "insight-positive" : "insight-negative"}>
                  {overallStats.improvementRate > 0 ? "+" : ""}{overallStats.improvementRate}%
                </p>
                <small>Over last 10 tests</small>
              </div>
              
              <div className="insight-card">
                <h4>🔥 Current Streak</h4>
                <p>{overallStats.streakDays} days</p>
                <small>Consecutive test days</small>
              </div>
              
              <div className="insight-card">
                <h4>🎯 Next Goal</h4>
                <p>{Math.min(100, overallStats.averageScore + 10)}% average</p>
                <small>+10% improvement target</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}