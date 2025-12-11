import React from "react";

export default function StudentNav({ user }) {
  return (
    <header className="dashboard-header">
      <div>
        <h2>Student Dashboard</h2>
      </div>
      <div>
        <span>{user?.name}</span> | <span>{user?.username}</span>
      </div>
    </header>
  );
}
