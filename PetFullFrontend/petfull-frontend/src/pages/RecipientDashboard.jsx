import React, { useEffect, useState } from "react";
import api from "../api/api"; // your axios config

const RecipientDashboard = () => {
  // 1. Move all states INSIDE the component
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/donations/available");
      setDonations(res.data);
    } catch (err) {
      console.error("Error fetching donations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id) => {
    try {
      setClaimingId(id);
      await api.put(`/donations/claim/${id}?userId=2`);
      setDonations((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to claim donation");
    } finally {
      setClaimingId(null);
    }
  };

  // 2. The loading return must be INSIDE the component function
  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h2>Loading donations...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", background: "#f5f7fa", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>Available Donations</h2>

      {donations.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h3>No donations available</h3>
          <p>Check back later or refresh the page</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {donations.map((donation) => (
            <div
              key={donation.id}
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>{donation.foodName}</h3>
              <p style={{ color: "#555" }}>{donation.description}</p>
              <p><strong>Quantity:</strong> {donation.quantity} {donation.unit}</p>
              <p><strong>Location:</strong> {donation.city}</p>
              <p><strong>Expiry:</strong> {new Date(donation.expiryDateTime).toLocaleString()}</p>

              <button
                onClick={() => handleClaim(donation.id)}
                disabled={claimingId === donation.id}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "10px",
                  background: claimingId === donation.id ? "#aaa" : "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: claimingId === donation.id ? "not-allowed" : "pointer",
                }}
              >
                {claimingId === donation.id ? "Claiming..." : "Claim"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipientDashboard;