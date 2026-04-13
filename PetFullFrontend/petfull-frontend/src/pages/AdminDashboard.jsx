import { useState, useEffect } from "react";

// ─── Initial Data ────────────────────────────────────────────────────────────
const INIT_DONORS = [
  { id: 1, name: "Arjun Mehta",   email: "arjun@gmail.com",  phone: "9876543210", joined: "Jan 12, 2025", status: "PENDING" },
  { id: 2, name: "Priya Sharma",  email: "priya@gmail.com",  phone: "9123456789", joined: "Jan 15, 2025", status: "PENDING" },
  { id: 3, name: "Ravi Kumar",    email: "ravi@gmail.com",   phone: "9988776655", joined: "Jan 18, 2025", status: "PENDING" },
  { id: 4, name: "Sunita Patel",  email: "sunita@gmail.com", phone: "9870001111", joined: "Jan 05, 2025", status: "VERIFIED" },
  { id: 5, name: "Ankit Joshi",   email: "ankit@gmail.com",  phone: "9871112222", joined: "Dec 20, 2024", status: "VERIFIED" },
  { id: 6, name: "Meera Nair",    email: "meera@gmail.com",  phone: "9872223333", joined: "Dec 28, 2024", status: "VERIFIED" },
  { id: 7, name: "Karan Singh",   email: "karan@gmail.com",  phone: "9873334444", joined: "Jan 02, 2025", status: "UNVERIFIED" },
  { id: 8, name: "Deepa Rao",     email: "deepa@gmail.com",  phone: "9874445555", joined: "Jan 08, 2025", status: "REJECTED" },
];

const INIT_DONATIONS = [
  { id: 1, food: "Dal & Rice (5 portions)", donor: "Sunita Patel", qty: "5 portions", listed: "Apr 10, 2025", expires: "Apr 12, 2025", status: "CLAIMED" },
  { id: 2, food: "Bread Loaves (3)",        donor: "Ankit Joshi",  qty: "3 loaves",   listed: "Apr 11, 2025", expires: "Apr 13, 2025", status: "AVAILABLE" },
  { id: 3, food: "Vegetable Curry",         donor: "Meera Nair",   qty: "4 portions", listed: "Apr 09, 2025", expires: "Apr 11, 2025", status: "EXPIRED" },
  { id: 4, food: "Paneer Biryani",          donor: "Sunita Patel", qty: "8 portions", listed: "Apr 11, 2025", expires: "Apr 14, 2025", status: "AVAILABLE" },
  { id: 5, food: "Fruit Basket",            donor: "Ankit Joshi",  qty: "1 basket",   listed: "Apr 10, 2025", expires: "Apr 13, 2025", status: "CLAIMED" },
  { id: 6, food: "Samosas (20 pcs)",        donor: "Meera Nair",   qty: "20 pcs",     listed: "Apr 08, 2025", expires: "Apr 10, 2025", status: "EXPIRED" },
  { id: 7, food: "Khichdi",                 donor: "Sunita Patel", qty: "6 portions", listed: "Apr 12, 2025", expires: "Apr 14, 2025", status: "AVAILABLE" },
];

const INIT_USERS = [
  { id: 1, name: "Arjun Mehta",  email: "arjun@gmail.com",       role: "DONOR",     joined: "Jan 12, 2025" },
  { id: 2, name: "Priya Sharma", email: "priya@gmail.com",       role: "DONOR",     joined: "Jan 15, 2025" },
  { id: 3, name: "Rahul Dev",    email: "rahul@gmail.com",       role: "RECIPIENT", joined: "Jan 10, 2025" },
  { id: 4, name: "Nisha Gupta",  email: "nisha@gmail.com",       role: "RECIPIENT", joined: "Jan 06, 2025" },
  { id: 5, name: "Sunita Patel", email: "sunita@gmail.com",      role: "DONOR",     joined: "Jan 05, 2025" },
  { id: 6, name: "Vikram Jain",  email: "vikram@gmail.com",      role: "RECIPIENT", joined: "Dec 30, 2024" },
  { id: 7, name: "Super Admin",  email: "admin@foodshare.com",   role: "ADMIN",     joined: "Dec 01, 2024" },
];

const INIT_LOGS = [
  { id: 1, color: "#4ade80", text: "Donor Sunita Patel was approved by admin",            time: "Apr 13, 2025 · 10:32 AM" },
  { id: 2, color: "#ef4444", text: "Donation Vegetable Curry was deleted by admin",       time: "Apr 13, 2025 · 10:10 AM" },
  { id: 3, color: "#60a5fa", text: "New donor Arjun Mehta submitted verification",        time: "Apr 12, 2025 · 03:45 PM" },
  { id: 4, color: "#fbbf24", text: "Donation Samosas (20 pcs) expired automatically",    time: "Apr 10, 2025 · 11:00 PM" },
  { id: 5, color: "#4ade80", text: "Donation Fruit Basket was claimed by Nisha Gupta",   time: "Apr 10, 2025 · 06:22 PM" },
  { id: 6, color: "#ef4444", text: "Donor Deepa Rao was rejected by admin",              time: "Apr 09, 2025 · 02:15 PM" },
  { id: 7, color: "#60a5fa", text: "New user Vikram Jain registered as recipient",       time: "Apr 09, 2025 · 10:00 AM" },
  { id: 8, color: "#4ade80", text: "Donation Dal & Rice was claimed by Rahul Dev",       time: "Apr 08, 2025 · 07:45 PM" },
];

const BAR_DATA = [
  { day: "Mon", val: 38 }, { day: "Tue", val: 52 }, { day: "Wed", val: 41 },
  { day: "Thu", val: 67 }, { day: "Fri", val: 58 }, { day: "Sat", val: 83 }, { day: "Sun", val: 44 },
];
const BAR_COLORS = ["#f97316","#3b82f6","#22c55e","#8b5cf6","#f59e0b","#ef4444","#06b6d4"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const initials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
const avatarBg = (name) => {
  const cols = ["#f97316","#3b82f6","#22c55e","#8b5cf6","#f59e0b","#06b6d4","#ec4899"];
  return cols[name.charCodeAt(0) % cols.length];
};

// ─── Badge ───────────────────────────────────────────────────────────────────
const STATUS_BADGE = {
  PENDING:     { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
  VERIFIED:    { bg: "rgba(34,197,94,0.15)",   color: "#4ade80" },
  UNVERIFIED:  { bg: "rgba(100,116,139,0.2)",  color: "#94a3b8" },
  REJECTED:    { bg: "rgba(239,68,68,0.15)",   color: "#f87171" },
  AVAILABLE:   { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  CLAIMED:     { bg: "rgba(34,197,94,0.15)",   color: "#4ade80" },
  EXPIRED:     { bg: "rgba(239,68,68,0.15)",   color: "#f87171" },
  DONOR:       { bg: "rgba(249,115,22,0.15)",  color: "#fb923c" },
  RECIPIENT:   { bg: "rgba(139,92,246,0.15)",  color: "#a78bfa" },
  ADMIN:       { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
};

function Badge({ status }) {
  const s = STATUS_BADGE[status] || { bg: "#1e2535", color: "#94a3b8" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 10px",
      borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: s.bg, color: s.color, letterSpacing: "0.3px",
    }}>
      {status}
    </span>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, color, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28,
      background: "#161b27", border: "1px solid #1e2535",
      borderRadius: 12, padding: "12px 20px",
      display: "flex", alignItems: "center", gap: 10,
      fontSize: 13, color: "#e2e8f0", zIndex: 9999,
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "all 0.25s ease", pointerEvents: "none",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {msg}
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({ name, size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: avatarBg(name),
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
const ACCENT = { orange:"#f97316", blue:"#3b82f6", green:"#22c55e", red:"#ef4444", purple:"#8b5cf6", amber:"#f59e0b" };
function StatCard({ label, value, icon, accent, sub }) {
  return (
    <div style={{
      background: "#161b27", border: "1px solid #1e2535", borderRadius: 14,
      padding: "18px 20px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: ACCENT[accent] || "#f97316",
      }} />
      <div style={{ position: "absolute", right: 16, top: 16, fontSize: 24, opacity: 0.12 }}>{icon}</div>
      <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#f1f5f9", letterSpacing: -1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#22c55e", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── Filter Bar ──────────────────────────────────────────────────────────────
function FilterBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 400,
      border: active ? "1px solid #f97316" : "1px solid #1e2535",
      background: active ? "#f97316" : "transparent",
      color: active ? "#fff" : "#94a3b8",
      transition: "all 0.15s", fontFamily: "inherit",
    }}>
      {label}
    </button>
  );
}

// ─── Search Input ─────────────────────────────────────────────────────────────
function SearchInput({ placeholder, value, onChange }) {
  return (
    <input
      type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1, maxWidth: 260, padding: "7px 14px", borderRadius: 20,
        border: "1px solid #1e2535", background: "#0f1117",
        color: "#e2e8f0", fontSize: 12, fontFamily: "inherit", outline: "none",
      }}
    />
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────
function ActionBtn({ label, variant, onClick }) {
  const styles = {
    approve: { bg: "rgba(34,197,94,0.15)",  color: "#4ade80" },
    reject:  { bg: "rgba(239,68,68,0.12)",  color: "#f87171" },
    delete:  { bg: "rgba(239,68,68,0.12)",  color: "#f87171" },
  };
  const s = styles[variant];
  return (
    <button onClick={onClick} style={{
      padding: "5px 12px", borderRadius: 7, cursor: "pointer",
      fontSize: 12, fontWeight: 700, fontFamily: "inherit",
      border: "none", background: s.bg, color: s.color, transition: "opacity 0.15s",
    }}
      onMouseOver={e => (e.currentTarget.style.opacity = "0.75")}
      onMouseOut={e => (e.currentTarget.style.opacity = "1")}
    >
      {label}
    </button>
  );
}

// ─── Table Wrapper ────────────────────────────────────────────────────────────
function TableWrap({ children }) {
  return (
    <div style={{ background: "#161b27", border: "1px solid #1e2535", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          {children}
        </table>
      </div>
    </div>
  );
}
const TH = ({ children }) => (
  <th style={{
    padding: "12px 16px", textAlign: "left", fontSize: 11, color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.7px", fontWeight: 700,
    borderBottom: "1px solid #1e2535", background: "#0f1117", whiteSpace: "nowrap",
  }}>{children}</th>
);
const TD = ({ children, style }) => (
  <td style={{ padding: "12px 16px", fontSize: 13, color: "#cbd5e1", borderBottom: "1px solid #1e2535", ...style }}>
    {children}
  </td>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
function Empty() {
  return (
    <tr><td colSpan={10} style={{ textAlign: "center", padding: 48, color: "#475569", fontSize: 14 }}>
      No records found
    </td></tr>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart() {
  const max = Math.max(...BAR_DATA.map(d => d.val));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130 }}>
      {BAR_DATA.map((d, i) => (
        <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: "#94a3b8" }}>{d.val}</span>
          <div style={{
            width: "100%", height: Math.round(d.val / max * 100),
            background: BAR_COLORS[i], borderRadius: "4px 4px 0 0", opacity: 0.82,
            transition: "opacity 0.2s",
          }} />
          <span style={{ fontSize: 9, color: "#64748b" }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart({ available, claimed, expired }) {
  const total = available + claimed + expired;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const pA = (available / total) * circ;
  const pC = (claimed / total) * circ;
  const pE = (expired / total) * circ;
  let offset = 0;
  const segments = [
    { val: pA, color: "#60a5fa", label: "Available", count: available },
    { val: pC, color: "#4ade80", label: "Claimed",   count: claimed },
    { val: pE, color: "#f87171", label: "Expired",   count: expired },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={110} height={110} viewBox="0 0 110 110">
        <circle cx={55} cy={55} r={r} fill="none" stroke="#1e2535" strokeWidth={18} />
        {segments.map((seg, i) => {
          const dash = `${seg.val} ${circ - seg.val}`;
          const off = -offset;
          offset += seg.val;
          return (
            <circle key={i} cx={55} cy={55} r={r} fill="none"
              stroke={seg.color} strokeWidth={18}
              strokeDasharray={dash} strokeDashoffset={-(-circ / 4 + offset - seg.val)}
              transform="rotate(-90 55 55)"
              style={{ strokeDashoffset: circ / 4 - (offset - seg.val) }}
            />
          );
        })}
        <text x={55} y={51} textAnchor="middle" fill="#f1f5f9" fontSize={14} fontWeight={800}>{total}</text>
        <text x={55} y={63} textAnchor="middle" fill="#64748b" fontSize={9}>total</text>
      </svg>
      <div style={{ marginTop: 14, width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
        {segments.map(seg => (
          <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94a3b8" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
            {seg.label}
            <span style={{ marginLeft: "auto", fontWeight: 700, color: "#e2e8f0" }}>{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Nav Icons ────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>,
  donors:    <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 5a5 5 0 0 1 10 0H3z"/></svg>,
  donations: <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a3 3 0 0 1 3 3v1h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V4a3 3 0 0 1 3-3zm0 1.5a1.5 1.5 0 0 0-1.5 1.5v1h3V4A1.5 1.5 0 0 0 8 2.5z"/></svg>,
  users:     <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor"><path d="M6 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3.5 6C2 8 1 9 1 10.5V11h10v-.5C11 9 10 8 9.5 8h-7zM11 7a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm.5 2c-.4 0-.8.1-1.1.3.4.5.6 1.1.6 1.7H15v-.5c0-1-.8-1.5-1.5-1.5h-2z"/></svg>,
  logs:      <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h12v1H2zm0 3h12v1H2zm0 3h8v1H2zm0 3h10v1H2z"/></svg>,
};

// ─── Pages ───────────────────────────────────────────────────────────────────

function DashboardPage({ donors, donations, users, onNavigate }) {
  const totalDonors    = donors.length;
  const totalRecip     = users.filter(u => u.role === "RECIPIENT").length;
  const totalDonations = donations.length;
  const claimed        = donations.filter(d => d.status === "CLAIMED").length;
  const expired        = donations.filter(d => d.status === "EXPIRED").length;
  const available      = donations.filter(d => d.status === "AVAILABLE").length;

  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", letterSpacing: -0.5 }}>Dashboard Overview</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>FoodShare system analytics at a glance</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Users"      value={users.length}   icon="👥" accent="orange" sub="↑ +12 this week" />
        <StatCard label="Total Donors"     value={totalDonors}    icon="🤝" accent="blue"   sub="↑ +5 this week" />
        <StatCard label="Total Recipients" value={totalRecip}     icon="🙋" accent="purple" sub="↑ +7 this week" />
        <StatCard label="Total Donations"  value={totalDonations} icon="🍱" accent="green"  sub="↑ +28 this week" />
        <StatCard label="Claimed"          value={claimed}        icon="✅" accent="amber"  sub={`${Math.round(claimed/totalDonations*100)}% claim rate`} />
        <StatCard label="Expired"          value={expired}        icon="⏰" accent="red"    sub={`${Math.round(expired/totalDonations*100)}% expiry rate`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#161b27", border: "1px solid #1e2535", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 18 }}>
            Donations per day (last 7 days)
          </div>
          <BarChart />
        </div>
        <div style={{ background: "#161b27", border: "1px solid #1e2535", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 18 }}>
            Status distribution
          </div>
          <DonutChart available={available} claimed={claimed} expired={expired} />
        </div>
      </div>

      <div style={{ background: "#161b27", border: "1px solid #1e2535", borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
          Pending donor verifications
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8" }}>
          {donors.filter(d => d.status === "PENDING").length} donors waiting for approval —{" "}
          <span style={{ color: "#f97316", cursor: "pointer", fontWeight: 700 }} onClick={() => onNavigate("donors")}>
            Review now →
          </span>
        </div>
      </div>
    </div>
  );
}

function DonorsPage({ donors, setDonors, showToast, setLogs }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const pending = donors.filter(d => d.status === "PENDING").length;

  const filtered = donors.filter(d =>
    (filter === "ALL" || d.status === filter) &&
    (!search || d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase()))
  );

  const approve = (id) => {
    const d = donors.find(x => x.id === id);
    setDonors(prev => prev.map(x => x.id === id ? { ...x, status: "VERIFIED" } : x));
    setLogs(prev => [{ id: Date.now(), color: "#4ade80", text: `Donor ${d.name} approved by admin`, time: "Just now" }, ...prev]);
    showToast(`${d.name} approved as verified donor`, "#4ade80");
  };
  const reject = (id) => {
    const d = donors.find(x => x.id === id);
    setDonors(prev => prev.map(x => x.id === id ? { ...x, status: "REJECTED" } : x));
    setLogs(prev => [{ id: Date.now(), color: "#ef4444", text: `Donor ${d.name} rejected by admin`, time: "Just now" }, ...prev]);
    showToast(`${d.name} rejected`, "#ef4444");
  };

  const FILTERS = ["ALL", "UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", letterSpacing: -0.5 }}>Donor Verification</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>Approve or reject donor registration requests</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        {FILTERS.map(f => (
          <FilterBtn key={f} active={filter === f}
            label={f === "PENDING" ? `⏳ Pending (${pending})` : f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            onClick={() => setFilter(f)}
          />
        ))}
        <SearchInput placeholder="🔍  Search donor..." value={search} onChange={setSearch} />
      </div>

      <TableWrap>
        <thead>
          <tr>
            <TH>Donor</TH><TH>Email</TH><TH>Phone</TH><TH>Joined</TH><TH>Status</TH><TH>Actions</TH>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? <Empty /> : filtered.map(d => (
            <tr key={d.id} style={{ transition: "background 0.15s" }}
              onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseOut={e => (e.currentTarget.style.background = "transparent")}
            >
              <TD>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Avatar name={d.name} />
                  <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{d.name}</span>
                </div>
              </TD>
              <TD>{d.email}</TD>
              <TD>{d.phone}</TD>
              <TD>{d.joined}</TD>
              <TD><Badge status={d.status} /></TD>
              <TD>
                <div style={{ display: "flex", gap: 6 }}>
                  {d.status !== "VERIFIED"  && <ActionBtn label="✔ Approve" variant="approve" onClick={() => approve(d.id)} />}
                  {d.status !== "REJECTED"  && <ActionBtn label="✖ Reject"  variant="reject"  onClick={() => reject(d.id)} />}
                  {d.status === "VERIFIED" && d.status === "REJECTED" && <span style={{ fontSize: 12, color: "#475569" }}>—</span>}
                </div>
              </TD>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

function DonationsPage({ donations, setDonations, showToast, setLogs }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = donations.filter(d =>
    (filter === "ALL" || d.status === filter) &&
    (!search || d.food.toLowerCase().includes(search.toLowerCase()) || d.donor.toLowerCase().includes(search.toLowerCase()))
  );

  const del = (id) => {
    const d = donations.find(x => x.id === id);
    if (!window.confirm(`Delete "${d.food}"? This cannot be undone.`)) return;
    setDonations(prev => prev.filter(x => x.id !== id));
    setLogs(prev => [{ id: Date.now(), color: "#ef4444", text: `Donation ${d.food} deleted by admin`, time: "Just now" }, ...prev]);
    showToast("Donation deleted", "#ef4444");
  };

  const FILTERS = ["ALL", "AVAILABLE", "CLAIMED", "EXPIRED"];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", letterSpacing: -0.5 }}>All Donations</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>Monitor and manage food donation listings</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        {FILTERS.map(f => (
          <FilterBtn key={f} active={filter === f}
            label={f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            onClick={() => setFilter(f)}
          />
        ))}
        <SearchInput placeholder="🔍  Search food or donor..." value={search} onChange={setSearch} />
      </div>

      <TableWrap>
        <thead>
          <tr>
            <TH>Food Item</TH><TH>Donor</TH><TH>Qty</TH><TH>Listed On</TH><TH>Expires</TH><TH>Status</TH><TH>Actions</TH>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? <Empty /> : filtered.map(d => (
            <tr key={d.id}
              onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseOut={e => (e.currentTarget.style.background = "transparent")}
            >
              <TD style={{ color: "#f1f5f9", fontWeight: 600 }}>{d.food}</TD>
              <TD>{d.donor}</TD>
              <TD>{d.qty}</TD>
              <TD>{d.listed}</TD>
              <TD style={{ color: d.status === "EXPIRED" ? "#f87171" : "#94a3b8" }}>{d.expires}</TD>
              <TD><Badge status={d.status} /></TD>
              <TD><ActionBtn label="🗑 Delete" variant="delete" onClick={() => del(d.id)} /></TD>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

function UsersPage({ users, setUsers, showToast, setLogs }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = users.filter(u =>
    (filter === "ALL" || u.role === filter) &&
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const del = (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This will remove their account permanently.`)) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    setLogs(prev => [{ id: Date.now(), color: "#ef4444", text: `User ${name} deleted by admin`, time: "Just now" }, ...prev]);
    showToast(`User ${name} deleted`, "#ef4444");
  };

  const FILTERS = ["ALL", "DONOR", "RECIPIENT", "ADMIN"];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", letterSpacing: -0.5 }}>User Management</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>View and manage all registered users</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        {FILTERS.map(f => (
          <FilterBtn key={f} active={filter === f}
            label={f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase() + "s"}
            onClick={() => setFilter(f)}
          />
        ))}
        <SearchInput placeholder="🔍  Search user..." value={search} onChange={setSearch} />
      </div>

      <TableWrap>
        <thead>
          <tr><TH>User</TH><TH>Email</TH><TH>Role</TH><TH>Joined</TH><TH>Actions</TH></tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? <Empty /> : filtered.map(u => (
            <tr key={u.id}
              onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseOut={e => (e.currentTarget.style.background = "transparent")}
            >
              <TD>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Avatar name={u.name} />
                  <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{u.name}</span>
                </div>
              </TD>
              <TD>{u.email}</TD>
              <TD><Badge status={u.role} /></TD>
              <TD>{u.joined}</TD>
              <TD>
                {u.role !== "ADMIN"
                  ? <ActionBtn label="🗑 Delete" variant="delete" onClick={() => del(u.id, u.name)} />
                  : <span style={{ fontSize: 12, color: "#475569" }}>Protected</span>
                }
              </TD>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

function LogsPage({ logs }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", letterSpacing: -0.5 }}>Activity Logs</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>Full audit trail of all admin actions</p>
      </div>
      <div style={{ background: "#161b27", border: "1px solid #1e2535", borderRadius: 14, overflow: "hidden" }}>
        {logs.map((log, i) => (
          <div key={log.id} style={{
            display: "flex", gap: 14, padding: "14px 20px",
            borderBottom: i < logs.length - 1 ? "1px solid #1e2535" : "none",
            alignItems: "flex-start",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: log.color, marginTop: 5, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, color: "#cbd5e1" }}>{log.text}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>{log.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "donors",    label: "Donor Verification" },
  { id: "donations", label: "All Donations" },
  { id: "users",     label: "User Management" },
  { id: "logs",      label: "Activity Logs" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [donors, setDonors] = useState(INIT_DONORS);
  const [donations, setDonations] = useState(INIT_DONATIONS);
  const [users, setUsers] = useState(INIT_USERS);
  const [logs, setLogs] = useState(INIT_LOGS);
  const [toast, setToast] = useState({ visible: false, msg: "", color: "#4ade80" });

  const showToast = (msg, color = "#4ade80") => {
    setToast({ visible: true, msg, color });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
  };

  const pendingCount = donors.filter(d => d.status === "PENDING").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f1117", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Sidebar */}
      <aside style={{
        width: 222, minHeight: "100vh", background: "#161b27",
        borderRight: "1px solid #1e2535", display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #1e2535" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #f97316, #ef4444)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
          }}>🍱</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#f97316", letterSpacing: -0.3 }}>FoodShare</div>
            <div style={{ fontSize: 10, color: "#475569" }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "14px 0", flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = page === item.id;
            return (
              <div key={item.id} onClick={() => setPage(item.id)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 20px", cursor: "pointer",
                fontSize: 13, fontWeight: active ? 700 : 400,
                color: active ? "#f97316" : "#94a3b8",
                background: active ? "rgba(249,115,22,0.1)" : "transparent",
                borderLeft: `3px solid ${active ? "#f97316" : "transparent"}`,
                transition: "all 0.15s",
              }}
                onMouseOver={e => { if (!active) { e.currentTarget.style.background = "#1e2535"; e.currentTarget.style.color = "#e2e8f0"; } }}
                onMouseOut={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; } }}
              >
                {Icons[item.id]}
                {item.label}
                {item.id === "donors" && pendingCount > 0 && (
                  <span style={{
                    marginLeft: "auto", background: "#ef4444", color: "#fff",
                    fontSize: 10, fontWeight: 800, padding: "1px 7px", borderRadius: 10,
                  }}>{pendingCount}</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1e2535" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "#fff",
            }}>SA</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>Super Admin</div>
              <div style={{ fontSize: 10, color: "#475569" }}>admin@foodshare.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 222, flex: 1, padding: "30px 32px", minHeight: "100vh" }}>
        {page === "dashboard"  && <DashboardPage donors={donors} donations={donations} users={users} onNavigate={setPage} />}
        {page === "donors"     && <DonorsPage    donors={donors} setDonors={setDonors} showToast={showToast} setLogs={setLogs} />}
        {page === "donations"  && <DonationsPage donations={donations} setDonations={setDonations} showToast={showToast} setLogs={setLogs} />}
        {page === "users"      && <UsersPage     users={users} setUsers={setUsers} showToast={showToast} setLogs={setLogs} />}
        {page === "logs"       && <LogsPage      logs={logs} />}
      </main>

      <Toast msg={toast.msg} color={toast.color} visible={toast.visible} />
    </div>
  );
}