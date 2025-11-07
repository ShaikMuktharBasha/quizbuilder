import React from "react";
import { useNavigate } from "react-router-dom";
import "./CreatorDashboard.css";

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="creator-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Hello, {role} 👋</h2>
        <div className="header-right">
          <span className="user-name">{fullName}</span>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Create Quiz */}
        <div className="action-card small-card">
          <h3>Create Quiz</h3>
          <p>Design quizzes and challenge participants.</p>
          <button onClick={() => navigate("/create-quiz")}>Click Here</button>
        </div>

        {/* Profile */}
        <div className="profile-box">
          <h3>Profile</h3>
          <p><strong>Name:</strong> {fullName}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Role:</strong> {role}</p>
        </div>

        {/* My Quizzes */}
        <div className="action-card small-card">
          <h3>My Quizzes</h3>
          <p>View and manage quizzes you have created.</p>
          <button onClick={() => navigate("/my-quizzes")}>View</button>
        </div>

        {/* About Creator */}
        <section className="about-participant">
          <h4>About Creator</h4>
          <p>
            As a creator, you can design and publish quizzes for participants,
            manage your quiz library, and monitor engagement. Inspire others
            with your challenges!
          </p>
        </section>
      </div>
    </div>
  );
}
