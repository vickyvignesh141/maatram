import React, { useState, useEffect, useMemo } from "react";
import Admintop from "../../nav/admintop";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  AreaChart, Area, RadialBarChart, RadialBar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  Search, Filter, Calendar, Users, TrendingUp, DollarSign, 
  Award, Star, ChevronDown, Download, TrendingDown, BarChart3,
  Activity, Target, Eye, RefreshCw
} from 'lucide-react';

const sangamamData = [
  {
    year: 2005,
    totalStudents: 300,
    attended: 240,
    notAttended: 60,
    averagePercentage: 80,
    chiefGuests: ["Dr. A. P. J. Abdul Kalam", "Prof. R. Narayanan"],
    events: [
      { name: "Cultural Dance", winner: "Chennai College", participants: 45, category: "Cultural" },
      { name: "Technical Quiz", winner: "Madurai Institute", participants: 32, category: "Technical" },
      { name: "Debate Competition", winner: "Coimbatore University", participants: 28, category: "Academic" },
      { name: "Music Festival", winner: "Trichy Arts College", participants: 56, category: "Cultural" },
    ],
    attendees: ["Arun", "Priya", "Karthik", "Divya", "Rajesh", "Deepa"],
    budget: 125000,
    expenses: {
      venue: 40000,
      food: 30000,
      logistics: 25000,
      marketing: 20000,
      prizes: 10000
    },
    venue: "Main Auditorium",
    feedbackScore: 4.2,
    theme: "Cultural Fusion",
    duration: "3 days"
  },
  {
    year: 2006,
    totalStudents: 350,
    attended: 290,
    notAttended: 60,
    averagePercentage: 83,
    chiefGuests: ["Dr. Mylsamy Annadurai"],
    events: [
      { name: "Drama", winner: "Coimbatore Arts College", participants: 38, category: "Cultural" },
      { name: "Hackathon", winner: "Trichy Engineering College", participants: 65, category: "Technical" },
      { name: "Art Exhibition", winner: "Madurai Fine Arts", participants: 42, category: "Cultural" },
      { name: "Science Expo", winner: "Chennai Tech Institute", participants: 51, category: "Academic" },
    ],
    attendees: ["Suresh", "Meena", "Vignesh", "Anitha", "Gopal", "Lakshmi"],
    budget: 142000,
    expenses: {
      venue: 45000,
      food: 35000,
      logistics: 30000,
      marketing: 22000,
      prizes: 10000
    },
    venue: "University Convention Center",
    feedbackScore: 4.5,
    theme: "Innovation & Creativity",
    duration: "3 days"
  },
  {
    year: 2007,
    totalStudents: 420,
    attended: 378,
    notAttended: 42,
    averagePercentage: 90,
    chiefGuests: ["Dr. Kiran Bedi", "Dr. R. Chidambaram"],
    events: [
      { name: "Robotics Workshop", winner: "Anna University", participants: 78, category: "Technical" },
      { name: "Literary Fest", winner: "Presidency College", participants: 45, category: "Academic" },
      { name: "Sports Meet", winner: "Loyola College", participants: 120, category: "Sports" },
      { name: "Startup Pitch", winner: "IIT Madras Incubator", participants: 34, category: "Technical" },
    ],
    attendees: ["Rahul", "Swathi", "Manoj", "Geetha", "Vinod", "Chitra"],
    budget: 168000,
    expenses: {
      venue: 55000,
      food: 40000,
      logistics: 35000,
      marketing: 25000,
      prizes: 13000
    },
    venue: "Sports Complex & Auditorium",
    feedbackScore: 4.7,
    theme: "Technology & Sports",
    duration: "4 days"
  },
  {
    year: 2008,
    totalStudents: 380,
    attended: 323,
    notAttended: 57,
    averagePercentage: 85,
    chiefGuests: ["Narayana Murthy", "Dr. Tessy Thomas"],
    events: [
      { name: "AI Symposium", winner: "PSG College", participants: 89, category: "Technical" },
      { name: "Cultural Night", winner: "Women's Christian College", participants: 67, category: "Cultural" },
      { name: "Case Study", winner: "XLRI Jamshedpur", participants: 41, category: "Academic" },
      { name: "Film Making", winner: "FTII Pune", participants: 28, category: "Cultural" },
    ],
    attendees: ["Anand", "Pooja", "Satish", "Rekha", "Dinesh", "Shalini"],
    budget: 155000,
    expenses: {
      venue: 50000,
      food: 35000,
      logistics: 30000,
      marketing: 23000,
      prizes: 17000
    },
    venue: "International Convention Center",
    feedbackScore: 4.4,
    theme: "Digital Renaissance",
    duration: "3 days"
  },
  {
    year: 2009,
    totalStudents: 450,
    attended: 405,
    notAttended: 45,
    averagePercentage: 90,
    chiefGuests: ["Dr. Kasturirangan", "Ms. Sudha Murthy"],
    events: [
      { name: "AI Symposium", winner: "PSG College", participants: 92, category: "Technical" },
      { name: "Cultural Night", winner: "Women's Christian College", participants: 71, category: "Cultural" },
      { name: "Case Study", winner: "XLRI Jamshedpur", participants: 48, category: "Academic" },
      { name: "Film Making", winner: "FTII Pune", participants: 35, category: "Cultural" },
    ],
    attendees: ["Ravi", "Shweta", "Kumar", "Nisha", "Prakash", "Radha"],
    budget: 175000,
    expenses: {
      venue: 58000,
      food: 42000,
      logistics: 38000,
      marketing: 27000,
      prizes: 20000
    },
    venue: "International Convention Center",
    feedbackScore: 4.6,
    theme: "Sustainable Innovation",
    duration: "3 days"
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
const CATEGORY_COLORS = {
  Cultural: '#FF6B6B',
  Technical: '#4ECDC4',
  Academic: '#45B7D1',
  Sports: '#96CEB4'
};

const AdminSangamamAnalytics = () => {
  const [selectedYear, setSelectedYear] = useState(sangamamData[sangamamData.length - 1]);
  const [viewMode, setViewMode] = useState('detailed');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('year');
  const [exportLoading, setExportLoading] = useState(false);

  // Memoized calculations
  const stats = useMemo(() => {
    const totalYears = sangamamData.length;
    const totalParticipants = sangamamData.reduce((sum, year) => sum + year.totalStudents, 0);
    const avgAttendance = sangamamData.reduce((sum, year) => sum + year.averagePercentage, 0) / totalYears;
    const highestAttendance = Math.max(...sangamamData.map(year => year.averagePercentage));
    const totalBudget = sangamamData.reduce((sum, year) => sum + year.budget, 0);
    const avgBudget = totalBudget / totalYears;
    const growthRate = ((sangamamData[sangamamData.length - 1].totalStudents - sangamamData[0].totalStudents) / sangamamData[0].totalStudents * 100).toFixed(1);
    
    return { 
      totalYears, 
      totalParticipants, 
      avgAttendance, 
      highestAttendance, 
      totalBudget,
      avgBudget,
      growthRate 
    };
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...sangamamData];

    // Apply search filter
    if (searchTerm) {
      data = data.filter(year => 
        year.year.toString().includes(searchTerm) ||
        year.chiefGuests.some(guest => 
          guest.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        year.events.some(event => 
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        year.theme.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      data = data.filter(year => 
        year.events.some(event => event.category === categoryFilter)
      );
    }

    // Apply sorting
    data.sort((a, b) => {
      switch(sortBy) {
        case 'year': return b.year - a.year;
        case 'attendance': return b.averagePercentage - a.averagePercentage;
        case 'budget': return b.budget - a.budget;
        case 'feedback': return b.feedbackScore - a.feedbackScore;
        default: return 0;
      }
    });

    return data;
  }, [searchTerm, categoryFilter, sortBy]);

  // Chart data calculations
  const attendanceData = useMemo(() => 
    sangamamData.map(year => ({
      year: year.year,
      attended: year.attended,
      notAttended: year.notAttended,
      percentage: year.averagePercentage,
      growth: year.year > 2005 ? 
        ((year.totalStudents - sangamamData.find(y => y.year === year.year - 1)?.totalStudents || 0) / 
         sangamamData.find(y => y.year === year.year - 1)?.totalStudents || 0 * 100).toFixed(1) : 0
    })), []);

  const budgetData = useMemo(() => 
    sangamamData.map(year => ({
      year: year.year,
      budget: year.budget / 1000,
      attendees: year.totalStudents,
      costPerStudent: (year.budget / year.totalStudents).toFixed(0)
    })), []);

  const categoryData = useMemo(() => {
    const categories = {};
    sangamamData.forEach(year => {
      year.events.forEach(event => {
        categories[event.category] = (categories[event.category] || 0) + 1;
      });
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, []);

  const expensesData = useMemo(() => 
    Object.entries(selectedYear.expenses).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: ((value / selectedYear.budget) * 100).toFixed(1)
    })), [selectedYear]);

  // Handle export
  const handleExport = async () => {
    setExportLoading(true);
    try {
      const headers = ['Year', 'Theme', 'Total Students', 'Attendance %', 'Budget', 'Feedback', 'Duration'];
      const csvData = sangamamData.map(year => [
        year.year,
        year.theme,
        year.totalStudents,
        year.averagePercentage,
        year.budget,
        year.feedbackScore,
        year.duration
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sangamam_analytics_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="admin-sangamam-analytics">
      <Admintop activeTab="sangamam" />
      
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>
              <Activity size={32} />
              Sangamam Fest Analytics Dashboard
            </h1>
            <p className="subtitle">
            </p>
          </div>
          
          <button 
            className="export-btn"
            onClick={handleExport}
            disabled={exportLoading}
          >
            <Download size={18} />
            {exportLoading ? 'Exporting...' : 'Export Report'}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalYears} Years</div>
              <div className="stat-label">Historical Data</div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalParticipants.toLocaleString()}</div>
              <div className="stat-label">Total Participants</div>
              <div className="stat-trend positive">
                <TrendingUp size={14} />
                {stats.growthRate}% growth
              </div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.avgAttendance.toFixed(1)}%</div>
              <div className="stat-label">Avg Attendance</div>
              <div className="stat-trend positive">
                <Target size={14} />
                {stats.highestAttendance}% peak
              </div>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">₹{(stats.totalBudget / 100000).toFixed(1)}L</div>
              <div className="stat-label">Total Investment</div>
              <div className="stat-trend">
                ₹{(stats.avgBudget / 1000).toFixed(0)}K avg/year
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="controls-section">
          <div className="filters-grid">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search by year, theme, guest, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
            
            <div className="filter-group">
              <Filter size={18} />
              <select 
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Cultural">Cultural</option>
                <option value="Technical">Technical</option>
                <option value="Academic">Academic</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
            
            <div className="filter-group">
              <Eye size={18} />
              <select 
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="year">Sort by: Year</option>
                <option value="attendance">Sort by: Attendance</option>
                <option value="budget">Sort by: Budget</option>
                <option value="feedback">Sort by: Feedback</option>
              </select>
            </div>
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
            <button 
              className={`toggle-btn ${viewMode === 'trends' ? 'active' : ''}`}
              onClick={() => setViewMode('trends')}
            >
              Trends & Insights
            </button>
          </div>
        </div>

        {viewMode === 'detailed' ? (
          <DetailedView 
            selectedYear={selectedYear}
            filteredData={filteredData}
            setSelectedYear={setSelectedYear}
            expensesData={expensesData}
          />
        ) : viewMode === 'comparison' ? (
          <ComparisonView 
            sangamamData={sangamamData}
            attendanceData={attendanceData}
            budgetData={budgetData}
          />
        ) : (
          <TrendsView 
            sangamamData={sangamamData}
            categoryData={categoryData}
            attendanceData={attendanceData}
          />
        )}
      </div>

      <style jsx>{`
        .admin-sangamam-analytics {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        /* Header */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 2rem;
        }

        .header-content {
          flex: 1;
        }

        .header-content h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
          color:white;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .subtitle {
          margin: 0;
          font-size: 1.1rem;
          color: #718096;
          line-height: 1.6;
          max-width: 800px;
        }

        .export-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .export-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .export-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Quick Stats */
        .quick-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-card.primary { border-left: 4px solid #667eea; }
        .stat-card.success { border-left: 4px solid #10b981; }
        .stat-card.warning { border-left: 4px solid #f59e0b; }
        .stat-card.info { border-left: 4px solid #3b82f6; }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-card.primary .stat-icon { background: #e0e7ff; color: #667eea; }
        .stat-card.success .stat-icon { background: #d1fae5; color: #10b981; }
        .stat-card.warning .stat-icon { background: #fef3c7; color: #f59e0b; }
        .stat-card.info .stat-icon { background: #dbeafe; color: #3b82f6; }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .stat-trend {
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-trend.positive {
          color: #10b981;
        }

        /* Filters */
        .controls-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 1024px) {
          .filters-grid {
            grid-template-columns: 1fr;
          }
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.25rem;
          font-size: 1.25rem;
          line-height: 1;
        }

        .clear-search:hover {
          color: #6b7280;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f9fafb;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .filter-select {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 0.95rem;
          color: #374151;
          cursor: pointer;
        }

        .view-toggle {
          display: flex;
          gap: 0.5rem;
          background: #f9fafb;
          padding: 0.25rem;
          border-radius: 8px;
          width: fit-content;
          margin: 0 auto;
        }

        .toggle-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .toggle-btn.active {
          background: white;
          color: #667eea;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

// Detailed View Component
const DetailedView = ({ selectedYear, filteredData, setSelectedYear, expensesData }) => (
  <div className="detailed-view">
    {/* Year Selection */}
    <div className="year-selection-section">
      <h3>Select Year for Detailed Analysis</h3>
      <div className="year-cards-grid">
        {filteredData.map(year => (
          <div
            key={year.year}
            className={`year-card ${selectedYear.year === year.year ? 'selected' : ''}`}
            onClick={() => setSelectedYear(year)}
          >
            <div className="year-header">
              <h4>Sangamam {year.year}</h4>
              <span className="theme-tag">{year.theme}</span>
            </div>
            <div className="year-metrics">
              <div className="metric">
                <Users size={16} />
                <span>{year.totalStudents} Students</span>
              </div>
              <div className="metric">
                <TrendingUp size={16} />
                <span>{year.averagePercentage}% Attendance</span>
              </div>
              <div className="metric">
                <DollarSign size={16} />
                <span>₹{(year.budget/1000).toFixed(0)}K Budget</span>
              </div>
            </div>
            <div className="year-footer">
              <span className="duration">{year.duration}</span>
              <div className="feedback">
                <Star size={14} fill="#fbbf24" />
                <span>{year.feedbackScore.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Year Details */}
    {selectedYear && (
      <div className="year-details">
        <div className="details-header">
          <div>
            <h2>Sangamam {selectedYear.year} - {selectedYear.theme}</h2>
            <p className="venue-info">{selectedYear.venue} • {selectedYear.duration}</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <div className="value">{selectedYear.averagePercentage}%</div>
              <div className="label">Attendance Rate</div>
            </div>
            <div className="stat">
              <div className="value">₹{(selectedYear.budget/1000).toFixed(0)}K</div>
              <div className="label">Total Budget</div>
            </div>
            <div className="stat">
              <div className="value">{selectedYear.feedbackScore.toFixed(1)}</div>
              <div className="label">Feedback Score</div>
            </div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="charts-grid">
          <div className="chart-card">
            <h4>Attendance Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Attended', value: selectedYear.attended, color: '#10b981' },
                    { name: 'Not Attended', value: selectedYear.notAttended, color: '#ef4444' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>Budget Allocation</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart 
                innerRadius="20%" 
                outerRadius="90%" 
                data={expensesData} 
                startAngle={180} 
                endAngle={0}
              >
                <PolarGrid />
                <PolarAngleAxis type="number" domain={[0, 100]} dataKey="value" />
                <RadialBar dataKey="value" background />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Events & Guests */}
        <div className="details-section">
          <div className="events-section">
            <h4>Event Highlights</h4>
            <div className="events-grid">
              {selectedYear.events.map((event, index) => (
                <div key={index} className="event-card">
                  <div className="event-header">
                    <span className="event-name">{event.name}</span>
                    <span 
                      className="event-category"
                      style={{ backgroundColor: CATEGORY_COLORS[event.category] }}
                    >
                      {event.category}
                    </span>
                  </div>
                  <div className="event-details">
                    <div className="winner">
                      <Award size={14} />
                      <span>{event.winner}</span>
                    </div>
                    <div className="participants">
                      <Users size={14} />
                      <span>{event.participants} participants</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="guests-section">
            <h4>Chief Guests</h4>
            <div className="guests-list">
              {selectedYear.chiefGuests.map((guest, index) => (
                <div key={index} className="guest-card">
                  <div className="guest-avatar">
                    {guest.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="guest-info">
                    <div className="guest-name">{guest}</div>
                    <div className="guest-year">{selectedYear.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

// Comparison View Component
const ComparisonView = ({ sangamamData, attendanceData, budgetData }) => (
  <div className="comparison-view">
    <h2>Year-wise Performance Comparison</h2>
    
    <div className="comparison-charts-grid">
      <div className="chart-card">
        <h4>Attendance Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="percentage" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Attendance %" 
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="growth" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Growth %" 
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h4>Budget & Participation</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={budgetData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="budget" 
              fill="#667eea" 
              stroke="#667eea" 
              name="Budget (K)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="attendees" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Participants"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="comparison-table-section">
      <h4>Detailed Performance Metrics</h4>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Theme</th>
              <th>Total Students</th>
              <th>Attendance %</th>
              <th>Budget (₹)</th>
              <th>Events</th>
              <th>Feedback</th>
              <th>Cost/Student</th>
            </tr>
          </thead>
          <tbody>
            {sangamamData.map(year => {
              const costPerStudent = (year.budget / year.totalStudents).toFixed(0);
              return (
                <tr key={year.year}>
                  <td>
                    <strong>{year.year}</strong>
                  </td>
                  <td>{year.theme}</td>
                  <td>{year.totalStudents}</td>
                  <td>
                    <div className="attendance-cell">
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ width: `${year.averagePercentage}%` }}
                        />
                      </div>
                      <span>{year.averagePercentage}%</span>
                    </div>
                  </td>
                  <td>₹{year.budget.toLocaleString()}</td>
                  <td>{year.events.length}</td>
                  <td>
                    <div className="feedback-cell">
                      <div className="stars">
                        {"★".repeat(Math.floor(year.feedbackScore))}
                        {"☆".repeat(5 - Math.floor(year.feedbackScore))}
                      </div>
                      <span>{year.feedbackScore.toFixed(1)}</span>
                    </div>
                  </td>
                  <td>₹{costPerStudent}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Trends View Component
const TrendsView = ({ sangamamData, categoryData, attendanceData }) => (
  <div className="trends-view">
    <h2>Trends & Insights</h2>
    
    <div className="insights-grid">
      <div className="insight-card">
        <h4>Event Categories Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="insight-card">
        <h4>Attendance Growth Pattern</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="attended" fill="#10b981" name="Attended" />
            <Bar dataKey="notAttended" fill="#ef4444" name="Not Attended" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="key-metrics">
      <h4>Performance Metrics</h4>
      <div className="metrics-grid">
        {sangamamData.map((year, index) => {
          const prevYear = sangamamData[index - 1];
          const attendanceGrowth = prevYear 
            ? (((year.averagePercentage - prevYear.averagePercentage) / prevYear.averagePercentage) * 100).toFixed(1)
            : '0.0';
          const budgetGrowth = prevYear 
            ? (((year.budget - prevYear.budget) / prevYear.budget) * 100).toFixed(1)
            : '0.0';
          
          return (
            <div key={year.year} className="metric-card">
              <div className="metric-header">
                <h5>Sangamam {year.year}</h5>
                <span className="theme">{year.theme}</span>
              </div>
              <div className="metric-body">
                <div className="metric-row">
                  <span>Attendance</span>
                  <span className={`value ${parseFloat(attendanceGrowth) > 0 ? 'positive' : 'negative'}`}>
                    {year.averagePercentage}%
                    {prevYear && (
                      <span className="trend">
                        {parseFloat(attendanceGrowth) > 0 ? '↗' : '↘'}
                        {Math.abs(parseFloat(attendanceGrowth))}%
                      </span>
                    )}
                  </span>
                </div>
                <div className="metric-row">
                  <span>Budget</span>
                  <span className={`value ${parseFloat(budgetGrowth) > 0 ? 'positive' : 'negative'}`}>
                    ₹{(year.budget/1000).toFixed(0)}K
                    {prevYear && (
                      <span className="trend">
                        {parseFloat(budgetGrowth) > 0 ? '↗' : '↘'}
                        {Math.abs(parseFloat(budgetGrowth))}%
                      </span>
                    )}
                  </span>
                </div>
                <div className="metric-row">
                  <span>Student Growth</span>
                  <span className="value">
                    {prevYear 
                      ? `${(((year.totalStudents - prevYear.totalStudents) / prevYear.totalStudents) * 100).toFixed(1)}%`
                      : 'New'
                    }
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// Add additional CSS for the components
const additionalStyles = `
  /* Detailed View Styles */
  .detailed-view {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .year-selection-section h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #2d3748;
  }

  .year-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .year-card {
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .year-card:hover {
    border-color: #cbd5e1;
    transform: translateY(-2px);
  }

  .year-card.selected {
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  }

  .year-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .year-header h4 {
    margin: 0;
    color: #2d3748;
  }

  .theme-tag {
    background: #e0e7ff;
    color: #667eea;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .year-metrics {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .metric {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #4b5563;
  }

  .year-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .duration {
    font-size: 0.85rem;
    color: #6b7280;
  }

  .feedback {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #f59e0b;
    font-weight: 600;
  }

  /* Year Details */
  .year-details {
    margin-top: 2rem;
  }

  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #f0f0f0;
  }

  .details-header h2 {
    margin: 0;
    color: #2d3748;
  }

  .venue-info {
    margin: 0.5rem 0 0 0;
    color: #6b7280;
  }

  .header-stats {
    display: flex;
    gap: 2rem;
  }

  .header-stats .stat {
    text-align: center;
  }

  .header-stats .value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #667eea;
  }

  .header-stats .label {
    font-size: 0.9rem;
    color: #6b7280;
  }

  /* Charts Grid */
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .chart-card {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .chart-card h4 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #374151;
  }

  /* Details Section */
  .details-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 1024px) {
    .details-section {
      grid-template-columns: 1fr;
    }
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .event-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .event-name {
    font-weight: 600;
    color: #374151;
  }

  .event-category {
    font-size: 0.75rem;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-weight: 500;
  }

  .event-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .winner, .participants {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #6b7280;
  }

  /* Guests Section */
  .guests-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .guest-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .guest-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
  }

  .guest-info {
    flex: 1;
  }

  .guest-name {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .guest-year {
    font-size: 0.85rem;
    color: #6b7280;
  }

  /* Comparison View Styles */
  .comparison-view, .trends-view {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .comparison-view h2, .trends-view h2 {
    margin-top: 0;
    margin-bottom: 2rem;
    color: #2d3748;
  }

  .comparison-charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .comparison-table-section {
    margin-top: 2rem;
  }

  .comparison-table-section h4 {
    margin-bottom: 1rem;
    color: #374151;
  }

  .table-container {
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
  }

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: #f8fafc;
    font-weight: 600;
    color: #374151;
    position: sticky;
    top: 0;
  }

  tr:hover {
    background: #f8fafc;
  }

  .attendance-cell {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .percentage-bar {
    flex: 1;
    height: 24px;
    background: #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
  }

  .percentage-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #34d399);
    min-width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .feedback-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .stars {
    color: #fbbf24;
  }

  /* Trends View Styles */
  .insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .key-metrics {
    margin-top: 2rem;
  }

  .key-metrics h4 {
    margin-bottom: 1.5rem;
    color: #374151;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .metric-card {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .metric-header {
    margin-bottom: 1rem;
  }

  .metric-header h5 {
    margin: 0 0 0.5rem 0;
    color: #2d3748;
  }

  .metric-header .theme {
    font-size: 0.85rem;
    color: #667eea;
    background: #e0e7ff;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
  }

  .metric-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .metric-row span:first-child {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .metric-row .value {
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .metric-row .value.positive {
    color: #10b981;
  }

  .metric-row .value.negative {
    color: #ef4444;
  }

  .metric-row .trend {
    font-size: 0.75rem;
    font-weight: 500;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .dashboard-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .quick-stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .charts-grid,
    .comparison-charts-grid,
    .insights-grid {
      grid-template-columns: 1fr;
    }

    .year-cards-grid {
      grid-template-columns: 1fr;
    }

    .header-stats {
      flex-direction: column;
      gap: 1rem;
    }

    .details-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }

  @media (max-width: 480px) {
    .quick-stats-grid {
      grid-template-columns: 1fr;
    }

    .year-cards-grid,
    .events-grid,
    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .toggle-btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }
`;

export default AdminSangamamAnalytics;

// Inject additional styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = additionalStyles;
  document.head.appendChild(style);
}