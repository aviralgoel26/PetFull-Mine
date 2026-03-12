import api from "../api/api";
export default function DonationCard({ donation , onDelete}) {
    const donations = [
  {
    id: 1,
    foodName: "Aaloo Parathe",
    description: "Stuffed aaloo parathas, homemade with dhaniya and spices.",
    quantity: "850 g",
    expiry: "31/12/2025",
    donorName: "Bhallas Kitchen",
    location: "Mumbai, Maharashtra",
    status: "available",
    image: "https://images.unsplash.com/photo-1604908554025-e4778a89c8e4"
  }
];
const handleDelete = async () => {
  if (!window.confirm("Delete this donation?")) return;

  try {
    await api.delete(`/donations/${donation.id}`, {
      headers: {
        "User-Id": 1
      }
    });

    onDelete(donation.id);

  } catch (err) {
    console.error(err);
    alert("Failed to delete donation");
  }
};

  return (
    <div className="flex gap-6 bg-gray-50 border rounded-xl p-4">

      {/* Image */}
      <img
        src={donation.image}
        alt={donation.foodName}
        className="w-40 h-32 object-cover rounded-lg"
      />

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{donation.foodName}</h3>
            <p className="text-sm text-gray-600">
              {donation.description}
            </p>
          </div>

          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
            {donation.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Quantity</span>
            <div className="font-medium">{donation.quantity}</div>
          </div>

          <div>
            <span className="text-gray-500">Expiry Date</span>
            <div className="font-medium">{donation.expiry}</div>
          </div>

          <div>
            <span className="text-gray-500">Donor Name</span>
            <div className="font-medium flex items-center gap-1">
              {donation.donorName}
              <span className="text-green-600 text-xs">✔ Verified</span>
            </div>
          </div>

          <div>
            <span className="text-gray-500">Location</span>
            <div className="font-medium">{donation.location}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <button className="flex items-center gap-1 border px-4 py-2 rounded-lg text-sm">
            ✏ Edit
          </button>

          <button
  onClick={handleDelete}
  className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
>
  Delete
</button>

          <button className="ml-auto text-gray-400 text-xl">⋮</button>
        </div>
      </div>
    </div>
  );
}
