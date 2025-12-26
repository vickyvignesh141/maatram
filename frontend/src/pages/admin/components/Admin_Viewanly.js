import React from "react";
import Admintop from "../../nav/admintop";

const AdminStudentAnalytics = () => {
  const analytics = [
    {
      year: 2020,
      batch: "2020–2024",
      admitted: 120,
      dropped: 15,
      passedOut: 90,
      placed: 72,
    },
    {
      year: 2021,
      batch: "2021–2025",
      admitted: 150,
      dropped: 18,
      passedOut: 0,
      placed: 0,
    },
    {
      year: 2022,
      batch: "2022–2026",
      admitted: 180,
      dropped: 22,
      passedOut: 0,
      placed: 0,
    },
    {
      year: 2023,
      batch: "2023–2027",
      admitted: 210,
      dropped: 10,
      passedOut: 0,
      placed: 0,
    },
  ];

  const totalAdmitted = analytics.reduce((a, b) => a + b.admitted, 0);
  const totalDropped = analytics.reduce((a, b) => a + b.dropped, 0);
  const totalPassed = analytics.reduce((a, b) => a + b.passedOut, 0);
  const totalPlaced = analytics.reduce((a, b) => a + b.placed, 0);

  return (
    <div className="analytics-page">
      <Admintop activeTab="analytics" />

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <h1>Student Analytics Dashboard</h1>
            <p className="subtitle">
              This section provides a clear year-wise and batch-wise overview of
              student admissions, academic progress, dropouts, and placements at
              Maatram.
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Active Batches</span>
              <span className="stat-value">{analytics.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">{totalAdmitted}</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="cards-container">
          <div className="cards">
            <div className="card admitted">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="card-content">
                <h3>Total Admitted</h3>
                <strong>{totalAdmitted}</strong>
                <span className="card-trend">+12% from last year</span>
              </div>
            </div>

            <div className="card dropped">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L4.258 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="card-content">
                <h3>Total Dropped</h3>
                <strong>{totalDropped}</strong>
                <span className="card-trend">{((totalDropped/totalAdmitted)*100).toFixed(1)}% of total</span>
              </div>
            </div>

            <div className="card passed">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="card-content">
                <h3>Total Passed Out</h3>
                <strong>{totalPassed}</strong>
                <span className="card-trend">80% success rate</span>
              </div>
            </div>

            <div className="card placed">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="card-content">
                <h3>Total Placed</h3>
                <strong>{totalPlaced}</strong>
                <span className="card-trend">{totalPassed > 0 ? `${((totalPlaced/totalPassed)*100).toFixed(1)}% placement` : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Table */}
        <div className="table-container">
          <div className="table-header">
            <h2>Batch-wise Student Data</h2>
            <div className="table-actions">
              <span className="total-records">{analytics.length} batches</span>
            </div>
          </div>
          <div className="table-box">
            <table>
              <thead>
                <tr>
                  <th>Admission Year</th>
                  <th>Batch</th>
                  <th>Admitted</th>
                  <th>Dropped Out</th>
                  <th>Passed Out</th>
                  <th>Placed</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                    <td>
                      <div className="year-cell">
                        <span className="year-badge">{row.year}</span>
                      </div>
                    </td>
                    <td>
                      <span className="batch-label">{row.batch}</span>
                    </td>
                    <td>
                      <div className="metric-cell admitted-metric">
                        <span className="metric-value">{row.admitted}</span>
                      </div>
                    </td>
                    <td>
                      <div className="metric-cell dropped-metric">
                        <span className="metric-value">{row.dropped}</span>
                        {row.admitted > 0 && (
                          <span className="metric-percentage">
                            ({((row.dropped/row.admitted)*100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="metric-cell passed-metric">
                        <span className="metric-value">{row.passedOut}</span>
                        {row.admitted > 0 && (
                          <span className="metric-percentage">
                            ({((row.passedOut/row.admitted)*100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="metric-cell placed-metric">
                        <span className="metric-value">{row.placed}</span>
                        {row.passedOut > 0 && (
                          <span className="metric-percentage">
                            ({((row.placed/row.passedOut)*100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="note-container">
          <div className="note">
            <div className="note-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="note-content">
              <h3>Analytics Note</h3>
              <p>
                Placement and passed-out data are available only for completed batches. 
                Ongoing batches will be updated periodically as students progress through the program.
                <span className="update-info"> Last updated: Today, 10:30 AM</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .analytics-page {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Header Styles */
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 2.5rem;
          color: white;
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
          position: relative;
          overflow: hidden;
        }

        .header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.5;
        }

        .header-content {
          max-width: 600px;
          position: relative;
          z-index: 1;
        }

        .header h1 {
          margin: 0;
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          background: linear-gradient(to right, #ffffff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          margin-top: 1rem;
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          font-weight: 400;
        }

        .header-stats {
          display: flex;
          gap: 3rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
        }

        /* Cards Container */
        .cards-container {
          margin-bottom: 3rem;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background: white;
          padding: 1.75rem;
          border-radius: 16px;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.5);
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent 0%, currentColor 50%, transparent 100%);
          opacity: 0.2;
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .card-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-icon svg {
          width: 28px;
          height: 28px;
          stroke-width: 1.5;
        }

        .admitted .card-icon {
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          color: white;
        }

        .dropped .card-icon {
          background: linear-gradient(135deg, #ef4444, #f87171);
          color: white;
        }

        .passed .card-icon {
          background: linear-gradient(135deg, #10b981, #34d399);
          color: white;
        }

        .placed .card-icon {
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          color: white;
        }

        .card-content {
          flex: 1;
        }

        .card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card strong {
          font-size: 2.2rem;
          font-weight: 700;
          display: block;
          margin-bottom: 0.25rem;
          line-height: 1;
        }

        .admitted strong { color: #2563eb; }
        .dropped strong { color: #dc2626; }
        .passed strong { color: #059669; }
        .placed strong { color: #7c3aed; }

        .card-trend {
          font-size: 0.85rem;
          color: #9ca3af;
          font-weight: 500;
        }

        /* Table Container */
        .table-container {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
        }

        .table-header {
          padding: 1.75rem 2rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to right, #f9fafb, #ffffff);
        }

        .table-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .table-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .total-records {
          background: #3b82f6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .table-box {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
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
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f3f4f6;
          text-align: left;
          vertical-align: middle;
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

        .year-badge {
          background: #3b82f6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          min-width: 70px;
          text-align: center;
        }

        .batch-label {
          font-weight: 500;
          color: #1f2937;
          font-size: 1.1rem;
        }

        .metric-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-value {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .admitted-metric .metric-value { color: #2563eb; }
        .dropped-metric .metric-value { color: #dc2626; }
        .passed-metric .metric-value { color: #059669; }
        .placed-metric .metric-value { color: #7c3aed; }

        .metric-percentage {
          font-size: 0.85rem;
          color: #9ca3af;
          font-weight: 500;
        }

        /* Note Container */
        .note-container {
          margin-top: 2rem;
        }

        .note {
          background: linear-gradient(135deg, #fff7ed, #fed7aa);
          border-left: 4px solid #f97316;
          padding: 1.75rem;
          border-radius: 16px;
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          box-shadow: 0 10px 30px rgba(249, 115, 22, 0.1);
        }

        .note-icon {
          width: 48px;
          height: 48px;
          background: #f97316;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
        }

        .note-icon svg {
          width: 24px;
          height: 24px;
          stroke-width: 2;
        }

        .note-content h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #92400e;
        }

        .note-content p {
          margin: 0;
          color: #92400e;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .update-info {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.85rem;
          opacity: 0.8;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .container {
            padding: 1.5rem;
          }
          
          .cards {
            grid-template-columns: repeat(2, 1fr);
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

          .subtitle {
            font-size: 1rem;
          }

          .header-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .cards {
            grid-template-columns: 1fr;
          }

          .card {
            padding: 1.5rem;
          }

          .table-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          th, td {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .header h1 {
            font-size: 1.5rem;
          }

          .card strong {
            font-size: 1.8rem;
          }

          .card-icon {
            width: 48px;
            height: 48px;
          }

          .card-icon svg {
            width: 24px;
            height: 24px;
          }

          .year-badge {
            min-width: 60px;
            padding: 0.375rem 0.75rem;
          }

          .batch-label {
            font-size: 1rem;
          }
        }

        /* Animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header, .card, .table-container, .note {
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:nth-child(1) { animation-delay: 0.1s; }
        .card:nth-child(2) { animation-delay: 0.2s; }
        .card:nth-child(3) { animation-delay: 0.3s; }
        .card:nth-child(4) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default AdminStudentAnalytics;