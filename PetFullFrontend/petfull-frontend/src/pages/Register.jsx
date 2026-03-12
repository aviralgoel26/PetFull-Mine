import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role:"",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/users/register", formData);

      if (res.status === 200) {
        setMessage("Registration successful! Redirecting...");

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (err) {
      const errorMessage =
    typeof err.response?.data === "string"
      ? err.response.data
      : err.response?.data?.message || "Registration failed";

  setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-yellow-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-green-200">

        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Create Your Account 🌱
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <input className="field" placeholder="Full Name" name="fullName" onChange={handleChange} required />
          <input className="field" placeholder="Email" name="email" onChange={handleChange} required />
          <input className="field" placeholder="Password" type="password" name="password" onChange={handleChange} required />
          <input className="field" placeholder="Role" type="role" name="role" onChange={handleChange} required />
          <input className="field" placeholder="Phone Number" name="phone" onChange={handleChange} />
          <input className="field" placeholder="Address" name="address" onChange={handleChange} />
          <input className="field" placeholder="City" name="city" onChange={handleChange} />
          <input className="field" placeholder="State" name="state" onChange={handleChange} />
          <input className="field" placeholder="Pincode" name="pincode" onChange={handleChange} />

          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-red-500 font-medium">{message}</p>
        )}

        <p className="text-center mt-6">
          Already have an account?{" "}
          <a href="/" className="text-green-600 font-semibold">Login</a>
        </p>
      </div>
    </div>
  );
}
