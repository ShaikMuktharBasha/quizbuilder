import React, { useState } from "react";
import "./CreateQuiz.css";
import { createQuiz } from "./api";

export default function CreateQuiz() {
  const [step, setStep] = useState(1);

  // Quiz details
  const [quiz, setQuiz] = useState({
    domain: "",
    title: "",
    timeLimit: ""
  });

  // Questions
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    answer: ""
  });

  // Edit state
  const [editIndex, setEditIndex] = useState(null);

  // Saved quiz response
  const [savedQuiz, setSavedQuiz] = useState(null);

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e, index) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = e.target.value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addQuestion = () => {
    if (!newQuestion.text || !newQuestion.answer) {
      alert("Please fill question and select correct answer!");
      return;
    }

    const cleanedOptions = newQuestion.options.filter(
      (opt) => opt && opt.trim() !== ""
    );

    const formattedQuestion = {
      ...newQuestion,
      options: cleanedOptions
    };

    if (editIndex !== null) {
      // Update existing question
      const updated = [...questions];
      updated[editIndex] = formattedQuestion;
      setQuestions(updated);
      setEditIndex(null);
    } else {
      // Add new question
      setQuestions([...questions, formattedQuestion]);
    }

    // Reset input
    setNewQuestion({ text: "", options: ["", "", "", ""], answer: "" });
  };

  const startEdit = (index) => {
    setNewQuestion(questions[index]);
    setEditIndex(index);
    setStep(2);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const saveQuiz = async () => {
    const creator = localStorage.getItem("fullName");
    if (!creator) {
      alert("You must be logged in to create a quiz!");
      return;
    }

    const payload = {
      domain: quiz.domain,
      title: quiz.title,
      timeLimit: Number(quiz.timeLimit),
      createdBy: creator,
      questions: questions.map((q) => ({
        text: q.text,
        options: q.options.filter((opt) => opt && opt.trim() !== ""),
        answer: q.answer
      }))
    };

    console.log("Final Payload:", JSON.stringify(payload, null, 2));

    try {
      const saved = await createQuiz(payload);
      setSavedQuiz(saved);
      setStep(4);
    } catch (err) {
      console.error("Error saving quiz:", err);
      alert("Failed to save quiz!");
    }
  };

  return (
    <div className="create-quiz">
      <h2>Create Quiz</h2>

      {/* Step 1: Quiz Details */}
      {step === 1 && (
        <div className="quiz-details">
          <label>Domain:</label>
          <select name="domain" value={quiz.domain} onChange={handleQuizChange}>
            <option value="">Select Domain</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
          </select>

          <label>Quiz Title:</label>
          <input
            type="text"
            name="title"
            value={quiz.title}
            onChange={handleQuizChange}
          />

          <label>Time Limit (minutes):</label>
          <input
            type="number"
            name="timeLimit"
            value={quiz.timeLimit}
            onChange={handleQuizChange}
          />

          <button onClick={() => setStep(2)}>Next →</button>
        </div>
      )}

      {/* Step 2: Add/Edit Questions */}
      {step === 2 && (
        <div className="quiz-questions">
          <label>Question:</label>
          <input
            type="text"
            value={newQuestion.text}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, text: e.target.value })
            }
          />

          {newQuestion.options.map((opt, idx) => (
            <div key={idx}>
              <input
                type="text"
                value={opt}
                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                onChange={(e) => handleQuestionChange(e, idx)}
              />
            </div>
          ))}

          <label>Correct Answer:</label>
          <select
            value={newQuestion.answer}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, answer: e.target.value })
            }
          >
            <option value="">Select</option>
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
          </select>

          <div className="buttons">
            <button onClick={addQuestion}>
              {editIndex !== null ? "Update Question" : "Add Question"}
            </button>
            <button onClick={() => setStep(1)}>← Previous</button>
            <button onClick={() => setStep(3)}>Next →</button>
          </div>

          <h3>Added Questions:</h3>
          <ul>
            {questions.map((q, i) => (
              <li key={i}>
                {q.text} (Answer: {q.answer})
                <button onClick={() => startEdit(i)}>✏️ Edit</button>
                <button onClick={() => deleteQuestion(i)}>🗑️ Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 3: Review & Save */}
      {step === 3 && (
        <div className="review-quiz">
          <h3>Review Quiz</h3>
          <p>
            <strong>Domain:</strong> {quiz.domain}
          </p>
          <p>
            <strong>Title:</strong> {quiz.title}
          </p>
          <p>
            <strong>Time Limit:</strong> {quiz.timeLimit} minutes
          </p>

          <h4>Questions:</h4>
          <ol>
            {questions.map((q, i) => (
              <li key={i}>
                {q.text}
                <ul>
                  {q.options.map((opt, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontWeight:
                          q.answer === String.fromCharCode(65 + idx)
                            ? "bold"
                            : "normal",
                        color:
                          q.answer === String.fromCharCode(65 + idx)
                            ? "green"
                            : "black"
                      }}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="buttons">
            <button onClick={() => setStep(2)}>← Previous</button>
            <button onClick={saveQuiz}>Save Quiz ✅</button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && savedQuiz && (
        <div className="confirmation">
          <h3>🎉 Quiz Created Successfully!</h3>
          <p>
            <strong>Quiz ID:</strong> {savedQuiz.id}
          </p>
          <p>
            <strong>Domain:</strong> {savedQuiz.domain}
          </p>
          <p>
            <strong>Title:</strong> {savedQuiz.title}
          </p>
          <p>
            <strong>Time Limit:</strong> {savedQuiz.timeLimit} minutes
          </p>

          <h4>Questions:</h4>
          <ol>
            {savedQuiz.questions.map((q, i) => (
              <li key={i}>
                {q.text}
                <ul>
                  {q.options.map((opt, idx) => (
                    <li key={idx}>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <button onClick={() => window.location.reload()}>
            ➕ Create Another Quiz
          </button>
        </div>
      )}
    </div>
  );
}
