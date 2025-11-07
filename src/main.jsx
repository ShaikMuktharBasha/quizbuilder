import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Welcome from "./Welcome.jsx"; // ✅ add your welcome page
import CreatorDashboard from "./CreatorDashboard";
import ParticipantDashboard from "./ParticipantDashboard";
import CreateQuiz from "./CreateQuiz";
import MyQuizzes from "./MyQuizzes.jsx";
import AttemptQuiz from "./AttemptQuiz";
import MyResults from "./MyResults";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<App />} /> {/* reuse same app for login */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/creator" element={<CreatorDashboard />} />
        <Route path="/participant" element={<ParticipantDashboard />} />
        <Route path="/create-quiz" element={<CreateQuiz />} /> 
        <Route path="/my-quizzes" element={<MyQuizzes />} />
        <Route path="/attempt-quiz" element={<AttemptQuiz />} />
        <Route path="/my-results" element={<MyResults />} />

      </Routes>
    </Router>
  </StrictMode>
);
