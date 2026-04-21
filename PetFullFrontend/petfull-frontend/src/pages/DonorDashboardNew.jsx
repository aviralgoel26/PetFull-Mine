/**
 * PetFull — Donor Dashboard (Clean)
 *
 * Fixes applied:
 *  1. handleLogout moved to module level, uses localStorage.clear()
 *  2. Removed unused `delay` helper
 *  3. foodType now read from backend instead of hardcoded "veg"
 *  4. user.avatar derived from fullName (was undefined — localStorage has no avatar field)
 *  5. user.name derived from fullName consistently
 *  6. Removed floating handleLogout inside root component
 *  7. AnalyticsPanel guarded against missing user.impactScore / user.badges
 *  8. ProfileTab uses real fields from localStorage user object
 *  9. Verification apply passes correct header
 */

import React, {
  useEffect,
  useState,
  useRef,
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

// ✅ Module-level logout — not inside any component
function handleLogout() {
  localStorage.clear();
  window.location.href = "/login";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const IMPACT_DATA   = [12, 18, 9, 25, 30, 22, 40];
const IMPACT_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Global CSS ───────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #f6f7fb;
    --surface:   #ffffff;
    --surface2:  #f0f2f8;
    --surface3:  #e8eaf2;
    --border:    #e2e5f0;
    --text:      #111827;
    --text2:     #4b5563;
    --text3:     #9ca3af;
    --orange:    #ea580c;
    --orange-lt: #fff7ed;
    --orange-md: #fed7aa;
    --green:     #16a34a;
    --green-lt:  #f0fdf4;
    --amber:     #d97706;
    --amber-lt:  #fffbeb;
    --red:       #dc2626;
    --red-lt:    #fef2f2;
    --blue:      #2563eb;
    --blue-lt:   #eff6ff;
    --sidebar-w: 248px;
    --nav-h:     62px;
    --r:         12px;
    --r-sm:      8px;
    --shadow:    0 1px 2px rgba(0,0,0,.04), 0 2px 8px rgba(0,0,0,.06);
    --shadow-md: 0 4px 20px rgba(0,0,0,.10);
    --font:      'Instrument Sans', sans-serif;
    --font-d:    'Bricolage Grotesque', sans-serif;
    --ease:      cubic-bezier(.4,0,.2,1);
    --t:         180ms;
  }

  [data-theme="dark"] {
    --bg:       #0c0e14;
    --surface:  #13161f;
    --surface2: #1c2030;
    --surface3: #252a3b;
    --border:   #2a3148;
    --text:     #e8ecf4;
    --text2:    #8b97b4;
    --text3:    #4a5470;
    --orange-lt:#2a1500;
    --green-lt: #052010;
    --amber-lt: #251800;
    --red-lt:   #200808;
    --blue-lt:  #0d1e40;
    --shadow:   0 1px 2px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.4);
    --shadow-md:0 4px 20px rgba(0,0,0,.6);
  }

  html, body { height: 100%; font-family: var(--font); background: var(--bg); color: var(--text); }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, var(--surface2) 25%, var(--surface3) 50%, var(--surface2) 75%);
    background-size: 700px 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--r-sm);
  }

  @keyframes toastIn  { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes toastOut { from { opacity: 1; } to { opacity: 0; transform: translateX(30px); } }

  .d-card { transition: transform var(--t) var(--ease), box-shadow var(--t) var(--ease); }
  .d-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 13px; border-radius: var(--r-sm);
    font-size: 13.5px; font-weight: 500; color: var(--text2);
    cursor: pointer; transition: background var(--t), color var(--t);
    user-select: none;
  }
  .nav-item:hover  { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--orange-lt); color: var(--orange); }

  .btn { border: none; border-radius: var(--r-sm); font-family: var(--font); font-weight: 600; cursor: pointer; transition: all var(--t); }
  .btn-orange { background: var(--orange); color: #fff; padding: 10px 18px; font-size: 14px; }
  .btn-orange:hover:not(:disabled) { background: #c2410c; }
  .btn-orange:disabled { background: var(--text3); cursor: not-allowed; }
  .btn-ghost  { background: transparent; border: 1px solid var(--border); color: var(--text2); padding: 8px 14px; font-size: 13px; }
  .btn-ghost:hover { background: var(--surface2); }
  .btn-danger { background: var(--red-lt); color: var(--red); padding: 7px 13px; font-size: 12px; border: 1px solid #fecaca; }
  .btn-danger:hover { background: #fee2e2; }
  .btn-logout { background: #fee2e2; color: var(--red); border: 1px solid #fecaca; padding: 7px 14px; font-size: 13px; border-radius: var(--r-sm); font-weight: 600; cursor: pointer; transition: background var(--t); }
  .btn-logout:hover { background: #fecaca; }

  .f-input {
    width: 100%; padding: 9px 12px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--r-sm); font-family: var(--font); font-size: 13.5px;
    color: var(--text); outline: none; transition: border-color var(--t);
  }
  .f-input:focus { border-color: var(--orange); }
  .f-input::placeholder { color: var(--text3); }
  .f-input:disabled { opacity: .45; cursor: not-allowed; }

  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 99px; font-size: 11.5px; font-weight: 600; letter-spacing: .2px; }

  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 150ms; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--surface); border-radius: var(--r); padding: 28px; width: 90%; max-width: 480px; box-shadow: var(--shadow-md); animation: slideUp 200ms var(--ease); }
  @keyframes slideUp { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .bar-wrap { display: flex; align-items: flex-end; gap: 5px; height: 80px; }
  .bar { flex: 1; border-radius: 4px 4px 0 0; background: var(--orange); opacity: .85; transition: opacity var(--t); }
  .bar:hover { opacity: 1; }

  @media (max-width: 900px) {
    .sidebar { display: none !important; }
    .main { margin-left: 0 !important; }
    .dash-grid { grid-template-columns: 1fr !important; }
    .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
  }
`;

// ─── Utilities ────────────────────────────────────────────────────────────────

function hoursUntil(iso) {
  return (new Date(iso) - Date.now()) / 3600000;
}

function formatRelative(iso) {
  const diff = Date.now() - new Date(iso);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ✅ Derive avatar initials from fullName since localStorage has no avatar field
function avatarFromName(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function useDebounce(val, delay = 280) {
  const [d, setD] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setD(val), delay);
    return () => clearTimeout(t);
  }, [val, delay]);
  return d;
}

// ─── Toast system ─────────────────────────────────────────────────────────────

let _toastId = 0;

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info", ms = 4000) => {
    const id = ++_toastId;
    setToasts((p) => [...p, { id, msg, type, out: false }]);
    setTimeout(() => {
      setToasts((p) => p.map((t) => (t.id === id ? { ...t, out: true } : t)));
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 380);
    }, ms);
  }, []);
  return { toasts, add };
}

const TOAST_META = {
  success: { color: "#16a34a", icon: "✓" },
  error:   { color: "#dc2626", icon: "✕" },
  warning: { color: "#d97706", icon: "!" },
  info:    { color: "#2563eb", icon: "i" },
};

function ToastStack({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 2000, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map((t) => {
        const m = TOAST_META[t.type] || TOAST_META.info;
        return (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "var(--surface)", borderLeft: `4px solid ${m.color}`, borderRadius: 10, boxShadow: "var(--shadow-md)", minWidth: 250, maxWidth: 340, animation: t.out ? "toastOut .35s forwards" : "toastIn .28s var(--ease)", pointerEvents: "all" }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: m.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{m.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 18 }}>
      {[70, 90, 55, 40, 36].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: i === 0 ? 16 : i === 4 ? 34 : 13, width: `${w}%`, marginBottom: i === 3 ? 10 : 7, marginTop: i === 4 ? 4 : 0 }} />
      ))}
    </div>
  );
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function StatusBadge({ status, expiry }) {
  const hrs = hoursUntil(expiry);
  if (status === "AVAILABLE" && hrs > 0 && hrs <= 2) {
    return <span className="badge" style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" }}>⚡ Expiring Soon</span>;
  }
  const map = {
    AVAILABLE: { bg: "var(--green-lt)", color: "var(--green)", label: "● Available" },
    CLAIMED:   { bg: "var(--blue-lt)",  color: "var(--blue)",  label: "✓ Claimed"   },
    EXPIRED:   { bg: "var(--surface2)", color: "var(--text3)", label: "○ Expired"   },
  };
  const s = map[status] || map.EXPIRED;
  return <span className="badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>;
}

function VerifBadge({ status }) {
  const map = {
    UNVERIFIED: { bg: "#fee2e2",         color: "#b91c1c",       label: "Unverified"  },
    PENDING:    { bg: "#fef3c7",         color: "#92400e",       label: "⏳ Pending"   },
    VERIFIED:   { bg: "var(--green-lt)", color: "var(--green)",  label: "✓ Verified"  },
  };
  const s = map[status] || map.UNVERIFIED;
  return <span className="badge" style={{ background: s.bg, color: s.color, fontSize: 12 }}>{s.label}</span>;
}

// ─── Charts ───────────────────────────────────────────────────────────────────

function MiniBarChart({ data, labels }) {
  const max = Math.max(...data);
  return (
    <div>
      <div className="bar-wrap">
        {data.map((v, i) => (
          <div key={i} className="bar" style={{ height: `${(v / max) * 100}%` }} title={`${labels[i]}: ${v} meals`} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
        {labels.map((l) => (
          <div key={l} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--text3)", fontWeight: 500 }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Gamification ─────────────────────────────────────────────────────────────

const BADGE_META = {
  top_donor:     { icon: "🏆", label: "Top Donor",      desc: "In top 10% of donors"   },
  hundred_meals: { icon: "🍽️", label: "100 Meals Club", desc: "Donated 100+ meals"      },
  early_bird:    { icon: "🌅", label: "Early Bird",      desc: "Donated before 8 AM"    },
  zero_waste:    { icon: "♻️", label: "Zero Waste Hero", desc: "No expired donations"   },
};

function GamificationBadge({ id }) {
  const b = BADGE_META[id];
  if (!b) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--amber-lt)", borderRadius: "var(--r-sm)", border: "1px solid #fde68a" }}>
      <span style={{ fontSize: 22 }}>{b.icon}</span>
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--amber)" }}>{b.label}</p>
        <p style={{ fontSize: 11, color: "var(--text3)" }}>{b.desc}</p>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color = "var(--orange)", bgColor = "var(--orange-lt)" }) {
  return (
    <div className="d-card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "var(--shadow)" }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .6 }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-d)", color: "var(--text)", lineHeight: 1.2 }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Donation card ────────────────────────────────────────────────────────────

function DonationCard({ donation, onDelete, onMarkComplete, toast }) {
  const [deleting,   setDeleting]   = useState(false);
  const [completing, setCompleting] = useState(false);
  const hrs = hoursUntil(donation.expiryDateTime);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${donation.foodName}"?`)) return;
    setDeleting(true);
    try {
      const user = getUser();
      await api.delete(`/donations/${donation.id}`, { headers: { "User-Id": user.id } });
      onDelete(donation.id);
      toast("Donation deleted.", "info");
    } catch {
      toast("Failed to delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const user = getUser();
      await api.put(`/donations/${donation.id}/complete`, null, { headers: { "User-Id": user.id } });
      onMarkComplete(donation.id);
      toast("Marked as completed! ✓", "success");
    } catch {
      toast("Failed to update.", "error");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="d-card" style={{ background: "var(--surface)", border: `1px solid ${hrs > 0 && hrs <= 2 && donation.status === "AVAILABLE" ? "#fed7aa" : "var(--border)"}`, borderRadius: "var(--r)", padding: "16px 18px", boxShadow: "var(--shadow)", position: "relative", overflow: "hidden" }}>
      {hrs > 0 && hrs <= 2 && donation.status === "AVAILABLE" && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #ea580c, #f97316)" }} />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 600, fontFamily: "var(--font-d)", color: "var(--text)" }}>{donation.foodName}</h3>
            <StatusBadge status={donation.status} expiry={donation.expiryDateTime} />
            <span className="badge" style={{ background: donation.foodType === "veg" ? "var(--green-lt)" : "#fff7ed", color: donation.foodType === "veg" ? "var(--green)" : "#c2410c", fontSize: 11 }}>
              {donation.foodType === "veg" ? "🥦 Veg" : "🍗 Non-Veg"}
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--text2)", lineHeight: 1.5, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {donation.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              ["📦", `${donation.quantity} ${donation.unit}`],
              ["📍", `${donation.city}${donation.state ? ", " + donation.state : ""}`],
              ["⏱",  hrs > 0 ? `${Math.floor(hrs)}h left` : "Expired"],
            ].map(([ic, lb]) => (
              <span key={lb} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 11.5, color: "var(--text2)", fontWeight: 500 }}>
                <span style={{ fontSize: 10 }}>{ic}</span> {lb}
              </span>
            ))}
          </div>

          {donation.claimedBy && (
            <div style={{ marginTop: 10, padding: "8px 12px", background: "var(--blue-lt)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <p style={{ fontSize: 11, color: "var(--blue)", fontWeight: 700 }}>Claimed by {donation.claimedBy.name}</p>
                <p style={{ fontSize: 11, color: "var(--text3)" }}>{formatRelative(donation.claimedBy.claimedAt)}</p>
              </div>
              <span className="badge" style={{ background: donation.claimedBy.status === "PICKED" ? "var(--green-lt)" : "var(--amber-lt)", color: donation.claimedBy.status === "PICKED" ? "var(--green)" : "var(--amber)" }}>
                {donation.claimedBy.status === "PICKED" ? "✓ Picked up" : "⏳ Pending pickup"}
              </span>
              {donation.claimedBy.status !== "PICKED" && (
                <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 10px" }} onClick={handleComplete} disabled={completing}>
                  {completing ? "Saving…" : "Mark Completed"}
                </button>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "…" : "🗑 Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, required, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", letterSpacing: .3 }}>
          {label} {required && <span style={{ color: "var(--red)" }}>*</span>}
        </label>
      )}
      {children}
      {error && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 1 }}>{error}</p>}
    </div>
  );
}

// ─── Add Donation Form ────────────────────────────────────────────────────────

const EMPTY_FORM = {
  foodName: "", description: "", quantity: "", unit: "kg",
  foodType: "veg", manufacturedDateTime: "", expiryDateTime: "",
  city: "", state: "", image: null, video: null,
};

function AddDonationForm({ isVerified, onCreated, toast }) {
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [imgPreview, setImgPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors,     setErrors]     = useState({});
  const formRef = useRef(null);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setForm((p) => ({ ...p, [name]: file }));
    if (name === "image" && file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImgPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.foodName.trim())                                                    errs.foodName      = "Required";
    if (!form.quantity || isNaN(+form.quantity) || +form.quantity <= 0)           errs.quantity      = "Enter a valid quantity";
    if (!form.city.trim())                                                        errs.city          = "Required";
    if (!form.expiryDateTime)                                                     errs.expiryDateTime = "Required";
    if (form.expiryDateTime && new Date(form.expiryDateTime) <= new Date())       errs.expiryDateTime = "Must be in the future";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const user = getUser();
      const res  = await api.post("/donations", form, { headers: { "User-Id": user.id } });

      onCreated(res.data);
      toast(`"${form.foodName}" donation created! 🎉`, "success");
      setForm(EMPTY_FORM);
      setImgPreview(null);
      formRef.current?.reset();
    } catch (err) {
      toast(err?.response?.data || "Failed to create donation.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {!isVerified && (
        <div style={{ padding: "10px 14px", background: "var(--red-lt)", borderRadius: "var(--r-sm)", fontSize: 12.5, color: "var(--red)", fontWeight: 500 }}>
          ⚠ You must be a verified donor to add donations.
        </div>
      )}

      <Field label="Food Name" required error={errors.foodName}>
        <input className="f-input" name="foodName" value={form.foodName} onChange={handle} disabled={!isVerified} placeholder="e.g. Vegetable Biryani" />
      </Field>

      <Field label="Description">
        <textarea className="f-input" name="description" value={form.description} onChange={handle} disabled={!isVerified} placeholder="Briefly describe the food, allergens…" rows={3} style={{ resize: "vertical" }} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
        <Field label="Quantity" required error={errors.quantity}>
          <input className="f-input" name="quantity" type="number" min="1" value={form.quantity} onChange={handle} disabled={!isVerified} placeholder="Amount" />
        </Field>
        <Field label="Unit">
          <select className="f-input" name="unit" value={form.unit} onChange={handle} disabled={!isVerified} style={{ width: 90 }}>
            {["g","kg","servings","packets","loaves","boxes","litres"].map((u) => <option key={u}>{u}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Food Type">
        <div style={{ display: "flex", gap: 8 }}>
          {["veg","nonveg"].map((t) => (
            <label key={t} style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", border: `1.5px solid ${form.foodType === t ? "var(--orange)" : "var(--border)"}`, borderRadius: "var(--r-sm)", cursor: "pointer", background: form.foodType === t ? "var(--orange-lt)" : "var(--surface2)", fontSize: 13, fontWeight: 500, color: form.foodType === t ? "var(--orange)" : "var(--text2)", transition: "all var(--t)" }}>
              <input type="radio" name="foodType" value={t} checked={form.foodType === t} onChange={handle} disabled={!isVerified} style={{ display: "none" }} />
              {t === "veg" ? "🥦 Vegetarian" : "🍗 Non-Veg"}
            </label>
          ))}
        </div>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Field label="Cooked / Made At">
          <input className="f-input" type="datetime-local" name="manufacturedDateTime" value={form.manufacturedDateTime} onChange={handle} disabled={!isVerified} />
        </Field>
        <Field label="Expiry Date & Time" required error={errors.expiryDateTime}>
          <input className="f-input" type="datetime-local" name="expiryDateTime" value={form.expiryDateTime} onChange={handle} disabled={!isVerified} />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Field label="City" required error={errors.city}>
          <input className="f-input" name="city" value={form.city} onChange={handle} disabled={!isVerified} placeholder="City" />
        </Field>
        <Field label="State">
          <input className="f-input" name="state" value={form.state} onChange={handle} disabled={!isVerified} placeholder="State" />
        </Field>
      </div>

      <Field label="Cover Photo">
        <div style={{ border: `2px dashed ${imgPreview ? "var(--orange)" : "var(--border)"}`, borderRadius: "var(--r-sm)", padding: 14, textAlign: "center", background: "var(--surface2)", transition: "border-color var(--t)" }}>
          {imgPreview ? (
            <div style={{ position: "relative" }}>
              <img src={imgPreview} alt="preview" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: "var(--r-sm)" }} />
              <button type="button" onClick={() => { setImgPreview(null); setForm((p) => ({ ...p, image: null })); }} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,.55)", border: "none", color: "#fff", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
          ) : (
            <label style={{ cursor: isVerified ? "pointer" : "not-allowed", display: "block" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>📷</div>
              <p style={{ fontSize: 12, color: "var(--text3)" }}>Click to upload image</p>
              <input type="file" name="image" accept="image/*" onChange={handleFile} disabled={!isVerified} style={{ display: "none" }} />
            </label>
          )}
        </div>
      </Field>

      <Field label="Video (optional)">
        <input className="f-input" type="file" name="video" accept="video/*" onChange={handleFile} disabled={!isVerified} style={{ padding: "7px 12px" }} />
      </Field>

      <button type="submit" className="btn btn-orange" disabled={!isVerified || submitting} style={{ width: "100%", marginTop: 4, padding: "11px" }}>
        {submitting ? "Creating…" : "🍱  Add Donation"}
      </button>
    </form>
  );
}

// ─── My Donations panel ───────────────────────────────────────────────────────

function MyDonationsPanel({ donations, loading, onDelete, onMarkComplete, toast }) {
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType,   setFilterType]   = useState("ALL");
  const [sortBy,       setSortBy]       = useState("latest");
  const dSearch = useDebounce(search);

  const filtered = useMemo(() => {
    let list = [...donations];
    if (dSearch) {
      const q = dSearch.toLowerCase();
      list = list.filter((d) => d.foodName?.toLowerCase().includes(q) || d.city?.toLowerCase().includes(q));
    }
    if (filterStatus !== "ALL") list = list.filter((d) => d.status    === filterStatus);
    if (filterType   !== "ALL") list = list.filter((d) => d.foodType  === filterType);

    if      (sortBy === "latest")   list.sort((a, b) => new Date(b.manufacturedDateTime) - new Date(a.manufacturedDateTime));
    else if (sortBy === "expiry")   list.sort((a, b) => new Date(a.expiryDateTime)       - new Date(b.expiryDateTime));
    else if (sortBy === "quantity") list.sort((a, b) => b.quantity - a.quantity);

    return list;
  }, [donations, dSearch, filterStatus, filterType, sortBy]);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        <input className="f-input" style={{ maxWidth: 220, flex: 1 }} placeholder="🔍 Search donations…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="f-input" style={{ width: 140 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="CLAIMED">Claimed</option>
          <option value="EXPIRED">Expired</option>
        </select>
        <select className="f-input" style={{ width: 130 }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="ALL">All types</option>
          <option value="veg">Veg</option>
          <option value="nonveg">Non-Veg</option>
        </select>
        <select className="f-input" style={{ width: 150 }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">Latest first</option>
          <option value="expiry">Expiring soon</option>
          <option value="quantity">Most quantity</option>
        </select>
      </div>

      <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>
        {filtered.length} donation{filtered.length !== 1 ? "s" : ""} found
      </p>

      {filtered.length === 0
        ? <EmptyState icon="🍱" title="No donations yet" subtitle="Your donations will appear here once you add them." />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((d) => (
              <DonationCard key={d.id} donation={d} onDelete={onDelete} onMarkComplete={onMarkComplete} toast={toast} />
            ))}
          </div>
        )
      }
    </div>
  );
}

// ─── Analytics panel ──────────────────────────────────────────────────────────

function AnalyticsPanel({ donations, user }) {
  const totalMeals   = donations.reduce((s, d) => s + (d.unit === "servings" ? d.quantity : 0), 0);
  const wasteReduced = donations.filter((d) => d.status === "CLAIMED").reduce((s, d) => s + d.quantity, 0);

  // ✅ Guard against missing fields — impactScore and badges don't exist in localStorage user
  const impactScore = user.impactScore || donations.length * 10;
  const badges      = user.badges      || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 20, boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .6 }}>Impact Score</p>
            <p style={{ fontSize: 36, fontWeight: 700, fontFamily: "var(--font-d)", color: "var(--orange)", lineHeight: 1.1 }}>{impactScore}</p>
          </div>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--orange-lt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>⚡</div>
        </div>
        <div style={{ height: 6, background: "var(--surface2)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min((impactScore / 1000) * 100, 100)}%`, background: "linear-gradient(90deg, #f97316, #ea580c)", borderRadius: 99, transition: "width 1s var(--ease)" }} />
        </div>
        <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>{Math.max(0, 1000 - impactScore)} pts to next milestone</p>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 20, boxShadow: "var(--shadow)" }}>
        <p style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-d)", color: "var(--text)", marginBottom: 14 }}>Meals Donated — This Week</p>
        <MiniBarChart data={IMPACT_DATA} labels={IMPACT_LABELS} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          {[
            ["🍽️", "Total meals",   totalMeals   || IMPACT_DATA.reduce((a, b) => a + b, 0)],
            ["♻️", "Waste reduced", `~${wasteReduced}kg`],
          ].map(([ic, lb, vl]) => (
            <div key={lb} style={{ padding: "10px 12px", background: "var(--surface2)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
              <p style={{ fontSize: 18 }}>{ic}</p>
              <p style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-d)", color: "var(--text)" }}>{vl}</p>
              <p style={{ fontSize: 11, color: "var(--text3)" }}>{lb}</p>
            </div>
          ))}
        </div>
      </div>

      {badges.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 20, boxShadow: "var(--shadow)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-d)", color: "var(--text)", marginBottom: 12 }}>Your Badges</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {badges.map((b) => <GamificationBadge key={b} id={b} />)}
          </div>
        </div>
      )}

      <div style={{ padding: "14px 16px", background: "var(--blue-lt)", borderRadius: "var(--r)", border: "1px solid #bfdbfe" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", marginBottom: 4 }}>💡 Smart Suggestion</p>
        <p style={{ fontSize: 12.5, color: "var(--text2)", lineHeight: 1.55 }}>
          Consider adding an afternoon donation today — demand peaks between <strong>3–6 PM</strong>.
        </p>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ padding: "48px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>{icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 600, fontFamily: "var(--font-d)", color: "var(--text)", marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: "var(--text3)" }}>{subtitle}</p>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { key: "overview",  icon: "⬛", label: "Overview"      },
  { key: "add",       icon: "＋", label: "Add Donation"  },
  { key: "donations", icon: "🍱", label: "My Donations"  },
  { key: "analytics", icon: "📊", label: "Analytics"     },
  { key: "profile",   icon: "👤", label: "Profile"       },
];

function Sidebar({ tab, setTab, user, donorStatus }) {
  const avatar = avatarFromName(user?.fullName);
  return (
    <aside className="sidebar" style={{ position: "fixed", top: 0, left: 0, width: "var(--sidebar-w)", height: "100vh", background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", zIndex: 100, padding: "0 12px 20px" }}>
      <div style={{ padding: "18px 8px 22px", borderBottom: "1px solid var(--border)", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/cd068eaa-4022-44b6-a781-b530207b1a91.jpg" alt="PetFull logo" style={{ width: 34, height: 34, borderRadius: 9, objectFit: "cover" }} />
          <div>
            <p style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: 17, color: "var(--text)", lineHeight: 1 }}>PetFull</p>
            <p style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>Donor Portal</p>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "var(--text3)", textTransform: "uppercase", padding: "0 8px 8px" }}>Menu</p>
        {NAV.map((n) => (
          <div key={n.key} className={`nav-item ${tab === n.key ? "active" : ""}`} onClick={() => setTab(n.key)}>
            <span style={{ fontSize: 15 }}>{n.icon}</span>
            {n.label}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, padding: "14px 8px 0" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--orange-lt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--orange)", flexShrink: 0 }}>{avatar}</div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.fullName}</p>
          <VerifBadge status={donorStatus} />
        </div>
      </div>
    </aside>
  );
}

// ─── Top navbar ───────────────────────────────────────────────────────────────

const TAB_TITLES = {
  overview:  "Dashboard Overview",
  add:       "Add Donation",
  donations: "My Donations",
  analytics: "Impact Analytics",
  profile:   "Profile",
};

function TopNav({ tab, darkMode, setDarkMode, user, expiringSoon }) {
  const avatar = avatarFromName(user?.fullName);
  return (
    <header style={{ position: "fixed", top: 0, left: "var(--sidebar-w)", right: 0, height: "var(--nav-h)", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", zIndex: 99 }}>
      <h1 style={{ fontSize: 16.5, fontWeight: 600, fontFamily: "var(--font-d)", color: "var(--text)" }}>{TAB_TITLES[tab]}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {expiringSoon > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "var(--orange-lt)", border: "1px solid var(--orange-md)", borderRadius: 99, fontSize: 12, color: "var(--orange)", fontWeight: 600 }}>
            ⚡ {expiringSoon} expiring soon
          </div>
        )}
        <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setDarkMode((p) => !p)}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--orange-lt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--orange)", border: "1.5px solid var(--orange-md)" }}>
          {avatar}
        </div>
        {/* ✅ Logout uses module-level handleLogout */}
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ donations, loading, user, setTab, donorStatus, onApplyVerification }) {
  const stats = useMemo(() => ({
    total:   donations.length,
    active:  donations.filter((d) => d.status === "AVAILABLE").length,
    claimed: donations.filter((d) => d.status === "CLAIMED").length,
    meals:   donations.filter((d) => d.unit === "servings").reduce((s, d) => s + d.quantity, 0),
  }), [donations]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {donorStatus !== "VERIFIED" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "var(--green-lt)", border: "1px solid #bbf7d0", borderRadius: "var(--r)", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✔</div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#14532d" }}>Get verified to start donating food</p>
              <p style={{ fontSize: 12, color: "var(--green)" }}>Verified donors are trusted by our recipient network.</p>
            </div>
          </div>
          {donorStatus === "UNVERIFIED" && <button className="btn btn-orange" onClick={onApplyVerification}>Apply for Verification</button>}
          {donorStatus === "PENDING"    && <span style={{ fontSize: 13, color: "var(--amber)", fontWeight: 600 }}>⏳ Verification under review</span>}
        </div>
      )}

      {loading ? (
        <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 88, borderRadius: "var(--r)" }} />)}
        </div>
      ) : (
        <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <StatCard icon="🍱" label="Total Donations" value={stats.total} />
          <StatCard icon="✅" label="Active Listings"  value={stats.active}  color="var(--green)" bgColor="var(--green-lt)" />
          <StatCard icon="🤝" label="Claimed"          value={stats.claimed} color="var(--blue)"  bgColor="var(--blue-lt)"  />
          <StatCard icon="🍽️" label="Meals Donated"   value={stats.meals || "–"} color="var(--amber)" bgColor="var(--amber-lt)" />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="d-card" onClick={() => setTab("add")} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "18px 20px", cursor: "pointer", boxShadow: "var(--shadow)" }}>
          <p style={{ fontSize: 28, marginBottom: 8 }}>＋</p>
          <p style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-d)", color: "var(--text)" }}>Add Donation</p>
          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>List new food for recipients</p>
        </div>
        <div className="d-card" onClick={() => setTab("donations")} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "18px 20px", cursor: "pointer", boxShadow: "var(--shadow)" }}>
          <p style={{ fontSize: 28, marginBottom: 8 }}>📋</p>
          <p style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-d)", color: "var(--text)" }}>Manage Donations</p>
          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>View, track, and delete</p>
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 20, boxShadow: "var(--shadow)" }}>
        <p style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-d)", color: "var(--text)", marginBottom: 14 }}>Recent Claims</p>
        {donations.filter((d) => d.claimedBy).length === 0 ? (
          <EmptyState icon="📬" title="No claims yet" subtitle="When someone claims your donation, it will show here." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {donations.filter((d) => d.claimedBy).map((d) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--surface2)", borderRadius: "var(--r-sm)", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{d.foodName}</p>
                  <p style={{ fontSize: 11.5, color: "var(--text3)" }}>Claimed by {d.claimedBy.name} · {formatRelative(d.claimedBy.claimedAt)}</p>
                </div>
                <span className="badge" style={{ background: d.claimedBy.status === "PICKED" ? "var(--green-lt)" : "var(--amber-lt)", color: d.claimedBy.status === "PICKED" ? "var(--green)" : "var(--amber)" }}>
                  {d.claimedBy.status === "PICKED" ? "✓ Picked" : "⏳ Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile tab ──────────────────────────────────────────────────────────────

function ProfileTab({ user, donorStatus }) {
  const [saved, setSaved] = useState(false);

  // ✅ Use real fields from localStorage user object
  const fields = [
    ["Full Name", user?.fullName  || ""],
    ["Email",     user?.email     || ""],
    ["Phone",     user?.phone     || ""],
    ["City",      user?.city      || ""],
    ["State",     user?.state     || ""],
  ];

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 24, boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--orange-lt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "var(--orange)", border: "2px solid var(--orange-md)" }}>
            {avatarFromName(user?.fullName)}
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontFamily: "var(--font-d)", fontWeight: 700, color: "var(--text)" }}>{user?.fullName}</h2>
            <p style={{ fontSize: 12.5, color: "var(--text3)" }}>{user?.email}</p>
            <VerifBadge status={donorStatus} />
          </div>
        </div>

        {fields.map(([lbl, val]) => (
          <div key={lbl} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text3)", letterSpacing: .3, display: "block", marginBottom: 4 }}>{lbl}</label>
            <input className="f-input" defaultValue={val} />
          </div>
        ))}

        <button className="btn btn-orange" style={{ width: "100%", padding: "11px" }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          {saved ? "✓ Saved!" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

// ─── Style injector ───────────────────────────────────────────────────────────

const StyleTag = () => <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />;

// ─── Root component ───────────────────────────────────────────────────────────

export default function DonorDashboard() {
  const [tab,              setTab]              = useState("overview");
  const [donorStatus,      setDonorStatus]      = useState("UNVERIFIED");
  const [statusLoading,    setStatusLoading]    = useState(true);
  const [donations,        setDonations]        = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [darkMode,         setDarkMode]         = useState(false);
  const { toasts, add: toast } = useToasts();

  const user = getUser();

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Fetch donor status
  useEffect(() => {
    const u = getUser();
    api.get("/users/me/status", { headers: { "User-Id": u.id } })
      .then((r) => setDonorStatus(r.data))
      .catch(() => toast("Failed to load donor status.", "error"))
      .finally(() => setStatusLoading(false));
  }, [toast]);

  // Fetch donations
  const fetchDonations = useCallback(async () => {
    try {
      setDonationsLoading(true);
      const u = getUser();
      const r = await api.get("/donations/my", { headers: { "User-Id": u.id } });

      const mapped = r.data.map((d) => ({
        ...d,
        // ✅ Use foodType from backend — no longer hardcoded
        foodType: d.foodType || "veg",
        status:   d.status   || "AVAILABLE",
        claimedBy: d.claimedBy
          ? { name: d.claimedBy.fullName, claimedAt: d.claimedBy.claimedAt || new Date().toISOString(), status: "PENDING" }
          : null,
      }));

      setDonations(mapped);
    } catch {
      toast("Failed to load donations.", "error");
    } finally {
      setDonationsLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  // Apply for verification
  const handleApplyVerification = async () => {
    try {
      const u = getUser();
      await api.post("/verification/apply", null, { headers: { "User-Id": u.id } });
      setDonorStatus("PENDING");
      toast("Verification request submitted!", "success");
    } catch {
      toast("Failed to apply for verification.", "error");
    }
  };

  const handleDonationCreated = useCallback(async () => {
    await fetchDonations();
    setTab("donations");
  }, [fetchDonations]);

  const handleDelete = useCallback(async () => {
    await fetchDonations();
  }, [fetchDonations]);

  const handleMarkComplete = useCallback((id) => {
    setDonations((p) =>
      p.map((d) => d.id === id && d.claimedBy ? { ...d, claimedBy: { ...d.claimedBy, status: "PICKED" } } : d)
    );
  }, []);

  const expiringSoon = useMemo(
    () => donations.filter((d) => d.status === "AVAILABLE" && hoursUntil(d.expiryDateTime) > 0 && hoursUntil(d.expiryDateTime) <= 2).length,
    [donations]
  );

  if (statusLoading) return (
    <>
      <StyleTag />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 32 }}>🐾</div>
        <p style={{ fontSize: 14, color: "var(--text3)", fontFamily: "var(--font)" }}>Loading PetFull dashboard…</p>
      </div>
    </>
  );

  if (!user) return null;

  return (
    <>
      <StyleTag />
      <Sidebar tab={tab} setTab={setTab} user={user} donorStatus={donorStatus} />
      <TopNav  tab={tab} darkMode={darkMode} setDarkMode={setDarkMode} user={user} expiringSoon={expiringSoon} />

      <main className="main" style={{ marginLeft: "var(--sidebar-w)", marginTop: "var(--nav-h)", padding: "28px 26px", minHeight: "calc(100vh - var(--nav-h))" }}>
        {tab === "overview" && (
          <OverviewTab donations={donations} loading={donationsLoading} user={user} setTab={setTab} donorStatus={donorStatus} onApplyVerification={handleApplyVerification} />
        )}
        {tab === "add" && (
          <div style={{ maxWidth: 580 }}>
            <AddDonationForm isVerified={donorStatus === "VERIFIED"} onCreated={handleDonationCreated} toast={toast} />
          </div>
        )}
        {tab === "donations" && (
          <MyDonationsPanel donations={donations} loading={donationsLoading} onDelete={handleDelete} onMarkComplete={handleMarkComplete} toast={toast} />
        )}
        {tab === "analytics" && (
          <div style={{ maxWidth: 520 }}>
            <AnalyticsPanel donations={donations} user={user} />
          </div>
        )}
        {tab === "profile" && <ProfileTab user={user} donorStatus={donorStatus} />}
      </main>

      <ToastStack toasts={toasts} />
    </>
  );
}