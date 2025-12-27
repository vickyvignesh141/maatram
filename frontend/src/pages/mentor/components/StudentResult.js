import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MentorTopBar from "../../mentornav/mentortop";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function StudentProgress() {
  const { student_id } = useParams();
  const BASE_URL = "http://localhost:5000/api";

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [activePerformanceChart, setActivePerformanceChart] = useState("line");
  const [activeSubjectChart, setActiveSubjectChart] = useState("bar");

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    if (!student_id) return;

    const fetchStudentTests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/mentor/student/${student_id}/progress`);
        const fetchedTests = res.data.tests || [];
        setTests(fetchedTests);
        
        if (fetchedTests.length > 0) {
          prepareChartData(fetchedTests);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student tests:", err);
        setError("Failed to fetch student tests");
        setLoading(false);
      }
    };

    fetchStudentTests();
  }, [student_id]);

  const prepareChartData = (testsData) => {
    // Sort by date
    const sortedTests = [...testsData].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    // For performance charts - use descriptive test names
    const formattedData = sortedTests.map((test, index) => {
      // Create a descriptive test name
      let testName = `Test ${index + 1}`;
      if (test.subject) {
        testName = `${test.subject} Test`;
        if (test.level) {
          testName = `${test.subject} (${test.level})`;
        }
      }
      
      return {
        name: testName,
        shortName: `Test ${index + 1}`,
        date: test.date,
        score: test.score,
        percentage: test.percentage,
        subject: test.subject,
        level: test.level,
        fullDate: `${test.date} ${test.time}`
      };
    });

    setPerformanceData(formattedData);

    // For subject charts
    const subjectMap = {};
    testsData.forEach(test => {
      if (!subjectMap[test.subject]) {
        subjectMap[test.subject] = {
          name: test.subject,
          totalPercentage: 0,
          count: 0,
          totalScore: 0,
          maxScore: 0,
          minScore: 100
        };
      }
      subjectMap[test.subject].totalPercentage += test.percentage;
      subjectMap[test.subject].totalScore += test.score;
      subjectMap[test.subject].count += 1;
      subjectMap[test.subject].maxScore = Math.max(subjectMap[test.subject].maxScore, test.percentage);
      subjectMap[test.subject].minScore = Math.min(subjectMap[test.subject].minScore, test.percentage);
    });

    const subjectArray = Object.values(subjectMap).map(subject => ({
      name: subject.name,
      avgPercentage: Math.round(subject.totalPercentage / subject.count),
      avgScore: Math.round(subject.totalScore / subject.count),
      maxPercentage: subject.maxScore,
      minPercentage: subject.minScore,
      testCount: subject.count
    }));

    setSubjectData(subjectArray);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  // Render performance chart based on selection
  const renderPerformanceChart = () => {
    const chartProps = {
      data: performanceData,
      margin: { top: 10, right: 30, left: 20, bottom: 10 }
    };

    switch(activePerformanceChart) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Percentage (%)', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10,
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "percentage") return [`${value}%`, "Percentage"];
                return [value, name];
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: 5 }}
              contentStyle={{ 
                borderRadius: 8,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="percentage" 
              stroke="#0088FE" 
              strokeWidth={3}
              activeDot={{ r: 6 }}
              name="Percentage (%)"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#00C49F" 
              strokeWidth={2}
              name="Score"
              dot={{ r: 3 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Score', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10,
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "percentage") return [`${value}%`, "Percentage"];
                return [value, name];
              }}
              contentStyle={{ 
                borderRadius: 8,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="percentage" 
              fill="#0088FE" 
              name="Percentage (%)" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="score" 
              fill="#00C49F" 
              name="Score" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Percentage (%)', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10,
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "percentage") return [`${value}%`, "Percentage"];
                return [value, name];
              }}
              contentStyle={{ 
                borderRadius: 8,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="percentage" 
              stroke="#0088FE" 
              fill="#0088FE" 
              fillOpacity={0.3}
              strokeWidth={2}
              name="Percentage (%)"
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#00C49F" 
              fill="#00C49F" 
              fillOpacity={0.3}
              strokeWidth={2}
              name="Score"
            />
          </AreaChart>
        );

      default:
        return (
          <LineChart data={performanceData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="percentage" stroke="#0088FE" />
          </LineChart>
        );
    }
  };

  // Render subject chart based on selection
  const renderSubjectChart = () => {
    const chartProps = {
      data: subjectData,
      margin: { top: 10, right: 30, left: 20, bottom: 10 }
    };

    switch(activeSubjectChart) {
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Percentage (%)', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10,
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "avgPercentage") return [`${value}%`, "Average"];
                if (name === "maxPercentage") return [`${value}%`, "Highest"];
                if (name === "minPercentage") return [`${value}%`, "Lowest"];
                return [value, name];
              }}
              labelFormatter={(label) => `Subject: ${label}`}
              contentStyle={{ 
                borderRadius: 8,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="avgPercentage" 
              fill="#0088FE" 
              name="Average %" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="maxPercentage" 
              fill="#00C49F" 
              name="Highest %" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="minPercentage" 
              fill="#FF8042" 
              name="Lowest %" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      default:
        return (
          <BarChart data={subjectData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avgPercentage" fill="#0088FE" name="Average %" />
          </BarChart>
        );
    }
  };

  if (loading) return <p>Loading student tests...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="StudentResult">
      <MentorTopBar />
      <div className="container" style={{ padding: "20px" }}>
        <h1>Student Progress</h1>
        <h3 style={{ color: "#666", marginBottom: "30px" }}>Student ID: {student_id}</h3>

        {/* Combined Charts Section */}
        {tests.length > 0 ? (
          <>
            {/* Two Column Layout for Charts */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "30px",
              marginBottom: "40px"
            }}>
              
              {/* Performance Over Time Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Performance Over Time</h3>
                  <div className="chart-controls">
                    <button 
                      className={`chart-btn ${activePerformanceChart === 'line' ? 'active' : ''}`}
                      onClick={() => setActivePerformanceChart('line')}
                    >
                      Line
                    </button>
                    <button 
                      className={`chart-btn ${activePerformanceChart === 'bar' ? 'active' : ''}`}
                      onClick={() => setActivePerformanceChart('bar')}
                    >
                      Bar
                    </button>
                    <button 
                      className={`chart-btn ${activePerformanceChart === 'area' ? 'active' : ''}`}
                      onClick={() => setActivePerformanceChart('area')}
                    >
                      Area
                    </button>
                  </div>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    {renderPerformanceChart()}
                  </ResponsiveContainer>
                </div>
                <div className="chart-footer">
                  <p>Showing {performanceData.length} tests</p>
                </div>
              </div>

              {/* Subject Performance Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Performance by Subject</h3>
                  <div className="chart-controls">
                    <button 
                      className={`chart-btn ${activeSubjectChart === 'bar' ? 'active' : ''}`}
                      onClick={() => setActiveSubjectChart('bar')}
                    >
                      Bar Chart
                    </button>
                  </div>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    {renderSubjectChart()}
                  </ResponsiveContainer>
                </div>
                <div className="chart-footer">
                  <p>Showing {subjectData.length} subjects</p>
                </div>
              </div>
            </div>

            {/* Tests Table Section */}
            <div className="table-card">
              <h3>Detailed Test Results</h3>
              <div style={{ overflowX: "auto", marginTop: "20px" }}>
                <table className="test-table">
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Subject</th>
                      <th>Level</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Date</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((test, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: "500" }}>{test.name}</td>
                        <td>{test.subject}</td>
                        <td>
                          <span className={`level-badge ${test.level?.toLowerCase()}`}>
                            {test.level}
                          </span>
                        </td>
                        <td style={{ fontWeight: "500" }}>{test.score}</td>
                        <td>
                          <span className={`percentage-badge ${
                            test.percentage >= 70 ? "high" : 
                            test.percentage >= 50 ? "medium" : "low"
                          }`}>
                            {test.percentage}%
                          </span>
                        </td>
                        <td>{test.date}</td>
                        <td>{test.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "50px", 
            background: "#f8f9fa",
            borderRadius: "10px"
          }}>
            <p style={{ fontSize: "18px", color: "#666" }}>
              No tests found for this student.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
          border: 1px solid #eaeaea;
        }
        
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .chart-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
          font-weight: 600;
        }
        
        .chart-controls {
          display: flex;
          gap: 8px;
        }
        
        .chart-btn {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          color: #666;
        }
        
        .chart-btn:hover {
          background: #f5f5f5;
          border-color: #bbb;
        }
        
        .chart-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }
        
        .chart-container {
          height: 300px;
        }
        
        .chart-footer {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          font-size: 13px;
          color: #666;
          text-align: center;
        }
        
        .table-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
          border: 1px solid #eaeaea;
        }
        
        .table-card h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
          font-weight: 600;
        }
        
        .test-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        
        .test-table th {
          background: #f8f9fa;
          padding: 12px 15px;
          text-align: left;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
        }
        
        .test-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .test-table tr:hover {
          background: #f8f9fa;
        }
        
        .level-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .level-badge.beginner { background: #e3f2fd; color: #1565c0; }
        .level-badge.intermediate { background: #e8f5e9; color: #2e7d32; }
        .level-badge.advanced { background: #fff3e0; color: #ef6c00; }
        .level-badge.expert { background: #f3e5f5; color: #7b1fa2; }
        
        .percentage-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
        }
        
        .percentage-badge.high { background: #d4edda; color: #155724; }
        .percentage-badge.medium { background: #fff3cd; color: #856404; }
        .percentage-badge.low { background: #f8d7da; color: #721c24; }
        
        @media (max-width: 1024px) {
          .container {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .chart-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .chart-controls {
            width: 100%;
            justify-content: space-between;
          }
          
          .chart-btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}