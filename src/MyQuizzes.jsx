import React, { useEffect, useState } from "react";
import { getMyQuizzes, deleteQuiz } from "./api";
import "./MyQuizzes.css";

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const username = localStorage.getItem("fullName"); // ✅ must match your login storage

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMyQuizzes(username);
        setQuizzes(data);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        alert("Failed to fetch your quizzes!");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [username]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      alert("Delete failed!");
    }
  };

  return (
    <div className="my-quizzes">
      <h2>📚 My Quizzes</h2>

      {loading && <p>Loading quizzes...</p>}

      {!loading && quizzes.length === 0 && <p>No quizzes created yet.</p>}

      <div className="quiz-list">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <h3>{quiz.title}</h3>
            <p>
              <strong>Domain:</strong> {quiz.domain}
            </p>
            <p>
              <strong>Time Limit:</strong> {quiz.timeLimit} minutes
            </p>

            <div className="quiz-actions">
              <button onClick={() => setSelectedQuiz(quiz)}>👀 View</button>
              <button onClick={() => handleDelete(quiz.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Modal for Questions */}
      {selectedQuiz && (
        <div className="modal-overlay" onClick={() => setSelectedQuiz(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>📖 {selectedQuiz.title}</h3>
            <p>
              <strong>Domain:</strong> {selectedQuiz.domain}
            </p>
            <p>
              <strong>Time Limit:</strong> {selectedQuiz.timeLimit} minutes
            </p>

            <h4>Questions:</h4>
            <ol>
              {selectedQuiz.questions.map((q, idx) => (
                <li key={q.id || idx}>
                  {q.text}
                  <ul>
                    {q.options.map((opt, i) => {
                      const optionLetter = String.fromCharCode(65 + i);
                      return (
                        <li
                          key={i}
                          style={{
                            fontWeight:
                              q.answer === optionLetter ? "bold" : "normal",
                            color: q.answer === optionLetter ? "green" : "black",
                          }}
                        >
                          {optionLetter}. {opt}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>

            <button onClick={() => setSelectedQuiz(null)}>❌ Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
