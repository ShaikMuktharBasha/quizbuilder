import React, { useEffect, useState } from "react";
import { getMyResults } from "./api";
import "./MyResults.css";

export default function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("User not found. Please login.");
      setLoading(false);
      return;
    }

    async function fetchResults() {
      try {
        const data = await getMyResults(userId);
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError("Failed to fetch quiz results. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [userId]);

  return (
    <div className="results-container">
      <h1 className="results-header">My Quiz Results</h1>

      {loading ? (
        <p className="text-gray-600 text-center">Loading results...</p>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : results.length === 0 ? (
        <p className="text-gray-600 text-center">No quiz attempts yet.</p>
      ) : (
        <table className="results-table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Domain</th>
              <th>Score</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => (
              <tr key={res.id}>
                <td>{res.quizTitle || "Untitled Quiz"}</td>
                <td>{res.quizDomain || "N/A"}</td>
                <td>{res.score}</td>
                <td>{res.total}</td>
                <td>{new Date(res.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
