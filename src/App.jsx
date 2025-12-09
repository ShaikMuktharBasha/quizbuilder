import React from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1 className="logo">Quiz Builder</h1>
      </header>

      {/* Body Section */}
      <main className="main-content">
        <h2 className="tagline">Participate and gain knowledge here</h2>
        <p className="subtext">
          Challenge yourself with fun quizzes, compete with friends, and track
          your progress in real-time. Learning has never been this exciting!
        </p>
        <div className="button-group">
          <button className="glow-btn" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button className="glow-btn secondary" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
        <p className="account-link">
          Don't have an account? <span onClick={() => navigate("/signup")}>Create new account</span>
        </p>
      </main>
    </div>
  );
}
