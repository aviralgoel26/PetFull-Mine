/**
 * PetFull — Recipient Dashboard
 * A modern SaaS-style food donation management dashboard.
 *
 * Features:
 *  - Sidebar + top navbar layout
 *  - Donation cards with claim confirmation modal
 *  - Status tracking (Available / Claimed / Expired)
 *  - Search + filter (food type, location, expiry)
 *  - Sorting (nearest, latest, quantity)
 *  - Mock distance calculation
 *  - Toast notifications
 *  - Loading skeletons
 *  - Dashboard stats (total claimed, active, history)
 *  - Profile section with preferences
 *  - Dark mode toggle
 *  - Fully responsive
 *
 * Drop-in replacement for the old RecipientDashboard.
 * Swap `api` import and mock data for real backend integration.
 */

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import api from "../api/api";

// ─── Mock Data ────────────────────────────────────────────────────────────────
/**const MOCK_DONATIONS = [
  {
    id: 1,
    foodName: "Biryani & Raita",
    description: "Freshly prepared biryani, enough for 30 people. Vegetarian.",
    quantity: 30,
    unit: "servings",
    city: "Ludhiana",
    foodType: "veg",
    latitude: 30.9,
    longitude: 75.85,
    expiryDateTime: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    status: "available",
    donor: "Sharma Family",
    image: null,
  },
  {
    id: 2,
    foodName: "Bread Loaves",
    description: "Packed bread loaves from a local bakery, best before today.",
    quantity: 50,
    unit: "loaves",
    city: "Chandigarh",
    foodType: "veg",
    latitude: 30.73,
    longitude: 76.78,
    expiryDateTime: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    status: "available",
    donor: "City Bakery",
    image: null,
  },
  {
    id: 3,
    foodName: "Dal Makhani",
    description: "Home-cooked dal makhani with rice. Non-vegetarian ghee used.",
    quantity: 15,
    unit: "servings",
    city: "Ludhiana",
    foodType: "nonveg",
    latitude: 30.91,
    longitude: 75.86,
    expiryDateTime: new Date(Date.now() + 1.5 * 3600 * 1000).toISOString(),
    status: "available",
    donor: "Kaur Household",
    image: null,
  },
  {
    id: 4,
    foodName: "Vegetable Pulao",
    description: "Party leftovers — vegetable pulao with mixed raita.",
    quantity: 60,
    unit: "servings",
    city: "Amritsar",
    foodType: "veg",
    latitude: 31.63,
    longitude: 74.87,
    expiryDateTime: new Date(Date.now() + 7 * 3600 * 1000).toISOString(),
    status: "available",
    donor: "Punjab Events Co.",
    image: null,
  },
  {
    id: 5,
    foodName: "Chicken Curry",
    description: "Restaurant surplus chicken curry. Serves approximately 20.",
    quantity: 20,
    unit: "servings",
    city: "Ludhiana",
    foodType: "nonveg",
    latitude: 30.88,
    longitude: 75.84,
    expiryDateTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    status: "claimed",
    donor: "Taj Dhaba",
    image: null,
  },
  {
    id: 6,
    foodName: "Mixed Fruit Box",
    description: "Assorted seasonal fruits from a supermarket surplus.",
    quantity: 40,
    unit: "kg",
    city: "Ludhiana",
    foodType: "veg",
    latitude: 30.89,
    longitude: 75.83,
    expiryDateTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    status: "available",
    donor: "FreshMart",
    image: null,
  },
];

const MOCK_USER = {
  id: 2,
  name: "Priya Ngo",
  org: "Feed Punjab Foundation",
  avatar: "PN",
  location: { latitude: 30.9, longitude: 75.85 },
  preferences: { dietType: "both", maxDistance: 50 },
  totalClaimed: 12,
  activeClaims: 2,
};
*/
// ─── Utility Helpers ──────────────────────────────────────────────────────────
/** Haversine distance in km between two lat/lng points */
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Format expiry as human-readable countdown */
function formatExpiry(isoString) {
  const diff = new Date(isoString) - Date.now();
  if (diff <= 0) return { label: "Expired", urgency: "expired" };
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours < 2) return { label: `${hours}h ${mins}m left`, urgency: "critical" };
  if (hours < 6) return { label: `${hours}h left`, urgency: "warning" };
  return { label: `${hours}h left`, urgency: "safe" };
}

/** Debounce hook */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Inline Styles (CSS-in-JS) ─────────────────────────────────────────────────
// Using a CSS string injected into <style> for richer pseudo-class support

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f4f6fb;
    --surface: #ffffff;
    --surface2: #f0f2f7;
    --border: #e4e7ef;
    --text: #0f1523;
    --text2: #5a6278;
    --text3: #9ba3b8;
    --green: #16a34a;
    --green-light: #dcfce7;
    --green-dark: #14532d;
    --amber: #d97706;
    --amber-light: #fef3c7;
    --red: #dc2626;
    --red-light: #fee2e2;
    --blue: #2563eb;
    --blue-light: #dbeafe;
    --sidebar-w: 240px;
    --nav-h: 60px;
    --radius: 12px;
    --radius-sm: 8px;
    --shadow: 0 1px 3px rgba(15,21,35,.06), 0 4px 16px rgba(15,21,35,.06);
    --shadow-md: 0 4px 24px rgba(15,21,35,.10);
    --font: 'DM Sans', sans-serif;
    --font-display: 'Syne', sans-serif;
    --transition: 200ms cubic-bezier(.4,0,.2,1);
  }

  [data-theme="dark"] {
    --bg: #0d1117;
    --surface: #161b27;
    --surface2: #1e2535;
    --border: #2a3348;
    --text: #e8ecf4;
    --text2: #8b97b4;
    --text3: #4e5d7a;
    --green-light: #14532d;
    --green-dark: #86efac;
    --amber-light: #451a03;
    --red-light: #450a0a;
    --blue-light: #1e3a8a;
    --shadow: 0 1px 3px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.3);
    --shadow-md: 0 4px 24px rgba(0,0,0,.5);
  }

  body { font-family: var(--font); background: var(--bg); color: var(--text); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  /* Skeleton shimmer */
  @keyframes shimmer {
    0% { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: var(--radius-sm);
  }

  /* Toast slide-in */
  @keyframes toastIn {
    from { transform: translateX(120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes toastOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(120%); opacity: 0; }
  }

  /* Card hover lift */
  .donation-card {
    transition: transform var(--transition), box-shadow var(--transition);
  }
  .donation-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }

  /* Sidebar nav item */
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 14px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--text2);
    transition: background var(--transition), color var(--transition);
    user-select: none;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active {
    background: var(--green-light);
    color: var(--green);
  }
  [data-theme="dark"] .nav-item.active { color: var(--green-dark); }

  /* Claim button */
  .btn-claim {
    width: 100%;
    padding: 10px;
    background: var(--green);
    color: #fff;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 600;
    font-family: var(--font);
    cursor: pointer;
    transition: background var(--transition), transform var(--transition);
    letter-spacing: .3px;
  }
  .btn-claim:hover:not(:disabled) { background: #15803d; transform: scale(1.02); }
  .btn-claim:active:not(:disabled) { transform: scale(0.98); }
  .btn-claim:disabled { background: var(--text3); cursor: not-allowed; }

  .btn-secondary {
    padding: 9px 18px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 500;
    font-family: var(--font);
    color: var(--text2);
    cursor: pointer;
    transition: background var(--transition);
  }
  .btn-secondary:hover { background: var(--surface2); }

  .btn-primary {
    padding: 9px 20px;
    background: var(--green);
    color: #fff;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 600;
    font-family: var(--font);
    cursor: pointer;
    transition: background var(--transition);
  }
  .btn-primary:hover { background: #15803d; }

  /* Input / Select */
  .form-input {
    width: 100%;
    padding: 9px 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: var(--font);
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color var(--transition);
  }
  .form-input:focus { border-color: var(--green); }
  .form-input::placeholder { color: var(--text3); }

  /* Modal overlay */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 150ms ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-box {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 28px;
    width: 90%;
    max-width: 440px;
    box-shadow: var(--shadow-md);
    animation: slideUp 200ms cubic-bezier(.4,0,.2,1);
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* Badge */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .2px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .sidebar { display: none !important; }
    .main-content { margin-left: 0 !important; }
    .donations-grid { grid-template-columns: 1fr !important; }
    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .filter-row { flex-direction: column !important; }
  }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Inject global CSS once */
const StyleTag = () => (
  <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
);

// ─── Toast System ──────────────────────────────────────────────────────────────

let toastId = 0;

function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        400
      );
    }, duration);
  }, []);

  return { toasts, addToast };
}

const TOAST_ICON = { success: "✓", error: "✕", info: "i", warning: "!" };
const TOAST_COLORS = {
  success: { bg: "#16a34a", border: "#15803d" },
  error: { bg: "#dc2626", border: "#b91c1c" },
  warning: { bg: "#d97706", border: "#b45309" },
  info: { bg: "#2563eb", border: "#1d4ed8" },
};

function ToastContainer({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => {
        const c = TOAST_COLORS[t.type] || TOAST_COLORS.info;
        return (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              background: "#fff",
              borderLeft: `4px solid ${c.bg}`,
              borderRadius: 10,
              boxShadow: "0 4px 24px rgba(0,0,0,.15)",
              minWidth: 260,
              maxWidth: 360,
              animation: t.exiting
                ? "toastOut 350ms forwards"
                : "toastIn 300ms cubic-bezier(.4,0,.2,1)",
              pointerEvents: "all",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: c.bg,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {TOAST_ICON[t.type]}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#0f1523" }}>
              {t.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Skeleton Loader ───────────────────────────────────────────────────────────

function DonationCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius)",
        padding: 20,
        border: "1px solid var(--border)",
      }}
    >
      {[80, 120, 60, 60, 40, 36].map((w, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: i === 0 ? 18 : i === 5 ? 36 : 14,
            width: `${w}%`,
            marginBottom: i === 4 ? 12 : 8,
            marginTop: i === 5 ? 8 : 0,
          }}
        />
      ))}
    </div>
  );
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────────

function ClaimModal({ donation, onConfirm, onCancel, claiming }) {
  if (!donation) return null;
  const expiry = formatExpiry(donation.expiryDateTime);
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--green)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
            Claim Donation
          </p>
          <h2 style={{ fontSize: 20, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>
            {donation.foodName}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 6 }}>
            from <strong>{donation.donor}</strong> in {donation.city}
          </p>
        </div>

        {/* Details */}
        <div style={{ background: "var(--surface2)", borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["Quantity", `${donation.quantity} ${donation.unit}`],
            ["Type", donation.foodType === "veg" ? "🥦 Vegetarian" : "🍗 Non-Veg"],
            ["Location", donation.city],
            ["Expires", expiry.label],
          ].map(([label, val]) => (
            <div key={label}>
              <p style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>{label}</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginTop: 2 }}>{val}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 20, lineHeight: 1.6 }}>
          By claiming, you confirm you'll collect this donation promptly. Please coordinate pickup with the donor.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onCancel} disabled={claiming}>
            Cancel
          </button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={onConfirm} disabled={claiming}>
            {claiming ? "Claiming…" : "✓  Confirm Claim"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Donation Card ─────────────────────────────────────────────────────────────

function DonationCard({ donation, userLocation, onClaimClick }) {
  const expiry = formatExpiry(donation.expiryDateTime);
  const dist = userLocation
    ? getDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        donation.latitude,
        donation.longitude
      ).toFixed(1)
    : null;

  const urgencyColors = {
    critical: { bg: "var(--red-light)", text: "var(--red)" },
    warning: { bg: "var(--amber-light)", text: "var(--amber)" },
    safe: { bg: "var(--green-light)", text: "var(--green)" },
    expired: { bg: "var(--surface2)", text: "var(--text3)" },
  };
  const uc = urgencyColors[expiry.urgency];

  return (
    <div
      className="donation-card"
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        boxShadow: "var(--shadow)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent strip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background:
            donation.foodType === "veg"
              ? "linear-gradient(90deg, #16a34a, #4ade80)"
              : "linear-gradient(90deg, #ea580c, #fb923c)",
        }}
      />

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, marginTop: 6 }}>
        <div style={{ flex: 1, paddingRight: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--text)", lineHeight: 1.3 }}>
            {donation.foodName}
          </h3>
          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>by {donation.donor?.fullName}</p>
        </div>
        <span
          className="badge"
          style={{
            background: donation.foodType === "veg" ? "var(--green-light)" : "#ffedd5",
            color: donation.foodType === "veg" ? "var(--green)" : "#c2410c",
            flexShrink: 0,
          }}
        >
          {donation.foodType === "veg" ? "🥦 Veg" : "🍗 Non-Veg"}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.55, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {donation.description}
      </p>

      {/* Meta chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        <Chip icon="📦" label={`${donation.quantity} ${donation.unit}`} />
        <Chip icon="📍" label={donation.city} />
        {dist && <Chip icon="🛣️" label={`${dist} km away`} />}
      </div>

      {/* Expiry badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span
          className="badge"
          style={{ background: uc.bg, color: uc.text }}
        >
          ⏱ {expiry.label}
        </span>
      </div>

      {/* Claim button */}
      <button
        className="btn-claim"
        onClick={() => onClaimClick(donation)}
        disabled={expiry.urgency === "expired"}
        style={{ marginTop: "auto" }}
      >
        {expiry.urgency === "expired" ? "Expired" : "Claim Donation →"}
      </button>
    </div>
  );
}

function Chip({ icon, label }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 9px",
        background: "var(--surface2)",
        borderRadius: 99,
        fontSize: 12,
        color: "var(--text2)",
        fontWeight: 500,
        border: "1px solid var(--border)",
      }}
    >
      <span style={{ fontSize: 11 }}>{icon}</span> {label}
    </span>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color = "var(--green)", bgColor = "var(--green-light)" }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "var(--shadow)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", lineHeight: 1.2 }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: "donations", label: "Available Donations", icon: "🍱" },
  { key: "history", label: "Claim History", icon: "📋" },
  { key: "profile", label: "My Profile", icon: "👤" },
];

function Sidebar({ activeTab, setActiveTab, user }) {
  return (
    <aside
      className="sidebar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "var(--sidebar-w)",
        height: "100vh",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        padding: "0 12px 20px",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 8px 24px", borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            🐾
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text)", lineHeight: 1 }}>PetFull</p>
            <p style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>Recipient Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "var(--text3)", textTransform: "uppercase", padding: "0 8px 8px" }}>Menu</p>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.key}
            className={`nav-item ${activeTab === item.key ? "active" : ""}`}
            onClick={() => setActiveTab(item.key)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", alignItems: "center", gap: 10, padding: "14px 8px 0" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--green)", flexShrink: 0 }}>
          {user.avatar}
        </div>
        <div style={{ overflow: "hidden" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
          <p style={{ fontSize: 11, color: "var(--text3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.org}</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Top Navbar ────────────────────────────────────────────────────────────────

function TopNav({ activeTab, darkMode, setDarkMode, notifCount }) {
  const titles = { donations: "Available Donations", history: "Claim History", profile: "My Profile" };
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: "var(--sidebar-w)",
        right: 0,
        height: "var(--nav-h)",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        zIndex: 99,
      }}
    >
      <h1 style={{ fontSize: 17, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--text)" }}>
        {titles[activeTab]}
      </h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Notification bell */}
        <button
          style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 6 }}
          title="Notifications"
        >
          🔔
          {notifCount > 0 && (
            <span style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "var(--red)", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {notifCount}
            </span>
          )}
        </button>

        {/* Dark mode */}
        <button
          onClick={() => setDarkMode((p) => !p)}
          style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 99, padding: "5px 12px", cursor: "pointer", fontSize: 13, color: "var(--text2)", fontFamily: "var(--font)", fontWeight: 500 }}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}

// ─── Donations Tab ─────────────────────────────────────────────────────────────

function DonationsTab({ donations, loading, userLocation, onClaimClick }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const debouncedSearch = useDebounce(search);

  const cities = useMemo(
    () => ["all", ...new Set(donations.map((d) => d.city))],
    [donations]
  );

  const filtered = useMemo(() => {
    let list = [...donations];

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (d) =>
          d.foodName.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.donor.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filterType !== "all") list = list.filter((d) => d.foodType === filterType);

    // City filter
    if (filterCity !== "all") list = list.filter((d) => d.city === filterCity);

    // Sort
    if (sortBy === "latest") {
      list.sort((a, b) => new Date(a.expiryDateTime) - new Date(b.expiryDateTime));
    } else if (sortBy === "quantity") {
      list.sort((a, b) => b.quantity - a.quantity);
    } else if (sortBy === "nearest" && userLocation) {
      list.sort(
        (a, b) =>
          getDistanceKm(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude) -
          getDistanceKm(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude)
      );
    }

    return list;
  }, [donations, debouncedSearch, filterType, filterCity, sortBy, userLocation]);

  return (
    <div>
      {/* Filters */}
      <div
        className="filter-row"
        style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}
      >
        <input
          className="form-input"
          style={{ maxWidth: 280 }}
          placeholder="🔍  Search donations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input" style={{ width: 140 }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All types</option>
          <option value="veg">Veg only</option>
          <option value="nonveg">Non-Veg only</option>
        </select>
        <select className="form-input" style={{ width: 160 }} value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
          {cities.map((c) => (
            <option key={c} value={c}>{c === "all" ? "All cities" : c}</option>
          ))}
        </select>
        <select className="form-input" style={{ width: 160 }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">Expiring soon</option>
          <option value="nearest">Nearest first</option>
          <option value="quantity">Most quantity</option>
        </select>
      </div>

      {/* Result count */}
      {!loading && (
        <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
          {filtered.length} donation{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="donations-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <DonationCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🍱"
          title="No donations found"
          subtitle="Try adjusting your filters or check back later."
        />
      ) : (
        <div
          className="donations-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}
        >
          {filtered.map((d) => (
            <DonationCard
              key={d.id}
              donation={d}
              userLocation={userLocation}
              onClaimClick={onClaimClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── History Tab ───────────────────────────────────────────────────────────────

function HistoryTab({ history, loading }) {
  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 72, borderRadius: "var(--radius)" }} />
      ))}
    </div>
  );

  if (!history.length) return (
    <EmptyState icon="📋" title="No claim history yet" subtitle="Your claimed donations will appear here." />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {history.map((d) => (
        <div
          key={d.id}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "var(--shadow)",
          }}
        >
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{d.foodName}</p>
            <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>
              {d.city} · {d.quantity} {d.unit} · by {d.donor?.fullName}
            </p>
          </div>
          <span
            className="badge"
            style={{ background: "var(--green-light)", color: "var(--green)" }}
          >
            ✓ Claimed
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Profile Tab ───────────────────────────────────────────────────────────────

function ProfileTab({ user }) {
  const [prefs, setPrefs] = useState(user.preferences);
  return (
    <div style={{ maxWidth: 560 }}>
      {/* Profile card */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 24,
          marginBottom: 20,
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "var(--green)" }}>
            {user.avatar}
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text)" }}>{user.name}</h2>
            <p style={{ fontSize: 13, color: "var(--text3)" }}>{user.org}</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            ["Location", "Ludhiana, Punjab"],
            ["Member since", "Jan 2024"],
            ["Total claimed", `${user.totalClaimed} donations`],
            ["Active claims", `${user.activeClaims}`],
          ].map(([label, val]) => (
            <div key={label} style={{ background: "var(--surface2)", borderRadius: "var(--radius-sm)", padding: "10px 14px" }}>
              <p style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 3 }}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 24,
          boxShadow: "var(--shadow)",
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: 18 }}>
          Preferences
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500, display: "block", marginBottom: 6 }}>
              Diet preference
            </label>
            <select
              className="form-input"
              value={prefs.dietType}
              onChange={(e) => setPrefs((p) => ({ ...p, dietType: e.target.value }))}
            >
              <option value="both">Both (Veg + Non-Veg)</option>
              <option value="veg">Vegetarian only</option>
              <option value="nonveg">Non-Vegetarian only</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500, display: "block", marginBottom: 6 }}>
              Max distance: <strong>{prefs.maxDistance} km</strong>
            </label>
            <input
              type="range"
              min={1}
              max={200}
              value={prefs.maxDistance}
              onChange={(e) => setPrefs((p) => ({ ...p, maxDistance: +e.target.value }))}
              style={{ width: "100%", accentColor: "var(--green)" }}
            />
          </div>

          <button className="btn-primary" style={{ alignSelf: "flex-start", padding: "9px 24px" }}>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "var(--text3)" }}>{subtitle}</p>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

const RecipientDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("donations");
  const [claimTarget, setClaimTarget] = useState(null); // donation to confirm
  const [claiming, setClaiming] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { toasts, addToast } = useToasts();

  const user = {
  id: 2,
  name: "Recipient",
  avatar: "R",
  org: "NGO",
  location: { latitude: 0, longitude: 0 },
  preferences: { dietType: "both", maxDistance: 50 },
  totalClaimed: 0,
  activeClaims: 0,
};

  // Dark mode
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Fetch available donations
  const fetchDonations = useCallback(async () => {
  try {
    setLoading(true);
    const res = await api.get("/donations/available");

    // Best practice: Map your data immediately after receiving it
    const mapped = res.data.map(d => ({
      ...d,
      donor: d.donor?.fullName || "Unknown",
      foodType: "veg", // Temporary placeholder
      latitude: 0,
      longitude: 0,
    }));

    setDonations(mapped);
  } catch (err) {
    // Better user feedback
    addToast("Failed to load donations. Please retry.", "error");
    console.error(err);
  } finally {
    // Ensures the loading spinner stops even if there's an error
    setLoading(false);
  }
}, [addToast]); // Dependencies for useCallback

  // Fetch history
  const fetchHistory = useCallback(async () => {
  try {
    setHistoryLoading(true);

    const res = await api.get(`/donations/claimed?userId=${user.id}`);

    const mapped = res.data.map(d => ({
      ...d,
      donor: d.donor?.fullName || "Unknown",
    }));

    setHistory(mapped);

  } catch (err) {
    console.error("Failed to fetch history", err);
  } finally {
    setHistoryLoading(false);
  }
}, [user.id]);

  useEffect(() => {
    fetchDonations();
    fetchHistory();
  }, [fetchDonations, fetchHistory]);

  // Simulate real-time: re-fetch available donations every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDonations();
      addToast("Donations refreshed!", "info", 2000);
    }, 60_000);
    return () => clearInterval(interval);
  }, [fetchDonations, addToast]);

  // Handle claim confirmation
  const handleConfirmClaim = async () => {
    if (!claimTarget) return;
    const id = claimTarget.id;
    try {
      setClaiming(true);
      await api.put(`/donations/claim/${id}?userId=${user.id}`);
       await fetchDonations();
       await fetchHistory();
      // Optimistically remove from available list, add to history
      const claimed = { ...claimTarget, status: "claimed" };
      setDonations((prev) => prev.filter((d) => d.id !== id));
     
      addToast(`"${claimTarget.foodName}" claimed successfully! 🎉`, "success");
      setClaimTarget(null);
    } catch {
      addToast("Failed to claim. It may already be taken.", "error");
    } finally {
      setClaiming(false);
    }
  };

  // Stats derived from data
  const stats = useMemo(() => ({
    available: donations.length,
    claimed: history.length + user.totalClaimed,
    active: user.activeClaims,
    expiringSoon: donations.filter((d) => {
      const hrs = (new Date(d.expiryDateTime) - Date.now()) / 3_600_000;
      return hrs > 0 && hrs < 3;
    }).length,
  }), [donations, history, user]);

  return (
    <>
      <StyleTag />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      {/* Top Nav */}
      <TopNav
        activeTab={activeTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifCount={stats.expiringSoon}
      />

      {/* Main content */}
      <main
        className="main-content"
        style={{
          marginLeft: "var(--sidebar-w)",
          marginTop: "var(--nav-h)",
          padding: "32px 28px",
          minHeight: "calc(100vh - var(--nav-h))",
        }}
      >
        {/* Stats row (shown on donations tab) */}
        {activeTab === "donations" && (
          <div
            className="stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
              marginBottom: 28,
            }}
          >
            <StatCard icon="🍱" label="Available" value={loading ? "–" : stats.available} />
            <StatCard icon="✅" label="Total Claimed" value={stats.claimed} color="var(--blue)" bgColor="var(--blue-light)" />
            <StatCard icon="🔄" label="Active Claims" value={stats.active} color="var(--amber)" bgColor="var(--amber-light)" />
            <StatCard icon="⚡" label="Expiring Soon" value={loading ? "–" : stats.expiringSoon} color="var(--red)" bgColor="var(--red-light)" />
          </div>
        )}

        {/* Tab content */}
        {activeTab === "donations" && (
          <DonationsTab
            donations={donations}
            loading={loading}
            userLocation={user.location}
            onClaimClick={setClaimTarget}
          />
        )}
        {activeTab === "history" && (
          <HistoryTab history={history} loading={historyLoading} />
        )}
        {activeTab === "profile" && <ProfileTab user={user} />}
      </main>

      {/* Claim Confirmation Modal */}
      {claimTarget && (
        <ClaimModal
          donation={claimTarget}
          claiming={claiming}
          onConfirm={handleConfirmClaim}
          onCancel={() => !claiming && setClaimTarget(null)}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />
    </>
  );
};

export default RecipientDashboard;