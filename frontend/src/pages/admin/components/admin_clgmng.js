import React, { useEffect, useState } from "react";
import Admintop from "../../nav/admintop";
import { Search, ChevronLeft, ChevronRight, Building2, Users, GraduationCap } from "lucide-react";

const AdminCollegeManagement = () => {
  const [activeTab] = useState("college_management");
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDepartments([
        { id: 1, name: "Computer Science & Engineering", totalStudents: 56, batches: ["2019-2023", "2020-2024", "2021-2025", "2022-2026"] },
        { id: 2, name: "Information Technology", totalStudents: 48, batches: ["2018-2022", "2019-2023", "2020-2024"] },
        { id: 3, name: "Electronics & Communication", totalStudents: 230, batches: ["2020-2023", "2021-2024", "2022-2025"] },
        { id: 4, name: "Electrical & Electronics", totalStudents: 24, batches: ["2018-2022", "2019-2023", "2020-2024", "2021-2025"] },
        { id: 5, name: "Mechanical Engineering", totalStudents: 87, batches: ["2019-2023", "2020-2024", "2021-2025"] },
        { id: 6, name: "Civil Engineering", totalStudents: 68, batches: ["2019-2023", "2020-2024", "2021-2025"] },
        { id: 7, name: "Artificial Intelligence & DS", totalStudents: 35, batches: ["2019-2023", "2020-2024"] },
        { id: 8, name: "Computer Science (AI & ML)", totalStudents: 53, batches: ["2020-2024", "2021-2025"] },
        { id: 9, name: "Computer Science (Cyber Security)", totalStudents: 92, batches: ["2019-2023", "2020-2024", "2021-2025"] },
        { id: 10, name: "Biomedical Engineering", totalStudents: 73, batches: ["2020-2024", "2021-2025"] },
        { id: 11, name: "Aerospace Engineering", totalStudents: 35, batches: ["2019-2023", "2020-2024"] },
        { id: 12, name: "Chemical Engineering", totalStudents: 51, batches: ["2020-2024", "2021-2025"] },
        { id: 13, name: "Biotechnology", totalStudents: 93, batches: ["2019-2023", "2020-2024"] },
        { id: 14, name: "Robotics & Automation", totalStudents: 45, batches: ["2020-2024", "2021-2025"] },
        { id: 15, name: "Mechatronics Engineering", totalStudents: 71, batches: ["2020-2024"] }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDepartments = filteredDepartments.slice(startIndex, startIndex + itemsPerPage);

  // Calculate total students across all departments
  const totalStudentsAllDepartments = departments.reduce((sum, dept) => sum + dept.totalStudents, 0);
  const averageStudents = Math.round(totalStudentsAllDepartments / departments.length);

  // Loading state
  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-spinner"></div>
        <p>Loading department information...</p>
      </div>
    );
  }

  return (
    <div className="admin-college-page">
      <Admintop activeTab={activeTab} />
      
      <div className="college-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-content">
            <div className="title-wrapper">
              <Building2 className="header-icon" />
              <h1 className="page-title">Department Management</h1>
            </div>
            <p className="page-subtitle">
              Manage and view department-wise student distribution and batch details
            </p>
          </div>
          
          <div className="stats-card">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <Users className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{totalStudentsAllDepartments.toLocaleString()}</div>
                <div className="stat-label">Total Students</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <GraduationCap className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{departments.length}</div>
                <div className="stat-label">Departments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search departments by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="results-info">
            Showing {currentDepartments.length} of {filteredDepartments.length} departments
          </div>
        </div>

        {/* Table Section */}
        <div className="table-section">
          <div className="table-wrapper">
            <table className="college-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Total Students</th>
                  <th>Active Batches</th>
                </tr>
              </thead>
              <tbody>
                {currentDepartments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="empty-state">
                      <div className="empty-content">
                        <Search size={40} />
                        <p>No departments found matching your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentDepartments.map((dept) => (
                    <tr key={dept.id} className="table-row">
                      <td>
                        <div className="college-name-cell">
                          <div className="college-name">{dept.name}</div>
                        </div>
                      </td>
                      <td>
                        <div className="students-cell">
                          <div className="student-count">{dept.totalStudents.toLocaleString()}</div>
                          <div className="student-label">students</div>
                        </div>
                      </td>
                      <td>
                        <div className="batches-cell">
                          {dept.batches.map((batch, index) => (
                            <span key={index} className="batch-tag">
                              {batch}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredDepartments.length > 0 && (
          <div className="pagination-section">
            <button
              className={`pagination-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            
            <div className="page-info">
              Page {currentPage} of {totalPages}
              <span className="total-info"> • {filteredDepartments.length} departments</span>
            </div>
            
            <button
              className={`pagination-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-college-page {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .college-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Header Section */
        .header-section {
          background: linear-gradient(135deg, #4a00e0 0%, #4a00e0 100%);
          border-radius: 16px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          color: white;
          box-shadow: 0 8px 32px rgba(10, 239, 102, 0.1);
        }

        .header-content {
          margin-bottom: 2rem;
        }

        .title-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .header-icon {
          width: 40px;
          height: 40px;
          color: #60a5fa;
        }

        .page-title {
          font-size: 2.25rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .page-subtitle {
          font-size: 1rem;
          color: #cbd5e1;
          margin: 0;
          font-weight: 400;
        }

        .stats-card {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.2s ease;
        }

        .stat-item:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.15);
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon {
          width: 24px;
          height: 24px;
          color: white;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #cbd5e1;
          font-weight: 500;
        }

        /* Search Section */
        .search-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .search-wrapper {
          position: relative;
          margin-bottom: 0.75rem;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          width: 20px;
          height: 20px;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          color: #1e293b;
          transition: all 0.2s ease;
          background: #f8fafc;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .results-info {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Table Section */
        .table-section {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .college-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .college-table thead {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }

        .college-table th {
          padding: 1.25rem 1.5rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .table-row {
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.2s ease;
        }

        .table-row:hover {
          background-color: #f8fafc;
        }

        .college-table td {
          padding: 1.5rem;
          vertical-align: top;
        }

        /* Cell Styles */
        .college-name-cell {
          display: flex;
          flex-direction: column;
        }

        .college-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 1.1rem;
          line-height: 1.4;
          margin-bottom: 0.25rem;
        }

        .students-cell {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .student-count {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 0.25rem;
        }

        .student-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .batches-cell {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .batch-tag {
          background: #e0f2fe;
          color: #0369a1;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        /* Empty State */
        .empty-state {
          padding: 4rem 2rem;
        }

        .empty-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #94a3b8;
        }

        .empty-content p {
          margin: 0;
          font-size: 1rem;
          font-weight: 500;
        }

        /* Pagination */
        .pagination-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          margin-top: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          color: #475569;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-btn:hover:not(.disabled) {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-1px);
        }

        .pagination-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          font-size: 0.875rem;
          color: #475569;
          font-weight: 600;
        }

        .total-info {
          color: #94a3b8;
          font-weight: 400;
        }

        /* Loader */
        .loader-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #475569;
        }

        .loader-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .college-container {
            padding: 1rem;
          }

          .header-section {
            padding: 1.5rem;
          }

          .page-title {
            font-size: 1.75rem;
          }

          .stats-card {
            grid-template-columns: 1fr;
          }

          .college-table th,
          .college-table td {
            padding: 1rem;
          }

          .pagination-section {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .page-info {
            order: -1;
          }
        }

        @media (max-width: 480px) {
          .header-icon {
            width: 32px;
            height: 32px;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .stat-item {
            padding: 1rem;
          }

          .stat-icon-wrapper {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminCollegeManagement;