import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./api";
import "./LoginPage.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login({ email, password });

      if (result && result.id) {
        // Store user data
        localStorage.setItem("userId", result.id);
        localStorage.setItem("username", result.username);
        localStorage.setItem("email", result.email);
        localStorage.setItem("role", result.role);

        // Redirect based on role
        if (result.role === "creator") {
          navigate("/creator");
        } else {
          navigate("/participant");
        }
      } else {
        alert("Login failed");
      }
    } catch (error) {
      alert("Error logging in: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Left Side - Landing Content */}
        <div className="landing-section">
          <div className="landing-content">
            <h1 className="logo">Quiz Builder</h1>
            <h2 className="tagline">Participate and gain knowledge here</h2>
            <p className="subtext">
              Challenge yourself with fun quizzes, compete with friends, and track
              your progress in real-time. Learning has never been this exciting!
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-section">
          <div className="login-container">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Don't have an account?{" "}
                <span onClick={() => navigate("/signup")}>Sign up</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}