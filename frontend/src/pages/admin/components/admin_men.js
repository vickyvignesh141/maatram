import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminMentors = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/mentors"
      );

      // data is inside res.data.data
      setMentors(res.data.data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  return (
    <div>
      <h2>Admin - Mentor List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Phone</th>
            <th>No. of Students</th> {/* 👈 NEW COLUMN */}
          </tr>
        </thead>

        <tbody>
          {mentors.length > 0 ? (
            mentors.map((mentor) => (
              <tr key={mentor.username}>
                <td>{mentor.id}</td>
                <td>{mentor.name}</td>
                <td>{mentor.username}</td>
                <td>{mentor.phone}</td>
                <td>{mentor.student_count}</td> {/* 👈 DISPLAY */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" align="center">
                No mentors found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMentors;
