import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboardNew from "./pages/DonorDashboardNew";
import RecipientDashboardNew from "./pages/RecipientDashboardNew";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donor-dashboard" element={<DonorDashboardNew />} />
        <Route path="/recipient-dashboard" element={<RecipientDashboardNew />} />

      </Routes>
    </Router>
  );
}

export default App;
