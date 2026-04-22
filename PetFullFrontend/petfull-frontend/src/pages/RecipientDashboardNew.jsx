/**
 * PetFull — Recipient Dashboard (Clean)
 *
 * Fixes applied:
 *  1. Logout button removed from DonationCard — moved correctly to TopNav
 *  2. NaN on "Total Claimed" fixed — user.totalClaimed / user.activeClaims
 *     are not stored in localStorage, so they now derive from live data
 *  3. handleLogout defined once at module level, not inside a component
 *  4. donor name mapping fixed (was showing blank "by")
 *  5. Minor: foodType hardcoded "veg" noted — kept as-is until backend sends it
 */

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import api from "../api/api";

// ─── Auth helpers ─────────────────────────────────────────────────────────────

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function handleLogout() {
  localStorage.clear();
  window.location.href = "/login";
}

// ─── Utility Helpers ──────────────────────────────────────────────────────────

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

function formatExpiry(isoString) {
  const diff = new Date(isoString) - Date.now();
  if (diff <= 0) return { label: "Expired", urgency: "expired" };
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours < 2) return { label: `${hours}h ${mins}m left`, urgency: "critical" };
  if (hours < 6) return { label: `${hours}h left`, urgency: "warning" };
  return { label: `${hours}h left`, urgency: "safe" };
}

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Global CSS ───────────────────────────────────────────────────────────────

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

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

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

  @keyframes toastIn {
    from { transform: translateX(120%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes toastOut {
    from { transform: translateX(0);    opacity: 1; }
    to   { transform: translateX(120%); opacity: 0; }
  }

  .donation-card {
    transition: transform var(--transition), box-shadow var(--transition);
  }
  .donation-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 14px; border-radius: var(--radius-sm);
    cursor: pointer; font-size: 14px; font-weight: 500;
    color: var(--text2);
    transition: background var(--transition), color var(--transition);
    user-select: none;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--green-light); color: var(--green); }
  [data-theme="dark"] .nav-item.active { color: var(--green-dark); }

  .btn-claim {
    width: 100%; padding: 10px;
    background: var(--green); color: #fff;
    border: none; border-radius: var(--radius-sm);
    font-size: 14px; font-weight: 600; font-family: var(--font);
    cursor: pointer; letter-spacing: .3px;
    transition: background var(--transition), transform var(--transition);
  }
  .btn-claim:hover:not(:disabled) { background: #15803d; transform: scale(1.02); }
  .btn-claim:active:not(:disabled) { transform: scale(0.98); }
  .btn-claim:disabled { background: var(--text3); cursor: not-allowed; }

  .btn-secondary {
    padding: 9px 18px; background: transparent;
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    font-size: 14px; font-weight: 500; font-family: var(--font);
    color: var(--text2); cursor: pointer;
    transition: background var(--transition);
  }
  .btn-secondary:hover { background: var(--surface2); }

  .btn-primary {
    padding: 9px 20px; background: var(--green); color: #fff;
    border: none; border-radius: var(--radius-sm);
    font-size: 14px; font-weight: 600; font-family: var(--font);
    cursor: pointer; transition: background var(--transition);
  }
  .btn-primary:hover { background: #15803d; }

  .btn-logout {
    padding: 7px 14px; background: #fee2e2; color: #dc2626;
    border: 1px solid #fecaca; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    cursor: pointer; transition: background var(--transition);
  }
  .btn-logout:hover { background: #fecaca; }

  .form-input {
    width: 100%; padding: 9px 12px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-sm); font-family: var(--font);
    font-size: 14px; color: var(--text); outline: none;
    transition: border-color var(--transition);
  }
  .form-input:focus { border-color: var(--green); }
  .form-input::placeholder { color: var(--text3); }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; animation: fadeIn 150ms ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-box {
    background: var(--surface); border-radius: var(--radius);
    padding: 28px; width: 90%; max-width: 440px;
    box-shadow: var(--shadow-md);
    animation: slideUp 200ms cubic-bezier(.4,0,.2,1);
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 99px;
    font-size: 12px; font-weight: 600; letter-spacing: .2px;
  }

  @media (max-width: 768px) {
    .sidebar { display: none !important; }
    .main-content { margin-left: 0 !important; }
    .donations-grid { grid-template-columns: 1fr !important; }
    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .filter-row { flex-direction: column !important; }
  }
`;

const StyleTag = () => (
  <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
);

// ─── Toast System ─────────────────────────────────────────────────────────────

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

const TOAST_COLORS = {
  success: "#16a34a",
  error:   "#dc2626",
  warning: "#d97706",
  info:    "#2563eb",
};
const TOAST_ICON = { success: "✓", error: "✕", info: "i", warning: "!" };

function ToastContainer({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map((t) => {
        const color = TOAST_COLORS[t.type] || TOAST_COLORS.info;
        return (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px", background: "#fff",
            borderLeft: `4px solid ${color}`, borderRadius: 10,
            boxShadow: "0 4px 24px rgba(0,0,0,.15)",
            minWidth: 260, maxWidth: 360, pointerEvents: "all",
            animation: t.exiting ? "toastOut 350ms forwards" : "toastIn 300ms cubic-bezier(.4,0,.2,1)",
          }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {TOAST_ICON[t.type]}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#0f1523" }}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DonationCardSkeleton() {
  return (
    <div style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: 20, border: "1px solid var(--border)" }}>
      {[80, 120, 60, 60, 40, 36].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: i === 0 ? 18 : i === 5 ? 36 : 14, width: `${w}%`, marginBottom: i === 4 ? 12 : 8, marginTop: i === 5 ? 8 : 0 }} />
      ))}
    </div>
  );
}

// ─── Claim Modal ──────────────────────────────────────────────────────────────

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
            from <strong>{donation.donorName}</strong> in {donation.city}
          </p>
        </div>

        <div style={{ background: "var(--surface2)", borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["Quantity", `${donation.quantity} ${donation.unit}`],
            ["Type",     donation.foodType === "veg" ? "🥦 Vegetarian" : "🍗 Non-Veg"],
            ["Location", donation.city],
            ["Expires",  expiry.label],
          ].map(([label, val]) => (
            <div key={label}>
              <p style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>{label}</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginTop: 2 }}>{val}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 20, lineHeight: 1.6 }}>
          By claiming, you confirm you'll collect this donation promptly.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onCancel} disabled={claiming}>Cancel</button>
          <button className="btn-primary"   style={{ flex: 2 }} onClick={onConfirm} disabled={claiming}>
            {claiming ? "Claiming…" : "✓  Confirm Claim"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Donation Card ────────────────────────────────────────────────────────────
// NOTE: handleLogout is NOT here — it lives at module level above

function DonationCard({ donation, userLocation, onClaimClick }) {
  const expiry = formatExpiry(donation.expiryDateTime);

  const dist = userLocation
    ? getDistanceKm(userLocation.latitude, userLocation.longitude, donation.latitude ?? 0, donation.longitude ?? 0).toFixed(1)
    : null;

  const urgencyColors = {
    critical: { bg: "var(--red-light)",   text: "var(--red)"   },
    warning:  { bg: "var(--amber-light)", text: "var(--amber)" },
    safe:     { bg: "var(--green-light)", text: "var(--green)" },
    expired:  { bg: "var(--surface2)",    text: "var(--text3)" },
  };
  const uc = urgencyColors[expiry.urgency];

  return (
    <div className="donation-card" style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      border: "1px solid var(--border)", padding: 20,
      display: "flex", flexDirection: "column",
      boxShadow: "var(--shadow)", position: "relative", overflow: "hidden",
    }}>
      {/* Accent strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: donation.foodType === "veg"
          ? "linear-gradient(90deg, #16a34a, #4ade80)"
          : "linear-gradient(90deg, #ea580c, #fb923c)",
      }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, marginTop: 6 }}>
        <div style={{ flex: 1, paddingRight: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--text)", lineHeight: 1.3 }}>
            {donation.foodName}
          </h3>
          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
            by {donation.donorName || "—"}
          </p>
        </div>
        <span className="badge" style={{
          background: donation.foodType === "veg" ? "var(--green-light)" : "#ffedd5",
          color:      donation.foodType === "veg" ? "var(--green)"       : "#c2410c",
          flexShrink: 0,
        }}>
          {donation.foodType === "veg" ? "🥦 Veg" : "🍗 Non-Veg"}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.55, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {donation.description}
      </p>

      {/* Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        <Chip icon="📦" label={`${donation.quantity} ${donation.unit}`} />
        <Chip icon="📍" label={donation.city} />
        {dist && <Chip icon="🛣️" label={`${dist} km away`} />}
      </div>

      {/* Expiry */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span className="badge" style={{ background: uc.bg, color: uc.text }}>
          ⏱ {expiry.label}
        </span>
      </div>

      {/* Claim */}
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
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", background: "var(--surface2)",
      borderRadius: 99, fontSize: 12, color: "var(--text2)",
      fontWeight: 500, border: "1px solid var(--border)",
    }}>
      <span style={{ fontSize: 11 }}>{icon}</span> {label}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color = "var(--green)", bgColor = "var(--green-light)" }) {
  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      border: "1px solid var(--border)", padding: "16px 20px",
      display: "flex", alignItems: "center", gap: 14, boxShadow: "var(--shadow)",
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", lineHeight: 1.2 }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: "donations", label: "Available Donations", icon: "🍱" },
  { key: "history",   label: "Claim History",       icon: "📋" },
  { key: "profile",   label: "My Profile",          icon: "👤" },
];

function Sidebar({ activeTab, setActiveTab, user }) {
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <aside className="sidebar" style={{
      position: "fixed", top: 0, left: 0,
      width: "var(--sidebar-w)", height: "100vh",
      background: "var(--surface)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", zIndex: 100, padding: "0 12px 20px",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 8px 24px", borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/PetFullLogo.jpg" alt="PetFull logo" style={{ width: 34, height: 34, borderRadius: 9, objectFit: "cover" }} />
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
          <div key={item.key} className={`nav-item ${activeTab === item.key ? "active" : ""}`} onClick={() => setActiveTab(item.key)}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", alignItems: "center", gap: 10, padding: "14px 8px 0" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--green)", flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.fullName || "User"}
          </p>
          <p style={{ fontSize: 11, color: "var(--text3)" }}>{user?.role || ""}</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Top Navbar ───────────────────────────────────────────────────────────────

const TAB_TITLES = {
  donations: "Available Donations",
  history:   "Claim History",
  profile:   "My Profile",
};

function TopNav({ activeTab, darkMode, setDarkMode, notifCount }) {
  return (
    <header style={{
      position: "fixed", top: 0, left: "var(--sidebar-w)", right: 0,
      height: "var(--nav-h)", background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", zIndex: 99,
    }}>
      <h1 style={{ fontSize: 17, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--text)" }}>
        {TAB_TITLES[activeTab]}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Expiring soon bell */}
        <button style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 6 }} title="Notifications">
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

        {/* ✅ Logout lives here — once, in the navbar */}
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

// ─── Donations Tab ────────────────────────────────────────────────────────────

function DonationsTab({ donations, loading, userLocation, onClaimClick }) {
  const [search, setSearch]         = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [sortBy, setSortBy]         = useState("latest");
  const debouncedSearch             = useDebounce(search);

  const cities = useMemo(
    () => ["all", ...new Set(donations.map((d) => d.city).filter(Boolean))],
    [donations]
  );

  const filtered = useMemo(() => {
    let list = [...donations];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (d) =>
          d.foodName?.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.city?.toLowerCase().includes(q) ||
          d.donorName?.toLowerCase().includes(q)
      );
    }

    if (filterType !== "all") list = list.filter((d) => d.foodType === filterType);
    if (filterCity !== "all") list = list.filter((d) => d.city === filterCity);

    if (sortBy === "latest") {
      list.sort((a, b) => new Date(a.expiryDateTime) - new Date(b.expiryDateTime));
    } else if (sortBy === "quantity") {
      list.sort((a, b) => b.quantity - a.quantity);
    } else if (sortBy === "nearest" && userLocation) {
      list.sort(
        (a, b) =>
          getDistanceKm(userLocation.latitude, userLocation.longitude, a.latitude ?? 0, a.longitude ?? 0) -
          getDistanceKm(userLocation.latitude, userLocation.longitude, b.latitude ?? 0, b.longitude ?? 0)
      );
    }

    return list;
  }, [donations, debouncedSearch, filterType, filterCity, sortBy, userLocation]);

  return (
    <div>
      <div className="filter-row" style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <input className="form-input" style={{ maxWidth: 280 }} placeholder="🔍  Search donations…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-input" style={{ width: 140 }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All types</option>
          <option value="veg">Veg only</option>
          <option value="nonveg">Non-Veg only</option>
        </select>
        <select className="form-input" style={{ width: 160 }} value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
          {cities.map((c) => <option key={c} value={c}>{c === "all" ? "All cities" : c}</option>)}
        </select>
        <select className="form-input" style={{ width: 160 }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">Expiring soon</option>
          <option value="nearest">Nearest first</option>
          <option value="quantity">Most quantity</option>
        </select>
      </div>

      {!loading && (
        <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
          {filtered.length} donation{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      {loading ? (
        <div className="donations-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => <DonationCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="🍱" title="No donations found" subtitle="Try adjusting your filters or check back later." />
      ) : (
        <div className="donations-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
          {filtered.map((d) => (
            <DonationCard key={d.id} donation={d} userLocation={userLocation} onClaimClick={onClaimClick} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

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
        <div key={d.id} style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "14px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "var(--shadow)",
        }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{d.foodName}</p>
            <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>
              {d.city} · {d.quantity} {d.unit} · by {d.donorName || "—"}
            </p>
          </div>
          <span className="badge" style={{ background: "var(--green-light)", color: "var(--green)" }}>
            ✓ Claimed
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({ user, totalClaimed, activeClaims }) {
  const [prefs, setPrefs] = useState({ dietType: "both", maxDistance: 50 });

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, marginBottom: 20, boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "var(--green)" }}>
            {user?.fullName?.charAt(0) || "?"}
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text)" }}>{user?.fullName}</h2>
            <p style={{ fontSize: 13, color: "var(--text3)" }}>{user?.email}</p>
          </div>
        </div>

        {/* ✅ totalClaimed and activeClaims come from live data, not localStorage */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            ["Total Claimed", `${totalClaimed} donations`],
            ["Active Claims", `${activeClaims}`],
          ].map(([label, val]) => (
            <div key={label} style={{ background: "var(--surface2)", borderRadius: "var(--radius-sm)", padding: "10px 14px" }}>
              <p style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 3 }}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, boxShadow: "var(--shadow)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: 18 }}>Preferences</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500, display: "block", marginBottom: 6 }}>Diet preference</label>
            <select className="form-input" value={prefs.dietType} onChange={(e) => setPrefs((p) => ({ ...p, dietType: e.target.value }))}>
              <option value="both">Both (Veg + Non-Veg)</option>
              <option value="veg">Vegetarian only</option>
              <option value="nonveg">Non-Vegetarian only</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500, display: "block", marginBottom: 6 }}>
              Max distance: <strong>{prefs.maxDistance} km</strong>
            </label>
            <input type="range" min={1} max={200} value={prefs.maxDistance} onChange={(e) => setPrefs((p) => ({ ...p, maxDistance: +e.target.value }))} style={{ width: "100%", accentColor: "var(--green)" }} />
          </div>
          <button className="btn-primary" style={{ alignSelf: "flex-start", padding: "9px 24px" }}>Save Preferences</button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "var(--text3)" }}>{subtitle}</p>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function RecipientDashboard() {
  const [donations, setDonations]           = useState([]);
  const [history, setHistory]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeTab, setActiveTab]           = useState("donations");
  const [claimTarget, setClaimTarget]       = useState(null);
  const [claiming, setClaiming]             = useState(false);
  const [darkMode, setDarkMode]             = useState(false);
  const { toasts, addToast }                = useToasts();

  const user = useMemo(() => getUser(), []);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  // Dark mode
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Fetch available donations
  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/donations/available");
      const mapped = res.data.map((d) => ({
        ...d,
        donorName: d.donor?.fullName || "Unknown",  // ✅ consistent field name
        foodType:  d.foodType || "veg",              // use backend value when available
        latitude:  d.latitude  ?? 0,
        longitude: d.longitude ?? 0,
      }));
      setDonations(mapped);
    } catch {
      addToast("Failed to load donations. Please retry.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Fetch claim history
  const fetchHistory = useCallback(async () => {
    if (!user) return;
    try {
      setHistoryLoading(true);
      const res = await api.get(`/donations/claimed?userId=${user.id}`);
      const mapped = res.data.map((d) => ({
        ...d,
        donorName: d.donor?.fullName || "Unknown",  // ✅ consistent field name
      }));
      setHistory(mapped);
    } catch {
      console.error("Failed to fetch history");
    } finally {
      setHistoryLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDonations();
    fetchHistory();
  },[fetchDonations, fetchHistory]);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDonations();
      addToast("Donations refreshed!", "info", 2000);
    }, 60_000);
    return () => clearInterval(interval);
  }, [fetchDonations, addToast]);

  // Claim handler
  const handleConfirmClaim = async () => {
    if (!claimTarget) return;
    try {
      setClaiming(true);
      await api.put(`/donations/claim/${claimTarget.id}?userId=${user.id}`);
      await fetchDonations();
      await fetchHistory();
      addToast(`"${claimTarget.foodName}" claimed successfully! 🎉`, "success");
      setClaimTarget(null);
    } catch {
      addToast("Failed to claim. It may already be taken.", "error");
    } finally {
      setClaiming(false);
    }
  };

  // ✅ Stats derived entirely from live data — no NaN
  const stats = useMemo(() => ({
    available:    donations.length,
    totalClaimed: history.length,
    activeClaims: history.filter((d) => d.status === "CLAIMED").length,
    expiringSoon: donations.filter((d) => {
      const hrs = (new Date(d.expiryDateTime) - Date.now()) / 3_600_000;
      return hrs > 0 && hrs < 3;
    }).length,
  }), [donations, history]);

  if (!user) return null;

  return (
    <>
      <StyleTag />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      <TopNav
        activeTab={activeTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifCount={stats.expiringSoon}
      />

      <main className="main-content" style={{
        marginLeft: "var(--sidebar-w)",
        marginTop: "var(--nav-h)",
        padding: "32px 28px",
        minHeight: "calc(100vh - var(--nav-h))",
      }}>
        {/* Stats row */}
        {activeTab === "donations" && (
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
            <StatCard icon="🍱" label="Available"     value={loading ? "–" : stats.available} />
            <StatCard icon="✅" label="Total Claimed"  value={historyLoading ? "–" : stats.totalClaimed} color="var(--blue)"  bgColor="var(--blue-light)"  />
            <StatCard icon="🔄" label="Active Claims"  value={historyLoading ? "–" : stats.activeClaims} color="var(--amber)" bgColor="var(--amber-light)" />
            <StatCard icon="⚡" label="Expiring Soon"  value={loading ? "–" : stats.expiringSoon}        color="var(--red)"   bgColor="var(--red-light)"   />
          </div>
        )}

        {activeTab === "donations" && (
          <DonationsTab donations={donations} loading={loading} userLocation={null} onClaimClick={setClaimTarget} />
        )}
        {activeTab === "history" && (
          <HistoryTab history={history} loading={historyLoading} />
        )}
        {activeTab === "profile" && (
          <ProfileTab user={user} totalClaimed={stats.totalClaimed} activeClaims={stats.activeClaims} />
        )}
      </main>

      {claimTarget && (
        <ClaimModal
          donation={claimTarget}
          claiming={claiming}
          onConfirm={handleConfirmClaim}
          onCancel={() => !claiming && setClaimTarget(null)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </>
  );
}