import React, { useState } from "react";
import Admintop from "../../nav/admintop";
import {
  BarChart3,
  TrendingUp,
  Users,
  UserX,
  GraduationCap,
  Briefcase,
  Calendar,
  Filter,
  Download,
  Eye,
  ChevronRight,
  TrendingDown,
  Percent,
  Award,
  Clock
} from "lucide-react";

const AdminStudentAnalytics = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [activeView, setActiveView] = useState("overview");
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Enhanced analytics data with more details
  const analytics = [
    {
      year: 2020,
      batch: "2020–2024",
      admitted: 120,
      dropped: 15,
      passedOut: 90,
      placed: 72,
      averageSalary: 850000,
      topCompanies: ["Infosys", "TCS", "Wipro", "Cognizant"],
      streamDistribution: {
        engineering: 80,
        arts: 25,
        science: 15
      },
      genderRatio: {
        male: 65,
        female: 35
      },
      monthlyData: {
        admissions: [10, 15, 20, 25, 20, 15, 5, 5, 5, 0, 0, 0],
        dropouts: [0, 0, 2, 3, 2, 1, 1, 2, 1, 1, 1, 1],
        placements: [0, 0, 0, 0, 5, 10, 15, 20, 15, 5, 2, 0]
      }
    },
    {
      year: 2021,
      batch: "2021–2025",
      admitted: 150,
      dropped: 18,
      passedOut: 0,
      placed: 0,
      averageSalary: 0,
      topCompanies: [],
      streamDistribution: {
        engineering: 100,
        arts: 30,
        science: 20
      },
      genderRatio: {
        male: 60,
        female: 40
      },
      monthlyData: {
        admissions: [15, 20, 25, 30, 25, 20, 10, 5, 0, 0, 0, 0],
        dropouts: [0, 1, 2, 3, 2, 2, 2, 2, 2, 1, 1, 0]
      }
    },
    {
      year: 2022,
      batch: "2022–2026",
      admitted: 180,
      dropped: 22,
      passedOut: 0,
      placed: 0,
      averageSalary: 0,
      topCompanies: [],
      streamDistribution: {
        engineering: 120,
        arts: 35,
        science: 25
      },
      genderRatio: {
        male: 62,
        female: 38
      },
      monthlyData: {
        admissions: [20, 25, 30, 35, 30, 25, 10, 5, 0, 0, 0, 0],
        dropouts: [0, 1, 2, 3, 3, 3, 3, 3, 2, 1, 1, 0]
      }
    },
    {
      year: 2023,
      batch: "2023–2027",
      admitted: 210,
      dropped: 10,
      passedOut: 0,
      placed: 0,
      averageSalary: 0,
      topCompanies: [],
      streamDistribution: {
        engineering: 140,
        arts: 40,
        science: 30
      },
      genderRatio: {
        male: 58,
        female: 42
      },
      monthlyData: {
        admissions: [25, 30, 35, 40, 35, 30, 10, 5, 0, 0, 0, 0],
        dropouts: [0, 0, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0]
      }
    }
  ];

  // Yearly trend data
  const yearlyTrends = {
    admissions: analytics.map(a => a.admitted),
    dropouts: analytics.map(a => a.dropped),
    passRate: analytics.map(a => a.admitted > 0 ? ((a.admitted - a.dropped) / a.admitted) * 100 : 0),
    placementRate: analytics.map(a => a.passedOut > 0 ? (a.placed / a.passedOut) * 100 : 0)
  };

  // Calculate totals
  const totalAdmitted = analytics.reduce((a, b) => a + b.admitted, 0);
  const totalDropped = analytics.reduce((a, b) => a + b.dropped, 0);
  const totalPassed = analytics.reduce((a, b) => a + b.passedOut, 0);
  const totalPlaced = analytics.reduce((a, b) => a + b.placed, 0);
  const overallPassRate = totalAdmitted > 0 ? ((totalAdmitted - totalDropped) / totalAdmitted) * 100 : 0;
  const overallPlacementRate = totalPassed > 0 ? (totalPlaced / totalPassed) * 100 : 0;

  // Filter analytics based on selected year
  const filteredAnalytics = selectedYear === "all" 
    ? analytics 
    : analytics.filter(a => a.year.toString() === selectedYear);

  // Calculate current active students
  const activeStudents = totalAdmitted - totalDropped - totalPassed;

  // Handle batch selection for drill-down
  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setActiveView("batchDetails");
  };

  // Export data function
  const exportToCSV = () => {
    const headers = ["Year", "Batch", "Admitted", "Dropped", "Passed Out", "Placed", "Placement Rate"];
    const csvData = analytics.map(batch => [
      batch.year,
      batch.batch,
      batch.admitted,
      batch.dropped,
      batch.passedOut,
      batch.placed,
      `${(batch.passedOut > 0 ? (batch.placed / batch.passedOut * 100) : 0).toFixed(1)}%`
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_analytics.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Render different views
  const renderOverview = () => (
    <>
      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card total">
          <div className="summary-header">
            <Users size={24} />
            <h3>Total Admitted</h3>
          </div>
          <div className="summary-value">{totalAdmitted.toLocaleString()}</div>
          <div className="summary-trend">
            <TrendingUp size={16} />
            <span>+12% from last year</span>
          </div>
        </div>

        <div className="summary-card active">
          <div className="summary-header">
            <Clock size={24} />
            <h3>Active Students</h3>
          </div>
          <div className="summary-value">{activeStudents.toLocaleString()}</div>
          <div className="summary-trend">
            <Percent size={16} />
            <span>{((activeStudents / totalAdmitted) * 100).toFixed(1)}% of total</span>
          </div>
        </div>

        <div className="summary-card passed">
          <div className="summary-header">
            <GraduationCap size={24} />
            <h3>Passed Out</h3>
          </div>
          <div className="summary-value">{totalPassed.toLocaleString()}</div>
          <div className="summary-trend">
            <Award size={16} />
            <span>{overallPassRate.toFixed(1)}% success rate</span>
          </div>
        </div>

        <div className="summary-card placed">
          <div className="summary-header">
            <Briefcase size={24} />
            <h3>Placed Students</h3>
          </div>
          <div className="summary-value">{totalPlaced.toLocaleString()}</div>
          <div className="summary-trend">
            <BarChart3 size={16} />
            <span>{overallPlacementRate.toFixed(1)}% placement rate</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Yearly Trends</h3>
            <div className="chart-legend">
              <span className="legend-item admissions">Admissions</span>
              <span className="legend-item dropouts">Dropouts</span>
              <span className="legend-item pass-rate">Pass Rate</span>
            </div>
          </div>
          <div className="chart">
            {/* Simple bar chart visualization */}
            <div className="chart-bars">
              {analytics.map((batch, index) => (
                <div key={batch.year} className="chart-bar-group">
                  <div className="bar-label">{batch.year}</div>
                  <div className="bar-container">
                    <div 
                      className="bar admissions" 
                      style={{ height: `${(batch.admitted / Math.max(...yearlyTrends.admissions)) * 100}%` }}
                      title={`Admitted: ${batch.admitted}`}
                    />
                    <div 
                      className="bar dropouts" 
                      style={{ height: `${(batch.dropped / Math.max(...yearlyTrends.admissions)) * 100}%` }}
                      title={`Dropped: ${batch.dropped}`}
                    />
                    <div 
                      className="bar pass-rate" 
                      style={{ height: `${((batch.admitted - batch.dropped) / batch.admitted * 100)}%` }}
                      title={`Pass Rate: ${((batch.admitted - batch.dropped) / batch.admitted * 100).toFixed(1)}%`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <h4>Dropout Rate Trend</h4>
              <span className="metric-change negative">
                <TrendingDown size={14} />
                2.1%
              </span>
            </div>
            <div className="metric-value">
              {((totalDropped / totalAdmitted) * 100).toFixed(1)}%
            </div>
            <div className="metric-desc">Average dropout rate across batches</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h4>Placement Trend</h4>
              <span className="metric-change positive">
                <TrendingUp size={14} />
                5.3%
              </span>
            </div>
            <div className="metric-value">
              {overallPlacementRate.toFixed(1)}%
            </div>
            <div className="metric-desc">Overall placement success</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h4>Average Package</h4>
              <span className="metric-change positive">
                <TrendingUp size={14} />
                8.2%
              </span>
            </div>
            <div className="metric-value">
              ₹{analytics[0]?.averageSalary?.toLocaleString() || "0"}
            </div>
            <div className="metric-desc">Highest average in 2020 batch</div>
          </div>
        </div>
      </div>
    </>
  );

  const renderBatchDetails = () => {
    if (!selectedBatch) return null;

    return (
      <div className="batch-details">
        <div className="details-header">
          <button className="back-button" onClick={() => {
            setActiveView("overview");
            setSelectedBatch(null);
          }}>
            ← Back to Overview
          </button>
          <h2>Batch {selectedBatch.year} Details</h2>
        </div>

        <div className="batch-stats">
          <div className="batch-stat">
            <span className="stat-label">Total Admitted</span>
            <span className="stat-value">{selectedBatch.admitted}</span>
          </div>
          <div className="batch-stat">
            <span className="stat-label">Dropouts</span>
            <span className="stat-value negative">{selectedBatch.dropped}</span>
          </div>
          <div className="batch-stat">
            <span className="stat-label">Passed Out</span>
            <span className="stat-value">{selectedBatch.passedOut}</span>
          </div>
          <div className="batch-stat">
            <span className="stat-label">Placed</span>
            <span className="stat-value positive">{selectedBatch.placed}</span>
          </div>
        </div>

        <div className="detailed-info">
          <div className="info-section">
            <h3>Stream Distribution</h3>
            <div className="stream-distribution">
              {Object.entries(selectedBatch.streamDistribution).map(([stream, count]) => (
                <div key={stream} className="stream-item">
                  <span className="stream-name">{stream}</span>
                  <div className="stream-bar">
                    <div 
                      className="stream-fill"
                      style={{ width: `${(count / selectedBatch.admitted) * 100}%` }}
                    />
                  </div>
                  <span className="stream-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h3>Gender Ratio</h3>
            <div className="gender-distribution">
              <div className="gender-item">
                <span className="gender-label">Male</span>
                <div className="gender-bar">
                  <div 
                    className="gender-fill male"
                    style={{ width: `${selectedBatch.genderRatio.male}%` }}
                  />
                </div>
                <span className="gender-percent">{selectedBatch.genderRatio.male}%</span>
              </div>
              <div className="gender-item">
                <span className="gender-label">Female</span>
                <div className="gender-bar">
                  <div 
                    className="gender-fill female"
                    style={{ width: `${selectedBatch.genderRatio.female}%` }}
                  />
                </div>
                <span className="gender-percent">{selectedBatch.genderRatio.female}%</span>
              </div>
            </div>
          </div>

          {selectedBatch.topCompanies && selectedBatch.topCompanies.length > 0 && (
            <div className="info-section">
              <h3>Top Recruiters</h3>
              <div className="companies-list">
                {selectedBatch.topCompanies.map((company, index) => (
                  <span key={index} className="company-tag">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="analytics-page">
      <Admintop activeTab="analytics" />

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <h1>📊 Student Analytics Dashboard</h1>
            
          </div>
          <div className="header-actions">
            <div className="filter-group">
              <Filter size={18} />
              <select 
                className="year-filter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="all">All Years</option>
                {analytics.map(batch => (
                  <option key={batch.year} value={batch.year}>{batch.year}</option>
                ))}
              </select>
            </div>
            <button className="export-button" onClick={exportToCSV}>
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="view-toggle">
          <button 
            className={`view-button ${activeView === "overview" ? "active" : ""}`}
            onClick={() => setActiveView("overview")}
          >
            Overview
          </button>
          <button 
            className={`view-button ${activeView === "batchDetails" ? "active" : ""}`}
            disabled={!selectedBatch}
          >
            Batch Details
          </button>
        </div>

        {/* Main Content */}
        {activeView === "overview" ? renderOverview() : renderBatchDetails()}

        {/* Analytics Table */}
        <div className="table-section">
          <div className="section-header">
            <h2>Batch-wise Student Data</h2>
            <div className="table-summary">
              <span className="summary-item">
                <Users size={16} />
                {filteredAnalytics.length} batches
              </span>
              <span className="summary-item">
                <UserX size={16} />
                {totalDropped} total dropouts
              </span>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Batch</th>
                  <th>Admitted</th>
                  <th>Dropped Out</th>
                  <th>Passed Out</th>
                  <th>Placed</th>
                  <th>Placement Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalytics.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                    <td>
                      <div className="year-cell">
                        <Calendar size={18} />
                        <span className="year">{row.year}</span>
                      </div>
                    </td>
                    <td>
                      <span className="batch-label">{row.batch}</span>
                    </td>
                    <td>
                      <div className="metric-cell">
                        <span className="metric-value">{row.admitted}</span>
                      </div>
                    </td>
                    <td>
                      <div className="metric-cell">
                        <span className="metric-value negative">{row.dropped}</span>
                        {row.admitted > 0 && (
                          <span className="metric-percentage">
                            ({((row.dropped/row.admitted)*100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="metric-cell">
                        <span className="metric-value">{row.passedOut}</span>
                        {row.admitted > 0 && (
                          <span className="metric-percentage">
                            ({((row.passedOut/row.admitted)*100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="metric-cell">
                        <span className="metric-value positive">{row.placed}</span>
                        {row.passedOut > 0 && (
                          <span className="metric-percentage">
                            ({((row.placed/row.passedOut)*100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="rate-cell">
                        <div className="rate-bar">
                          <div 
                            className="rate-fill placement"
                            style={{ width: `${row.passedOut > 0 ? (row.placed / row.passedOut * 100) : 0}%` }}
                          />
                        </div>
                        <span className="rate-value">
                          {row.passedOut > 0 ? (row.placed / row.passedOut * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enhanced CSS */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .analytics-page {
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 100%);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Header */
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
          position: relative;
          overflow: hidden;
        }

        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          animation: float 20s linear infinite;
        }

        @keyframes float {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .header-content {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .header h1 {
          margin: 0 0 1rem 0;
          font-size: 2.4rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .subtitle {
          margin: 0;
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 600px;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .year-filter {
          background: transparent;
          border: none;
          color: white;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          outline: none;
          min-width: 120px;
        }

        .year-filter option {
          color: #333;
          background: white;
        }

        .export-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .export-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        /* View Toggle */
        .view-toggle {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .view-button {
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .view-button.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .view-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .view-button.small {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        /* Summary Cards */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .summary-card {
          background: white;
          padding: 1.75rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .summary-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .summary-card.total {
          border-top: 4px solid #3b82f6;
        }

        .summary-card.active {
          border-top: 4px solid #8b5cf6;
        }

        .summary-card.passed {
          border-top: 4px solid #10b981;
        }

        .summary-card.placed {
          border-top: 4px solid #f59e0b;
        }

        .summary-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .summary-header h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .summary-card.total .summary-value { color: #3b82f6; }
        .summary-card.active .summary-value { color: #8b5cf6; }
        .summary-card.passed .summary-value { color: #10b981; }
        .summary-card.placed .summary-value { color: #f59e0b; }

        .summary-trend {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #9ca3af;
          font-weight: 500;
        }

        /* Charts Section */
        .charts-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .chart-container {
          background: white;
          padding: 1.75rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .chart-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .chart-legend {
          display: flex;
          gap: 1rem;
        }

        .legend-item {
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }

        .legend-item.admissions {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .legend-item.dropouts {
          background: #fee2e2;
          color: #dc2626;
        }

        .legend-item.pass-rate {
          background: #dcfce7;
          color: #16a34a;
        }

        .chart {
          height: 300px;
        }

        .chart-bars {
          display: flex;
          gap: 2rem;
          height: 100%;
          align-items: flex-end;
          padding: 2rem 0;
        }

        .chart-bar-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .bar-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .bar-container {
          display: flex;
          gap: 4px;
          width: 60px;
          height: 100%;
          align-items: flex-end;
        }

        .bar {
          flex: 1;
          border-radius: 4px 4px 0 0;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .bar:hover {
          opacity: 0.8;
          transform: translateY(-2px);
        }

        .bar.admissions {
          background: linear-gradient(to top, #3b82f6, #60a5fa);
        }

        .bar.dropouts {
          background: linear-gradient(to top, #ef4444, #f87171);
        }

        .bar.pass-rate {
          background: linear-gradient(to top, #10b981, #34d399);
        }

        /* Metrics Grid */
        .metrics-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .metric-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .metric-header h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #4b5563;
        }

        .metric-change {
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .metric-change.positive {
          color: #10b981;
        }

        .metric-change.negative {
          color: #ef4444;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .metric-desc {
          font-size: 0.85rem;
          color: #6b7280;
        }

        /* Table Section */
        .table-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .table-summary {
          display: flex;
          gap: 1.5rem;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          min-width: 900px;
        }

        th {
          padding: 1.25rem 1.5rem;
          background: #f8fafc;
          font-weight: 600;
          font-size: 0.9rem;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f3f4f6;
        }

        tr {
          transition: all 0.2s ease;
        }

        tr:hover {
          background: #f9fafb;
        }

        tr.even {
          background: #fcfcfd;
        }

        .year-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .year {
          font-weight: 600;
          color: #3b82f6;
        }

        .batch-label {
          font-weight: 500;
          color: #1f2937;
        }

        .metric-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-value {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .metric-value.positive {
          color: #10b981;
        }

        .metric-value.negative {
          color: #ef4444;
        }

        .metric-percentage {
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .rate-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .rate-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .rate-fill {
          height: 100%;
          border-radius: 4px;
        }

        .rate-fill.placement {
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
        }

        .rate-value {
          font-size: 0.9rem;
          font-weight: 600;
          min-width: 45px;
        }

        /* Batch Details */
        .batch-details {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .details-header {
          margin-bottom: 2rem;
        }

        .back-button {
          background: none;
          border: none;
          color: #6b7280;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          transition: color 0.3s ease;
        }

        .back-button:hover {
          color: #3b82f6;
        }

        .batch-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .batch-stat {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .stat-value.positive {
          color: #10b981;
        }

        .stat-value.negative {
          color: #ef4444;
        }

        .detailed-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .info-section {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 16px;
        }

        .info-section h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .stream-distribution, .gender-distribution {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stream-item, .gender-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stream-name, .gender-label {
          font-size: 0.9rem;
          color: #6b7280;
          min-width: 100px;
        }

        .stream-bar, .gender-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .stream-fill, .gender-fill {
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          transition: width 1s ease-in-out;
        }

        .gender-fill.male {
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }

        .gender-fill.female {
          background: linear-gradient(90deg, #ec4899, #f472b6);
        }

        .stream-count, .gender-percent {
          font-size: 0.9rem;
          font-weight: 600;
          min-width: 40px;
          text-align: right;
        }

        .companies-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .company-tag {
          background: #dbeafe;
          color: #1d4ed8;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .container {
            padding: 1.5rem;
          }
          
          .header {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .charts-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .header {
            padding: 1.75rem;
          }

          .header h1 {
            font-size: 1.8rem;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .view-toggle {
            flex-wrap: wrap;
          }

          .table-container {
            margin: 0 -1rem;
            width: calc(100% + 2rem);
          }
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .summary-card, .chart-container, .table-section {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .summary-card:nth-child(1) { animation-delay: 0.1s; }
        .summary-card:nth-child(2) { animation-delay: 0.2s; }
        .summary-card:nth-child(3) { animation-delay: 0.3s; }
        .summary-card:nth-child(4) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default AdminStudentAnalytics;