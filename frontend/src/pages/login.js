import React, { useState } from "react";
import "./login.css";
import BASE_URL from "../baseurl"; // axios instance with baseURL

export default function LoginRegister() {
  const [activeForm, setActiveForm] = useState("login");
  const [loading, setLoading] = useState(false);

  const handleToggle = (form) => {
    setActiveForm(form);
  };

  // --------------------------------------
  // LOGIN FUNCTION INTEGRATED WITH BACKEND
  // --------------------------------------
const handleLoginSubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const username = form.username.value;
  const dob = form.dob.value;
  const user_type = form.user_type.value;

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",  // important for session cookies
      body: JSON.stringify({ username, dob, user_type }),
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = data.redirect;
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong");
  }
};


  // --------------------------------------
  // REGISTER — optional
  // --------------------------------------
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    alert("Registration submitted");
  };

  return (
    <main className="wrap">
      {/* Left side */}
      <section className="card left">
        <div className="brand">
          <h1>Maatram</h1>
          <p className="muted">Student Profiling Platform</p>
        </div>

        <div className="intro">
          <h2>Welcome to Maatram</h2>
          <p className="muted">
            Login if you already have an account or register to join as Student,
            Mentor, or Admin.
          </p>

          <div className="cta">
            <button
              className={`btn ${activeForm === "login" ? "active" : ""}`}
              onClick={() => handleToggle("login")}
            >
              Login
            </button>
          </div>
        </div>

        <footer className="brand-foot">
          <small>© Maatram Foundation</small>
        </footer>
      </section>

      {/* Right side */}
      <section className="card right">
        <div className="form-container">

          {/* LOGIN FORM */}
          {activeForm === "login" && (
            <form className="form active" onSubmit={handleLoginSubmit}>
              <h2>Login</h2>

              <label htmlFor="username">Username — Maatram ID</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="MAA000000"
                required
              />

              <label htmlFor="dob">Password — dd/mm/yyyy</label>
              <input
                id="dob"
                name="dob"
                type="password"
                placeholder="00/00/0000"
                required
              />

              <div className="user-type">
                <label>
                  <input type="radio" name="user_type" value="student" required /> Student
                </label>
                <label>
                  <input type="radio" name="user_type" value="mentor" /> Mentor
                </label>
                <label>
                  <input type="radio" name="user_type" value="admin" /> Admin
                </label>
              </div>

              <button type="submit" className="btn-submit">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* REGISTER FORM (optional) */}
          {activeForm === "register" && (
            <form className="form active" onSubmit={handleRegisterSubmit}>
              <h2>Register</h2>
              {/* Add your registration fields here */}
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
