import { useEffect, useState } from "react";
import api from "../api/api";

export default function RecipientDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/donations/available")
      .then((res) => {
        setDonations(res.data);
      })
      .catch(() => {
        alert("Failed to fetch donations");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Available Donations</h1>

      {donations.length === 0 ? (
        <p>No donations available</p>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div key={donation.id} className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold text-lg">{donation.foodName}</h2>
              <p className="text-sm text-gray-600">{donation.description}</p>
              <p className="text-sm">
                Quantity: {donation.quantity} {donation.unit}
              </p>
              <p className="text-sm">
                Location: {donation.city}, {donation.state}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}