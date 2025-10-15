// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage or window.__USER_TOKEN__ if available
api.interceptors.request.use((config) => {
  const token = config.headers?.Authorization?.startsWith("Bearer ") // already set by call
    ? null
    : localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      window.__USER_TOKEN__ ||
      null;

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
