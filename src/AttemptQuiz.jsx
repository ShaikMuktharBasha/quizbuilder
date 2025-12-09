import React, { useEffect, useState } from "react";
import { getAllQuizzes, getMyResults, submitQuiz } from "./api";
import { useNavigate } from "react-router-dom";
import "./AttemptQuiz.css";

export default function AttemptQuiz() {
  const [step, setStep] = useState("start"); // start → domains → quizzes → active → result
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [attemptedQuizIds, setAttemptedQuizIds] = useState([]);

  const userId = localStorage.getItem("userId") || "1";
  const navigate = useNavigate();

  // ✅ Get already attempted quizzes
  useEffect(() => {
    getMyResults(userId)
      .then((res) => setAttemptedQuizIds(res.map((r) => r.quizId))) // Assuming quizId is in response
      .catch((err) => console.error(err));
  }, [userId]);

  // ✅ Load all quizzes
  const loadAllQuizzes = async () => {
    setStep("quizzes");
    setResult(null);
    setActiveQuiz(null);
    setAnswers({});
    try {
      const allQuizzes = await getAllQuizzes();
      setQuizzes(allQuizzes);
    } catch (err) {
      console.error(err);
      alert("Failed to load quizzes");
    }
  };

  // ✅ Start quiz
  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setStep("active");
    setAnswers({});
    setResult(null);
    // Removed timeLimit since it's not in the new schema
    setTimeLeft(null);
  };

  // ✅ Timer logic
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ Submit quiz
const handleSubmit = async () => {
  if (!activeQuiz) return;
  try {
    // ✅ Build map of answers { questionId: selectedAnswer }
    const mappedAnswers = {};
    activeQuiz.questions.forEach((q) => {
      mappedAnswers[q.id] = answers[q.id] || "";
    });

    // 🔍 Debug logs
    console.log("👉 Questions:", activeQuiz.questions.map(q => ({ id: q.id, text: q.questionText })));
    console.log("👉 Selected answers object:", answers);
    console.log("👉 Payload to send:", { userId, answers: mappedAnswers });

    const res = await submitQuiz(activeQuiz.id, {
      userId,
      answers: mappedAnswers,
    });

    console.log("✅ Backend response:", res);

    // Show success message and redirect to results page
    alert(`Quiz submitted successfully! You scored ${res.score} out of ${res.total}`);
    navigate("/my-results");
  } catch (err) {
    console.error("❌ Error submitting quiz:", err);
  }
};



  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="attempt-container">
      <h1 className="title">Attempt Quiz</h1>

      {/* STEP 1: Start button */}
      {step === "start" && (
        <button className="main-start-btn" onClick={() => loadAllQuizzes()}>
          Start Quiz
        </button>
      )}

      {/* STEP 2: Quizzes list */}
      {step === "quizzes" && (
        <div className="quiz-list">
          <h2>Available Quizzes</h2>
          {quizzes.length === 0 && <p>No quizzes available.</p>}
          {quizzes.map((q) => (
            <div key={q.id} className="quiz-card">
              <h3>{q.title}</h3>
              <p>Time Limit: {q.timeLimit} mins</p>
              {attemptedQuizIds.includes(q.id) ? (
                <button className="disabled-btn" disabled>
                  Already Attempted
                </button>
              ) : (
                <button onClick={() => startQuiz(q)} className="start-btn">
                  Attempt
                </button>
              )}
            </div>
          ))}
          <button className="back-btn" onClick={() => setStep("domains")}>
            ← Back to Domains
          </button>
        </div>
      )}

     {/* STEP 4: Active Quiz */}
{step === "active" && activeQuiz && (
  <div className="quiz-box">
    <h2>{activeQuiz.title}</h2>
    {timeLeft !== null && (
      <p className="timer">Time left: {formatTime(timeLeft)}</p>
    )}
    {activeQuiz.questions.length === 0 ? (
      <p>No questions available for this quiz yet.</p>
    ) : (
      activeQuiz.questions.map((q) => {
        const options = [q.optionA, q.optionB, q.optionC, q.optionD];
        return (
          <div key={q.id} className="quiz-question">
            <p>{q.questionText}</p>
            {options.map((opt, i) => {
              const optionKey = String.fromCharCode(65 + i); // "A", "B", "C", "D"
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={optionKey}   // ✅ send "A", "B", "C", or "D"
                    checked={answers[q.id] === optionKey}
                    onChange={() =>
                      setAnswers({ ...answers, [q.id]: optionKey })
                    }
                  />
                  {optionKey}. {opt}
                </label>
              );
            })}
          </div>
        );
      })
    )}
    {activeQuiz.questions.length > 0 && (
      <button onClick={handleSubmit} className="submit-btn">
        Submit Quiz
      </button>
    )}
  </div>
)}

      {/* STEP 5: Result */}
      {step === "result" && result && (
        <div className="result-box">
          <h2>Result</h2>
          <p>
            You scored <b>{result.score}</b> out of {result.total}
          </p>
          <button onClick={() => setStep("domains")}>Back to Domains</button>
        </div>
      )}
    </div>
  );
}
