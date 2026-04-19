import React, { useState } from "react";

const API = "http://localhost:8080/api";

const Login = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [message,  setMessage]  = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/users/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        setMessage(error || "Login failed. Please try again.");
        return;
      }

      const user = await response.json();

      // ✅ Always overwrite localStorage so stale user data never persists
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Route by role — added ADMIN support
      if (user.role === "DONOR") {
        window.location.href = "/donor-dashboard";
      } else if (user.role === "RECIPIENT") {
        window.location.href = "/recipient-dashboard";
      } else if (user.role === "ADMIN") {
        window.location.href = "/admin-dashboard";
      } else {
        setMessage("Unknown role: " + user.role);
      }

    } catch {
      setMessage("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-green-200">

        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
            alt="PetFull logo"
            className="w-20 mx-auto animate-bounce"
          />
          <h1 className="text-3xl font-bold mt-3 text-green-700">PetFull Login</h1>
          <p className="text-gray-500 text-sm">Connecting surplus food to those in need</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        {/* Error message */}
        {message && (
          <p className="text-center text-sm mt-3 text-red-500">{message}</p>
        )}

        {/* Footer */}
        <p className="text-center mt-5 text-gray-600 text-sm">
          New here?{" "}
          <a href="/register" className="text-green-600 font-semibold hover:underline">
            Create an account
          </a>
        </p>

      </div>
    </div>
  );
};

export default Login;