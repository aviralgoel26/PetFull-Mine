import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// TEMP: userId header (later replaced by JWT token)
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId"); // stored at login
  if (userId) {
    config.headers["User-Id"] = userId;
  }
  return config;
});

export default api;
