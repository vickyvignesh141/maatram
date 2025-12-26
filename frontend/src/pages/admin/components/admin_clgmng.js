import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Admintop from "../../nav/admintop";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Building2
} from "lucide-react";

const AdminCollegeManagement = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("college_management");
  const [loading, setLoading] = useState(true);
  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    setTimeout(() => {
      setColleges([
        {
          id: 1,
          name: "Government College of Engineering, Salem",
          totalStudents: 420,
          batches: ["2019-2023", "2020-2024", "2021-2025"],
          placement: "Infosys, TCS, Wipro",
          partnership: "Active"
        },
        {
          id: 2,
          name: "Anna University Regional Campus, Coimbatore",
          totalStudents: 310,
          batches: ["2018-2022", "2019-2023"],
          placement: "Cognizant, Accenture",
          partnership: "Active"
        },
        {
          id: 3,
          name: "XYZ Arts and Science College",
          totalStudents: 185,
          batches: ["2020-2023", "2021-2024"],
          placement: "Local Industries",
          partnership: "Inactive"
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredColleges = colleges.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredColleges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentColleges = filteredColleges.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div style={loaderStyle}>
        <p>Loading college information...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Admintop activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>College Management</h1>
            <p style={subtitleStyle}>
              View college-wise student distribution and placement partnerships
            </p>
          </div>
          <Building2 size={34} color="#2563eb" />
        </div>

        {/* Search */}
        <div style={searchWrapper}>
          <Search size={18} style={searchIconStyle} />
          <input
            type="text"
            placeholder="Search by college name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        {/* Table */}
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadRow}>
                <th style={th}>College Name</th>
                <th style={th}>Total Students</th>
                <th style={th}>Batches (Year-wise)</th>
                <th style={th}>Placement Details</th>
                <th style={th}>Partnership</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentColleges.length === 0 ? (
                <tr>
                  <td colSpan="6" style={emptyCell}>
                    No college records found
                  </td>
                </tr>
              ) : (
                currentColleges.map(college => (
                  <tr key={college.id} style={tbodyRow}>
                    <td style={td}><strong>{college.name}</strong></td>
                    <td style={td}>{college.totalStudents}</td>
                    <td style={td}>{college.batches.join(", ")}</td>
                    <td style={td}>{college.placement}</td>
                    <td style={td}>
                      <span
                        style={{
                          ...badgeStyle,
                          backgroundColor:
                            college.partnership === "Active"
                              ? "#dcfce7"
                              : "#fee2e2"
                        }}
                      >
                        {college.partnership}
                      </span>
                    </td>
                    <td style={td}>
                      <Eye
                        size={18}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/admin/college/${college.id}`)
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={paginationStyle}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            style={pageBtn}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span style={{ fontSize: "0.9rem" }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            style={pageBtn}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Styles ---------------- */

const pageStyle = {
  background: "#f8fafc",
  minHeight: "100vh"
};

const containerStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "1.5rem"
};

const headerStyle = {
  background: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  marginBottom: "1.5rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
};

const titleStyle = {
  margin: 0,
  fontSize: "1.8rem",
  fontWeight: 600
};

const subtitleStyle = {
  marginTop: "0.4rem",
  color: "#6b7280"
};

const searchWrapper = {
  position: "relative",
  marginBottom: "1.5rem"
};

const searchIconStyle = {
  position: "absolute",
  top: "50%",
  left: "12px",
  transform: "translateY(-50%)",
  color: "#9ca3af"
};

const searchInputStyle = {
  width: "100%",
  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db"
};

const tableWrapper = {
  background: "#ffffff",
  borderRadius: "12px",
  overflowX: "auto",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const theadRow = {
  background: "#f3f4f6"
};

const th = {
  padding: "1rem",
  textAlign: "left",
  fontWeight: 600,
  whiteSpace: "nowrap"
};

const td = {
  padding: "1rem",
  verticalAlign: "top"
};

const tbodyRow = {
  borderBottom: "1px solid #e5e7eb"
};

const badgeStyle = {
  padding: "0.3rem 0.6rem",
  borderRadius: "6px",
  fontSize: "0.75rem",
  fontWeight: 500
};

const paginationStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "1.5rem"
};

const pageBtn = {
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.4rem 0.8rem",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer"
};

const emptyCell = {
  padding: "1.5rem",
  textAlign: "center",
  color: "#6b7280"
};

const loaderStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

export default AdminCollegeManagement;
