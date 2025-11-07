// ParticipantDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ParticipantDashboard.css";

export default function ParticipantDashboard() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="participant-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Hello, Participant 👋</h2>
        <div className="header-right">
          <span className="user-name">{fullName}</span>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Attempt Quiz */}
        <div className="action-card small-card">
          <h3>Attempt Quiz</h3>
          <p>Take quizzes created by others and test your knowledge.</p>
          <button
            onClick={() => navigate("/attempt-quiz")}
            className="start-btn"
          >
            Start Quiz
          </button>
        </div>

        {/* Profile */}
        <div className="profile-box">
          <h3>Profile</h3>
          <p><strong>Name:</strong> {fullName}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Role:</strong> Participant</p>
        </div>

        {/* My Results */}
        <div className="action-card small-card">
          <h3>My Results</h3>
          <p>Check your past performance and track your progress.</p>
          <button onClick={() => navigate("/my-results")}>View Results</button>
        </div>

        {/* About Participant */}
        <section className="about-participant">
          <h4>About Participant</h4>
          <p>
            As a participant, you can attempt quizzes created by others,
            check your scores, and track your progress.
            Stay active and challenge yourself!
          </p>
        </section>
      </div>
    </div>
  );
}
