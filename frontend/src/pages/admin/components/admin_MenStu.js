import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Admintop from "../../nav/admintop";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const AdminMentorAssignments = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 5;

  const assignments = [
    {
      id: 1,
      student: "Arun Kumar",
      studentId: "MAA00001",
      mentor: "Dr. Amit Patel",
      mentorId: "MAA10001",
      college: "IIT Bombay",
      status: "Active",
      assignedDate: "2024-01-15",
    },
    {
      id: 2,
      student: "Priya Singh",
      studentId: "MAA00002",
      mentor: "Prof. Sunita Rao",
      mentorId: "MAA10002",
      college: "NIT Trichy",
      status: "Completed",
      assignedDate: "2023-11-10",
    },
  ];

  const filtered = assignments.filter(
    a =>
      a.student.toLowerCase().includes(search.toLowerCase()) ||
      a.mentor.toLowerCase().includes(search.toLowerCase()) ||
      a.college.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const current = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="admin-page">
      <Admintop activeTab="assignments" />

      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>Student–Mentor Assignments</h1>
          <p>
            View and manage mentor assignments in a structured and professional
            manner.
          </p>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat">
            <strong>{assignments.length}</strong>
            <span>Total Assignments</span>
          </div>
          <div className="stat">
            <strong>
              {assignments.filter(a => a.status === "Active").length}
            </strong>
            <span>Active</span>
          </div>
          <div className="stat">
            <strong>
              {assignments.filter(a => a.status === "Completed").length}
            </strong>
            <span>Completed</span>
          </div>
        </div>

        {/* Search */}
        <div className="search-bar">
          <Search size={18} />
          <input
            placeholder="Search by student, mentor, or college"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Mentor</th>
                <th>College</th>
                <th>Status</th>
                <th>Assigned Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {current.map(row => (
                <tr key={row.id}>
                  <td>
                    {row.student}
                    <div className="sub">{row.studentId}</div>
                  </td>
                  <td>
                    {row.mentor}
                    <div className="sub">{row.mentorId}</div>
                  </td>
                  <td>{row.college}</td>
                  <td>
                    <span
                      className={`badge ${
                        row.status === "Active" ? "active" : "completed"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>{row.assignedDate}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/admin/assignment/${row.id}`)
                      }
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {current.length === 0 && (
            <div className="empty">No records found.</div>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span>
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .admin-page {
          background: #f8fafc;
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: auto;
          padding: 1.5rem;
        }

        .header {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .header h1 {
          margin: 0;
          font-size: 1.6rem;
        }

        .header p {
          margin-top: 0.5rem;
          color: #6b7280;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }

        .stat strong {
          font-size: 1.5rem;
          display: block;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .search-bar input {
          border: none;
          outline: none;
          width: 100%;
        }

        .table-box {
          background: white;
          border-radius: 8px;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
        }

        th {
          background: #f3f4f6;
          font-size: 0.9rem;
        }

        .sub {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .badge {
          padding: 0.3rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .badge.completed {
          background: #e0e7ff;
          color: #3730a3;
        }

        .view-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #2563eb;
        }

        .empty {
          padding: 2rem;
          text-align: center;
          color: #6b7280;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
        }

        .pagination button {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
          cursor: pointer;
        }

        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AdminMentorAssignments;
