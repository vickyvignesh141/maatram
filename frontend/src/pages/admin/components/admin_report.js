import React, { useState, useEffect } from "react";
import Admintop from "../../nav/admintop";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line 
} from 'recharts';

const sangamamData = [
  {
    year: 2005,
    totalStudents: 300,
    attended: 240,
    notAttended: 60,
    averagePercentage: 80,
    chiefGuests: ["Dr. A. P. J. Abdul Kalam", "Prof. R. Narayanan"],
    events: [
      { name: "Cultural Dance", winner: "Chennai College", participants: 45 },
      { name: "Technical Quiz", winner: "Madurai Institute", participants: 32 },
      { name: "Debate Competition", winner: "Coimbatore University", participants: 28 },
      { name: "Music Festival", winner: "Trichy Arts College", participants: 56 },
    ],
    attendees: ["Arun", "Priya", "Karthik", "Divya", "Rajesh", "Deepa"],
    budget: 125000,
    venue: "Main Auditorium",
    feedbackScore: 4.2,
  },
  {
    year: 2006,
    totalStudents: 350,
    attended: 290,
    notAttended: 60,
    averagePercentage: 83,
    chiefGuests: ["Dr. Mylsamy Annadurai"],
    events: [
      { name: "Drama", winner: "Coimbatore Arts College", participants: 38 },
      { name: "Hackathon", winner: "Trichy Engineering College", participants: 65 },
      { name: "Art Exhibition", winner: "Madurai Fine Arts", participants: 42 },
      { name: "Science Expo", winner: "Chennai Tech Institute", participants: 51 },
    ],
    attendees: ["Suresh", "Meena", "Vignesh", "Anitha", "Gopal", "Lakshmi"],
    budget: 142000,
    venue: "University Convention Center",
    feedbackScore: 4.5,
  },
  {
    year: 2007,
    totalStudents: 420,
    attended: 378,
    notAttended: 42,
    averagePercentage: 90,
    chiefGuests: ["Dr. Kiran Bedi", "Dr. R. Chidambaram"],
    events: [
      { name: "Robotics Workshop", winner: "Anna University", participants: 78 },
      { name: "Literary Fest", winner: "Presidency College", participants: 45 },
      { name: "Sports Meet", winner: "Loyola College", participants: 120 },
      { name: "Startup Pitch", winner: "IIT Madras Incubator", participants: 34 },
    ],
    attendees: ["Rahul", "Swathi", "Manoj", "Geetha", "Vinod", "Chitra"],
    budget: 168000,
    venue: "Sports Complex & Auditorium",
    feedbackScore: 4.7,
  },
  {
    year: 2008,
    totalStudents: 380,
    attended: 323,
    notAttended: 57,
    averagePercentage: 85,
    chiefGuests: ["Narayana Murthy", "Dr. Tessy Thomas"],
    events: [
      { name: "AI Symposium", winner: "PSG College", participants: 89 },
      { name: "Cultural Night", winner: "Women's Christian College", participants: 67 },
      { name: "Case Study", winner: "XLRI Jamshedpur", participants: 41 },
      { name: "Film Making", winner: "FTII Pune", participants: 28 },
    ],
    attendees: ["Anand", "Pooja", "Satish", "Rekha", "Dinesh", "Shalini"],
    budget: 155000,
    venue: "International Convention Center",
    feedbackScore: 4.4,
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminSangamamAnalytics = () => {
  const [selectedYear, setSelectedYear] = useState(sangamamData[sangamamData.length - 1]);
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' or 'comparison'
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(sangamamData);

  useEffect(() => {
    if (searchTerm) {
      const filtered = sangamamData.filter(year => 
        year.year.toString().includes(searchTerm) ||
        year.chiefGuests.some(guest => 
          guest.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        year.events.some(event => 
          event.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(sangamamData);
    }
  }, [searchTerm]);

  const calculateStatistics = () => {
    const totalYears = sangamamData.length;
    const totalParticipants = sangamamData.reduce((sum, year) => sum + year.totalStudents, 0);
    const avgAttendance = sangamamData.reduce((sum, year) => sum + year.averagePercentage, 0) / totalYears;
    const highestAttendance = Math.max(...sangamamData.map(year => year.averagePercentage));
    const totalBudget = sangamamData.reduce((sum, year) => sum + year.budget, 0);
    
    return { totalYears, totalParticipants, avgAttendance, highestAttendance, totalBudget };
  };

  const stats = calculateStatistics();

  const attendanceData = sangamamData.map(year => ({
    year: year.year,
    attended: year.attended,
    notAttended: year.notAttended,
    percentage: year.averagePercentage,
  }));

  const eventParticipationData = selectedYear.events.map(event => ({
    name: event.name,
    participants: event.participants,
  }));

  const yearlyComparisonData = sangamamData.map(year => ({
    year: year.year,
    attendance: year.averagePercentage,
    budget: year.budget / 1000,
    feedback: year.feedbackScore,
  }));

  return (
    <div className="admin-sangamam-analytics">
      <Admintop activeTab="sangamam" />
      
      <div className="container">
        {/* Header with Stats */}
        <div className="header-section">
          <div className="header-main">
            <h1>Sangamam Annual Fest Analytics Dashboard</h1>
            <p className="subtitle">
              Comprehensive analytics and insights for Sangamam cultural fest management
              and performance tracking across years.
            </p>
          </div>
          
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.totalYears}</div>
              <div className="stat-label">Total Years</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalParticipants.toLocaleString()}</div>
              <div className="stat-label">Total Participants</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.avgAttendance.toFixed(1)}%</div>
              <div className="stat-label">Avg Attendance</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">₹{(stats.totalBudget / 100000).toFixed(1)}L</div>
              <div className="stat-label">Total Budget</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by year, guest, or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'detailed' ? 'active' : ''}`}
              onClick={() => setViewMode('detailed')}
            >
              Detailed View
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'comparison' ? 'active' : ''}`}
              onClick={() => setViewMode('comparison')}
            >
              Year Comparison
            </button>
          </div>
        </div>

        {viewMode === 'detailed' ? (
          <>
            {/* Year Selection */}
            <div className="year-selection">
              <h3>Select Year for Detailed Analysis</h3>
              <div className="year-grid">
                {filteredData.map(year => (
                  <div
                    key={year.year}
                    className={`year-card ${selectedYear.year === year.year ? 'selected' : ''}`}
                    onClick={() => setSelectedYear(year)}
                  >
                    <div className="year-header">
                      <h3>Sangamam {year.year}</h3>
                      <span className="attendance-badge">{year.averagePercentage}%</span>
                    </div>
                    <div className="year-stats">
                      <div className="stat">
                        <span className="stat-label">Students</span>
                        <span className="stat-value">{year.totalStudents}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Budget</span>
                        <span className="stat-value">₹{(year.budget/1000).toFixed(0)}K</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Events</span>
                        <span className="stat-value">{year.events.length}</span>
                      </div>
                    </div>
                    <div className="year-venue">{year.venue}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Analytics */}
            {selectedYear && (
              <div className="detailed-analytics">
                <div className="analytics-header">
                  <h2>Sangamam {selectedYear.year} - Comprehensive Analysis</h2>
                  <div className="year-rating">
                    <span className="rating-value">{selectedYear.feedbackScore}/5.0</span>
                    <span className="rating-label">Feedback Score</span>
                  </div>
                </div>

                {/* Attendance Overview */}
                <div className="analytics-section">
                  <h3>Attendance Overview</h3>
                  <div className="attendance-overview">
                    <div className="attendance-stats">
                      <div className="attendance-stat">
                        <div className="stat-number">{selectedYear.attended}</div>
                        <div className="stat-desc">Students Attended</div>
                        <div className="stat-percentage">({selectedYear.averagePercentage}%)</div>
                      </div>
                      <div className="attendance-stat">
                        <div className="stat-number">{selectedYear.notAttended}</div>
                        <div className="stat-desc">Not Attended</div>
                        <div className="stat-percentage">({(100 - selectedYear.averagePercentage)}%)</div>
                      </div>
                      <div className="attendance-stat">
                        <div className="stat-number">{selectedYear.totalStudents}</div>
                        <div className="stat-desc">Total Students</div>
                      </div>
                    </div>
                    
                    <div className="attendance-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Attended', value: selectedYear.attended },
                              { name: 'Not Attended', value: selectedYear.notAttended },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill="#4CAF50" />
                            <Cell fill="#F44336" />
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Events Analytics */}
                <div className="analytics-section">
                  <h3>Event Participation</h3>
                  <div className="events-chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={eventParticipationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="participants" fill="#2196F3" name="Participants" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chief Guests & Details */}
                <div className="details-grid">
                  <div className="detail-card">
                    <h4>Chief Guests</h4>
                    <ul className="guest-list">
                      {selectedYear.chiefGuests.map((guest, index) => (
                        <li key={index} className="guest-item">
                          <span className="guest-name">{guest}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="detail-card">
                    <h4>Event Winners</h4>
                    <div className="winners-list">
                      {selectedYear.events.map((event, index) => (
                        <div key={index} className="winner-item">
                          <span className="event-name">{event.name}</span>
                          <span className="winner-name">{event.winner}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="detail-card">
                    <h4>Financial Overview</h4>
                    <div className="financial-details">
                      <div className="financial-item">
                        <span>Total Budget</span>
                        <span className="amount">₹{selectedYear.budget.toLocaleString()}</span>
                      </div>
                      <div className="financial-item">
                        <span>Cost per Student</span>
                        <span className="amount">₹{(selectedYear.budget / selectedYear.totalStudents).toFixed(0)}</span>
                      </div>
                      <div className="financial-item">
                        <span>Venue</span>
                        <span className="venue">{selectedYear.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sample Attendees */}
                <div className="analytics-section">
                  <h3>Sample Attendees ({selectedYear.attendees.length})</h3>
                  <div className="attendees-list">
                    {selectedYear.attendees.map((attendee, index) => (
                      <span key={index} className="attendee-tag">{attendee}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Year Comparison View */
          <div className="comparison-view">
            <h2>Year-wise Comparison</h2>
            
            <div className="comparison-charts">
              <div className="chart-container">
                <h4>Attendance Trend</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="percentage" stroke="#4CAF50" name="Attendance %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h4>Yearly Performance Metrics</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={yearlyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="budget" fill="#2196F3" name="Budget (K)" />
                    <Bar yAxisId="right" dataKey="feedback" fill="#FF9800" name="Feedback Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="comparison-table">
              <h4>Detailed Year Comparison</h4>
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Total Students</th>
                    <th>Attendance %</th>
                    <th>Budget (₹)</th>
                    <th>Events</th>
                    <th>Feedback</th>
                    <th>Chief Guests</th>
                  </tr>
                </thead>
                <tbody>
                  {sangamamData.map(year => (
                    <tr key={year.year}>
                      <td>{year.year}</td>
                      <td>{year.totalStudents}</td>
                      <td>
                        <div className="percentage-bar">
                          <div 
                            className="percentage-fill" 
                            style={{ width: `${year.averagePercentage}%` }}
                          >
                            {year.averagePercentage}%
                          </div>
                        </div>
                      </td>
                      <td>₹{year.budget.toLocaleString()}</td>
                      <td>{year.events.length}</td>
                      <td>
                        <div className="feedback-score">
                          {year.feedbackScore}
                          <div className="stars">{"★".repeat(Math.floor(year.feedbackScore))}</div>
                        </div>
                      </td>
                      <td>{year.chiefGuests.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .admin-sangamam-analytics {
          background: #f5f7fa;
          min-height: 100vh;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        /* Header Section */
        .header-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          color: white;
        }

        .header-main h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 600;
        }

        .subtitle {
          margin-top: 0.5rem;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 1.2rem;
          border-radius: 8px;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        /* Controls */
        .controls-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 300px;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .view-toggle {
          display: flex;
          gap: 0.5rem;
          background: white;
          padding: 0.25rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .toggle-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }

        .toggle-btn.active {
          background: #667eea;
          color: white;
          box-shadow: 0 2px 4px rgba(102, 126, 234, 0.4);
        }

        /* Year Selection */
        .year-selection {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .year-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .year-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.2rem;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .year-card:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .year-card.selected {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
        }

        .year-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .year-header h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #333;
        }

        .attendance-badge {
          background: #4CAF50;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .year-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }

        .year-venue {
          font-size: 0.9rem;
          color: #666;
          padding-top: 0.5rem;
          border-top: 1px solid #eee;
        }

        /* Detailed Analytics */
        .detailed-analytics {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .analytics-header h2 {
          margin: 0;
          color: #333;
        }

        .year-rating {
          text-align: center;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          color: white;
          font-weight: 600;
        }

        .rating-value {
          display: block;
          font-size: 1.5rem;
        }

        .rating-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .analytics-section {
          margin-bottom: 2.5rem;
        }

        .analytics-section h3 {
          margin-bottom: 1rem;
          color: #444;
          font-size: 1.3rem;
        }

        .attendance-overview {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          align-items: center;
        }

        .attendance-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .attendance-stat {
          text-align: center;
          padding: 1.5rem;
          border-radius: 8px;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .stat-desc {
          color: #666;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }

        .stat-percentage {
          color: #888;
          font-size: 0.85rem;
        }

        /* Details Grid */
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .detail-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid #e9ecef;
        }

        .detail-card h4 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #444;
        }

        .guest-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .guest-item {
          padding: 0.75rem;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .guest-item:last-child {
          border-bottom: none;
        }

        .guest-name {
          flex: 1;
          color: #333;
        }

        .winners-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .winner-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border-radius: 6px;
          border: 1px solid #eee;
        }

        .event-name {
          font-weight: 500;
          color: #333;
        }

        .winner-name {
          color: #667eea;
          font-weight: 600;
        }

        .financial-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .financial-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eee;
        }

        .financial-item:last-child {
          border-bottom: none;
        }

        .amount {
          font-weight: 600;
          color: #333;
        }

        .venue {
          color: #667eea;
          font-weight: 500;
        }

        /* Attendees */
        .attendees-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .attendee-tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          border: 1px solid #bbdefb;
        }

        /* Comparison View */
        .comparison-view {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .comparison-view h2 {
          margin-top: 0;
          margin-bottom: 2rem;
          color: #333;
        }

        .comparison-charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-container {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .chart-container h4 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #444;
        }

        .comparison-table {
          margin-top: 2rem;
        }

        .comparison-table h4 {
          margin-bottom: 1rem;
          color: #444;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        th {
          background: #f8f9fa;
          font-weight: 600;
          color: #444;
        }

        tr:hover {
          background: #f8f9fa;
        }

        .percentage-bar {
          width: 100%;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
          height: 24px;
        }

        .percentage-fill {
          background: linear-gradient(90deg, #4CAF50, #8BC34A);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
          min-width: 50px;
          padding: 0 8px;
        }

        .feedback-score {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stars {
          color: #FFD700;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .header-main h1 {
            font-size: 1.5rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .quick-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .controls-section {
            flex-direction: column;
          }

          .search-box {
            min-width: 100%;
          }

          .attendance-overview {
            grid-template-columns: 1fr;
          }

          .attendance-stats {
            grid-template-columns: repeat(3, 1fr);
          }

          .comparison-charts {
            grid-template-columns: 1fr;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          table {
            display: block;
            overflow-x: auto;
          }
        }

        @media (max-width: 480px) {
          .year-grid {
            grid-template-columns: 1fr;
          }

          .attendance-stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .stat-value {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSangamamAnalytics;