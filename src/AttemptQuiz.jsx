import React, { useEffect, useState } from "react";
import { getQuizzesByDomain, getMyResults, submitQuiz } from "./api";
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

  const username = localStorage.getItem("fullName") || "student1";

  // ✅ Get already attempted quizzes
  useEffect(() => {
    getMyResults(username)
      .then((res) => setAttemptedQuizIds(res.map((r) => r.quiz.id)))
      .catch((err) => console.error(err));
  }, [username]);

  // ✅ Load quizzes by domain
  const loadDomainQuizzes = async (domain) => {
    setSelectedDomain(domain);
    setStep("quizzes");
    setResult(null);
    setActiveQuiz(null);
    setAnswers({});
    try {
      const res = await getQuizzesByDomain(domain);
      setQuizzes(res);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Start quiz
  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setStep("active");
    setAnswers({});
    setResult(null);
    if (quiz.timeLimit) {
      setTimeLeft(quiz.timeLimit * 60);
    }
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
    console.log("👉 Questions:", activeQuiz.questions.map(q => ({ id: q.id, text: q.text })));
    console.log("👉 Selected answers object:", answers);
    console.log("👉 Payload to send:", { username, answers: mappedAnswers });

    const res = await submitQuiz(activeQuiz.id, {
      username,
      answers: mappedAnswers,
    });

    console.log("✅ Backend response:", res);

    setResult(res);
    setActiveQuiz(null);
    setStep("result");
    setAttemptedQuizIds((prev) => [...prev, activeQuiz.id]);
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
        <button className="main-start-btn" onClick={() => setStep("domains")}>
          Start Quiz
        </button>
      )}

      {/* STEP 2: Domain selection */}
      {step === "domains" && (
        <div className="domains-grid">
          {["Math", "Science", "History"].map((d) => (
            <div
              key={d}
              className="domain-card"
              onClick={() => loadDomainQuizzes(d)}
            >
              <h2>{d}</h2>
            </div>
          ))}
        </div>
      )}

      {/* STEP 3: Quizzes under selected domain */}
      {step === "quizzes" && (
        <div className="quiz-list">
          <h2>{selectedDomain} Quizzes</h2>
          {quizzes.length === 0 && <p>No quizzes found in this domain.</p>}
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
    {activeQuiz.questions.map((q) => (
      <div key={q.id} className="quiz-question">
        <p>{q.text}</p>
        {q.options.map((opt, i) => {
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
    ))}
    <button onClick={handleSubmit} className="submit-btn">
      Submit Quiz
    </button>
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
