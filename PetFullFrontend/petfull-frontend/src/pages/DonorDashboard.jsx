import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import DonationCard from "../components/DonationCard";


export default function DonorDashboard() {
  const [donorStatus, setDonorStatus] = useState("UNVERIFIED");
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const formRef = useRef(null);
  const [donationForm, setDonationForm] = useState({
    foodName: "",
    description: "",
    quantity: "",
    unit: "g",
    manufacturedDateTime: "",
    expiryDateTime: "",
    city: "",
    state: "",
    image: null,
    video: null,
  });

  const isVerified = donorStatus === "VERIFIED";

  // Fetch donor status on load
  useEffect(() => {
    api.get("/users/me/status")
      .then((res) => {
        setDonorStatus(res.data);
      })
      .catch(() => {
        alert("Failed to fetch donor status");
      })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
  api.get("/donations/my")
    .then((res) => {
      setDonations(res.data);
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to fetch donations");
    })
    .finally(() => {
      setDonationsLoading(false);
    });
}, []);


  const applyForVerification = async () => {
    try {
      await api.post("/verification/apply");
      setDonorStatus("PENDING");
      alert("Verification request submitted");
    } catch (err) {
      alert(err.response?.data || "Error applying for verification");
    }
  };
  const handleDonationChange = (e) => {
  const { name, value } = e.target;
  setDonationForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};
const handleFileChange = (e) => {
  const { name, files } = e.target;

  setDonationForm((prev) => ({
    ...prev,
    [name]: files[0],
  }));
};

const handleSubmitDonation = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/donations", donationForm);

    // Instantly update UI
    setDonations((prev) => [res.data, ...prev]);

    // Reset form
    setDonationForm({
      foodName: "",
      description: "",
      quantity: "",
      unit: "g",
      manufacturedDateTime: "",
      expiryDateTime: "",
      city: "",
      state: "",
      image: null,
      video: null,
    });
    formRef.current.reset();

  } catch (err) {
    console.error(err);
    alert("Failed to create donation");
  }
};


  if (loading) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Bar */}
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">PetFull</h1>

        <div className="flex items-center gap-4">
          <StatusBadge status={donorStatus} />
          <button className="text-sm text-red-500 hover:underline">
            Logout
          </button>
        </div>
      </header>

      {/* Verification Banner */}
{donorStatus !== "VERIFIED" && (
  <div className="max-w-7xl mx-auto mt-6 px-8">
    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-6">
      <div className="flex items-center gap-4">
        <div className="bg-green-100 p-3 rounded-full">
          <span className="text-green-600 text-xl">✔</span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-green-800">
            Become a Verified Donor to donate food
          </h3>
          <p className="text-sm text-green-700">
            Verified donors are trusted to provide safe, quality food donations.
          </p>
        </div>
      </div>

      {donorStatus === "UNVERIFIED" && (
        <button
          onClick={applyForVerification}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Apply for Verification
        </button>
      )}

      {donorStatus === "PENDING" && (
        <span className="text-yellow-700 font-medium">
          ⏳ Verification Pending
        </span>
      )}
    </div>
  </div>
)}

      {/* Main */}
      <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="space-y-6">

          {/* Donate Card */}
          <div className={`bg-white rounded-xl shadow p-6 ${!isVerified && "opacity-50"}`}>
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Donate Food</span>

          {isVerified && (
          <span className="flex items-center gap-1 text-sm text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
          ✔ Donor Verified
          </span>
          )}
          </div>

          {isVerified && (
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
            Verified
              </span>
              )}
              </div>

            {!isVerified && (
              <p className="text-xs text-red-500 mb-3">
                Verification required
              </p>
            )}

            <form ref={formRef} className="space-y-3" onSubmit={handleSubmitDonation}>

             <input
    name="foodName"
    value={donationForm.foodName}
    onChange={handleDonationChange}
    disabled={!isVerified}
    className="w-full border px-3 py-2 rounded-lg"
    placeholder="Food Name"
  />

  <textarea
    name="description"
    value={donationForm.description}
    onChange={handleDonationChange}
    disabled={!isVerified}
    className="w-full border px-3 py-2 rounded-lg"
    placeholder="Description"
  />
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Food Cover Image <span className="text-red-500">*</span>
  </label>
  <input
    type="file"
    name="image"
    accept="image/*"
    onChange={handleFileChange}
    disabled={!isVerified}
    className="w-full text-sm"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Food Video (optional)
  </label>
  <input
    type="file"
    name="video"
    accept="video/*"
    onChange={handleFileChange}
    disabled={!isVerified}
    className="w-full text-sm"
  />
</div>

  <div className="flex gap-3">
    <input
      name="quantity"
      value={donationForm.quantity}
      onChange={handleDonationChange}
      disabled={!isVerified}
      className="w-full border px-3 py-2 rounded-lg"
      placeholder="Quantity"
    />

    <select
      name="unit"
      value={donationForm.unit}
      onChange={handleDonationChange}
      disabled={!isVerified}
      className="border px-3 py-2 rounded-lg"
    >
      <option value="g">g</option>
      <option value="kg">kg</option>
      <option value="packets">packets</option>
    </select>
  </div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Manufacturing Date & Time
  </label>
  <input
    type="datetime-local"
    name="manufacturedDateTime"
    value={donationForm.manufacturedDateTime}
    onChange={handleDonationChange}
    disabled={!isVerified}
    className="w-full border px-3 py-2 rounded-lg"
  />
</div>

  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Expiry Date & Time
  </label>
  <input
    type="datetime-local"
    name="expiryDateTime"
    value={donationForm.expiryDateTime}
    onChange={handleDonationChange}
    disabled={!isVerified}
    className="w-full border px-3 py-2 rounded-lg"
  />
</div>


  <input
    name="city"
    value={donationForm.city}
    onChange={handleDonationChange}
    disabled={!isVerified}
    className="w-full border px-3 py-2 rounded-lg"
    placeholder="City"
  />

  <input
    name="state"
    value={donationForm.state}
    onChange={handleDonationChange}
    disabled={!isVerified}
    className="w-full border px-3 py-2 rounded-lg"
    placeholder="State"
  />

  <button
  type="submit"
  disabled={!isVerified}
  className="w-full bg-black text-white py-2 rounded-lg"
>
  Create Donation
</button>

</form>

          </div>

        </div>

        {/* RIGHT */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Your Donations</h2>
          {/* Search Bar */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex-1 relative">
              <input type="text" placeholder="Search donations" className="w-full border rounded-lg pl-10 pr-4 py-2"/>
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>

  <button className="border rounded-lg p-2">☰</button>
  <button className="border rounded-lg p-2">▦</button>
            </div>
{/* Donation Card */}
{donationsLoading ? (
  <p className="text-sm text-gray-500">Loading donations...</p>
) : donations.length === 0 ? (
  <p className="text-sm text-gray-500">
    You have not created any donations yet.
  </p>
) : (
  <div className="space-y-4">
    {donations.map((donation) => (
  <DonationCard
    key={donation.id}
    donation={donation}
    onDelete={(id) =>
      setDonations((prev) => prev.filter((d) => d.id !== id))
    }
  />
))}
  </div>
)}



        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    UNVERIFIED: "bg-red-100 text-red-600",
    PENDING: "bg-yellow-100 text-yellow-700",
    VERIFIED: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
