import axios from "axios";

const api = axios.create({
  baseURL: "https://petfull-mine.onrender.com/api",
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
