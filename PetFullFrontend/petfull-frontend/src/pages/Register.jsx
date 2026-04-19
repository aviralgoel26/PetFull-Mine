import React, { useState } from "react";

const API = "http://localhost:8080/api";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email:    "",
    password: "",
    role:     "RECIPIENT", // ✅ sensible default — user picks from dropdown
    phone:    "",
    address:  "",
    city:     "",
    state:    "",
    pincode:  "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess]  = useState(false);
  const [loading, setLoading]  = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setMessage(""); // clear error on any change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Basic client-side validation
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/users/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.text();
        setMessage(error || "Registration failed. Please try again.");
        return;
      }

      setSuccess(true);
      setMessage("Registration successful! Redirecting to login…");
      setTimeout(() => { window.location.href = "/login"; }, 1500);

    } catch {
      setMessage("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-yellow-50 px-4 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-green-200">

        <h1 className="text-3xl font-bold text-green-700 text-center mb-2">
          Create Your Account 🌱
        </h1>
        <p className="text-center text-gray-400 text-sm mb-6">
          Join PetFull and help reduce food waste
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <input
            className={inputClass}
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <input
            className={inputClass}
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <input
            className={inputClass}
            placeholder="Password (min 6 characters)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
          />

          {/* ✅ Role as dropdown — not a free-text input */}
          <select
            className={inputClass}
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="RECIPIENT">Recipient — I need food</option>
            <option value="DONOR">Donor — I want to donate food</option>
          </select>

          <input
            className={inputClass}
            placeholder="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
          />

          <input
            className={inputClass}
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={loading}
            />
            <input
              className={inputClass}
              placeholder="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <input
            className={inputClass}
            placeholder="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Registering…" : "Create Account"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className={`text-center mt-4 font-medium text-sm ${success ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-semibold hover:underline">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}