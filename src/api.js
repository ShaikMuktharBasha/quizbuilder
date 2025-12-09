import axios from "axios";

// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9096";

const USER_API_URL = `${API_BASE_URL}/api/users`;
const QUIZ_API_URL = `${API_BASE_URL}/api/quizzes`;

/* ---------------- USER APIs ---------------- */

// Signup
export async function signup(data) {
  const res = await axios.post(`${USER_API_URL}/signup`, data);
  return res.data;
}

// Login
export async function login(data) {
  const res = await axios.post(`${USER_API_URL}/login`, data);
  return res.data;
}

// Get all users
export async function getAllUsers() {
  const res = await axios.get(`${USER_API_URL}/all`);
  return res.data;
}

/* ---------------- QUIZ APIs ---------------- */

// Create Quiz
export async function createQuiz(data) {
  const res = await axios.post(QUIZ_API_URL, data);
  return res.data;
}

// Get all quizzes
export async function getAllQuizzes() {
  const res = await axios.get(QUIZ_API_URL);
  return res.data;
}

// Get quizzes created by current user
export async function getMyQuizzes(userId) {
  const res = await axios.get(`${QUIZ_API_URL}/myquizzes/${userId}`);
  return res.data;
}

// Delete quiz
export async function deleteQuiz(quizId) {
  await axios.delete(`${QUIZ_API_URL}/${quizId}`);
}

// Get one quiz (with questions)
export async function getQuizById(id) {
  const res = await axios.get(`${QUIZ_API_URL}/${id}`);
  return res.data;
}

// Submit quiz answers
export async function submitQuiz(id, submission) {
  const res = await axios.post(`${QUIZ_API_URL}/${id}/submit`, submission);
  return res.data;
}

// Get results of logged-in user
export async function getMyResults(userId) {
  const res = await axios.get(`${QUIZ_API_URL}/quiz-results/users/${userId}`);
  return res.data;
}

// Get results for a specific quiz
export async function getQuizResults(quizId) {
  const res = await axios.get(`${QUIZ_API_URL}/quiz-results/${quizId}`);
  return res.data;
}

// Get all results (admin)
export async function getAllResults() {
  const res = await axios.get(`${QUIZ_API_URL}/quiz-results`);
  return res.data;
}
