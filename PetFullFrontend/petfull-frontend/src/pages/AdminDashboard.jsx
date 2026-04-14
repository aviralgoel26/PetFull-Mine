import { useState, useEffect } from "react";


/* ─── Global Styles ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f2f4f7; font-family: 'DM Sans', sans-serif; color: #1a1a2e; }
  button { font-family: 'DM Sans', sans-serif; cursor: pointer; border: none; }
  input, select { font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #dde1e9; border-radius: 4px; }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px; cursor: pointer;
    font-size: 13.5px; font-weight: 500; color: #64748b;
    transition: all 0.15s; margin-bottom: 2px;
  }
  .nav-item:hover { background: #fff4ed; color: #f97316; }
  .nav-item.active { background: #fff4ed; color: #f97316; font-weight: 600; }

  .card {
    background: #fff; border: 1px solid #e8ecf2;
    border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s;
  }
  .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

  .filter-btn {
    padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;
    border: 1.5px solid #e2e8f0; background: #fff; color: #64748b;
    transition: all 0.15s; cursor: pointer;
  }
  .filter-btn:hover { border-color: #f97316; color: #f97316; }
  .filter-btn.active { background: #f97316; border-color: #f97316; color: #fff; font-weight: 600; }

  .search-box {
    display: flex; align-items: center; gap: 8px; background: #fff;
    border: 1.5px solid #e2e8f0; border-radius: 10px;
    padding: 0 14px; height: 38px; transition: border-color 0.15s;
  }
  .search-box:focus-within { border-color: #f97316; }
  .search-box input {
    border: none; outline: none; font-size: 13px;
    color: #374151; background: transparent; width: 190px;
  }
  .search-box input::placeholder { color: #94a3b8; }

  .sel {
    height: 38px; padding: 0 12px; border-radius: 10px;
    border: 1.5px solid #e2e8f0; background: #fff; font-size: 13px;
    color: #374151; outline: none; cursor: pointer; transition: border-color 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .sel:focus { border-color: #f97316; }

  .btn-approve {
    background: #dcfce7; color: #15803d; padding: 6px 14px;
    border-radius: 8px; font-size: 12px; font-weight: 600; transition: background 0.15s;
  }
  .btn-approve:hover { background: #bbf7d0; }
  .btn-reject {
    background: #fee2e2; color: #dc2626; padding: 6px 14px;
    border-radius: 8px; font-size: 12px; font-weight: 600; transition: background 0.15s;
  }
  .btn-reject:hover { background: #fecaca; }
  .btn-delete {
    background: #fee2e2; color: #dc2626; padding: 6px 14px;
    border-radius: 8px; font-size: 12px; font-weight: 600; transition: background 0.15s;
  }
  .btn-delete:hover { background: #fecaca; }

  table { width: 100%; border-collapse: collapse; }
  th {
    padding: 11px 16px; text-align: left; font-size: 11px; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600;
    border-bottom: 1px solid #f1f5f9; background: #fafbfc;
  }
  td { padding: 13px 16px; font-size: 13.5px; color: #374151; border-bottom: 1px solid #f8fafc; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafbff; }

  .stat-card {
    background: #fff; border: 1px solid #e8ecf2; border-radius: 14px;
    padding: 20px 22px; position: relative; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .donation-card {
    background: #fff; border: 1px solid #e8ecf2; border-radius: 14px;
    padding: 18px 22px; margin-bottom: 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: box-shadow 0.2s;
  }
  .donation-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .page-enter { animation: slideUp 0.2s ease; }
`;

/* ─── Seed Data ──────────────────────────────────────────────────────────────── */
const INIT_DONORS = [
  { id:1, name:"Arjun Mehta",   email:"arjun@gmail.com",  phone:"9876543210", joined:"Jan 12, 2025", status:"PENDING" },
  { id:2, name:"Priya Sharma",  email:"priya@gmail.com",  phone:"9123456789", joined:"Jan 15, 2025", status:"PENDING" },
  { id:3, name:"Ravi Kumar",    email:"ravi@gmail.com",   phone:"9988776655", joined:"Jan 18, 2025", status:"PENDING" },
  { id:4, name:"Sunita Patel",  email:"sunita@gmail.com", phone:"9870001111", joined:"Jan 05, 2025", status:"VERIFIED" },
  { id:5, name:"Ankit Joshi",   email:"ankit@gmail.com",  phone:"9871112222", joined:"Dec 20, 2024", status:"VERIFIED" },
  { id:6, name:"Meera Nair",    email:"meera@gmail.com",  phone:"9872223333", joined:"Dec 28, 2024", status:"VERIFIED" },
  { id:7, name:"Karan Singh",   email:"karan@gmail.com",  phone:"9873334444", joined:"Jan 02, 2025", status:"UNVERIFIED" },
  { id:8, name:"Deepa Rao",     email:"deepa@gmail.com",  phone:"9874445555", joined:"Jan 08, 2025", status:"REJECTED" },
];

const INIT_DONATIONS = [
  { id:1, food:"Dal & Rice (5 portions)", donor:"Sunita Patel", qty:"5 portions", location:"Phagwara, Punjab",  listed:"Apr 10, 2025", expires:"Apr 12, 2025", status:"CLAIMED",   type:"Veg" },
  { id:2, food:"Bread Loaves (3)",        donor:"Ankit Joshi",  qty:"3 loaves",   location:"Ludhiana, Punjab",  listed:"Apr 11, 2025", expires:"Apr 13, 2025", status:"AVAILABLE", type:"Veg" },
  { id:3, food:"Vegetable Curry",         donor:"Meera Nair",   qty:"4 portions", location:"Chandausi, UP",     listed:"Apr 09, 2025", expires:"Apr 11, 2025", status:"EXPIRED",   type:"Veg" },
  { id:4, food:"Paneer Biryani",          donor:"Sunita Patel", qty:"8 portions", location:"Phagwara, Punjab",  listed:"Apr 11, 2025", expires:"Apr 14, 2025", status:"AVAILABLE", type:"Veg" },
  { id:5, food:"Chicken Curry",           donor:"Ankit Joshi",  qty:"1 bowl",     location:"Amritsar, Punjab",  listed:"Apr 10, 2025", expires:"Apr 13, 2025", status:"CLAIMED",   type:"Non-Veg" },
  { id:6, food:"Samosas (20 pcs)",        donor:"Meera Nair",   qty:"20 pcs",     location:"Phagwara, Punjab",  listed:"Apr 08, 2025", expires:"Apr 10, 2025", status:"EXPIRED",   type:"Veg" },
  { id:7, food:"Khichdi",                 donor:"Sunita Patel", qty:"6 portions", location:"Jalandhar, Punjab", listed:"Apr 12, 2025", expires:"Apr 14, 2025", status:"AVAILABLE", type:"Veg" },
];

const INIT_USERS = [
  { id:1, name:"Arjun Mehta",  email:"arjun@gmail.com",     role:"DONOR",     joined:"Jan 12, 2025" },
  { id:2, name:"Priya Sharma", email:"priya@gmail.com",     role:"DONOR",     joined:"Jan 15, 2025" },
  { id:3, name:"Rahul Dev",    email:"rahul@gmail.com",     role:"RECIPIENT", joined:"Jan 10, 2025" },
  { id:4, name:"Nisha Gupta",  email:"nisha@gmail.com",     role:"RECIPIENT", joined:"Jan 06, 2025" },
  { id:5, name:"Sunita Patel", email:"sunita@gmail.com",    role:"DONOR",     joined:"Jan 05, 2025" },
  { id:6, name:"Vikram Jain",  email:"vikram@gmail.com",    role:"RECIPIENT", joined:"Dec 30, 2024" },
  { id:7, name:"Super Admin",  email:"admin@foodshare.com", role:"ADMIN",     joined:"Dec 01, 2024" },
];

const INIT_LOGS = [
  { id:1, color:"#16a34a", text:"Donor Sunita Patel approved by admin",          time:"Apr 13 · 10:32 AM" },
  { id:2, color:"#dc2626", text:"Donation Vegetable Curry deleted by admin",     time:"Apr 13 · 10:10 AM" },
  { id:3, color:"#2563eb", text:"New donor Arjun Mehta submitted verification",  time:"Apr 12 · 03:45 PM" },
  { id:4, color:"#d97706", text:"Donation Samosas (20 pcs) expired automatically",time:"Apr 10 · 11:00 PM" },
  { id:5, color:"#16a34a", text:"Donation Fruit Basket claimed by Nisha Gupta",  time:"Apr 10 · 06:22 PM" },
  { id:6, color:"#dc2626", text:"Donor Deepa Rao rejected by admin",             time:"Apr 09 · 02:15 PM" },
  { id:7, color:"#2563eb", text:"New user Vikram Jain registered as recipient",  time:"Apr 09 · 10:00 AM" },
];

const BAR_DATA = [
  {day:"Mon",val:38},{day:"Tue",val:52},{day:"Wed",val:41},
  {day:"Thu",val:67},{day:"Fri",val:58},{day:"Sat",val:83},{day:"Sun",val:44},
];
const BAR_COLORS = ["#f97316","#3b82f6","#22c55e","#8b5cf6","#f59e0b","#ef4444","#06b6d4"];

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const initials = n => n.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
const AV_COLORS = ["#f97316","#3b82f6","#22c55e","#8b5cf6","#f59e0b","#06b6d4","#ec4899"];
const avBg = n => AV_COLORS[n.charCodeAt(0) % AV_COLORS.length];

const BADGE = {
  PENDING:    {bg:"#fef9c3",c:"#a16207",  b:"#fde047"},
  VERIFIED:   {bg:"#dcfce7",c:"#15803d",  b:"#86efac"},
  UNVERIFIED: {bg:"#f1f5f9",c:"#64748b",  b:"#cbd5e1"},
  REJECTED:   {bg:"#fee2e2",c:"#b91c1c",  b:"#fca5a5"},
  AVAILABLE:  {bg:"#dbeafe",c:"#1d4ed8",  b:"#93c5fd"},
  CLAIMED:    {bg:"#dcfce7",c:"#15803d",  b:"#86efac"},
  EXPIRED:    {bg:"#f1f5f9",c:"#64748b",  b:"#cbd5e1"},
  DONOR:      {bg:"#fff7ed",c:"#c2410c",  b:"#fed7aa"},
  RECIPIENT:  {bg:"#f5f3ff",c:"#6d28d9",  b:"#c4b5fd"},
  ADMIN:      {bg:"#fef9c3",c:"#a16207",  b:"#fde047"},
  Veg:        {bg:"#dcfce7",c:"#15803d",  b:"#86efac"},
  "Non-Veg":  {bg:"#fee2e2",c:"#b91c1c",  b:"#fca5a5"},
};

function Badge({ label }) {
  const s = BADGE[label] || {bg:"#f1f5f9",c:"#64748b",b:"#cbd5e1"};
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      padding:"3px 10px", borderRadius:20,
      fontSize:12, fontWeight:600,
      background:s.bg, color:s.c, border:`1px solid ${s.b}`,
    }}>{label}</span>
  );
}

function Avatar({ name, size=30 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", background:avBg(name),
      display:"inline-flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.36, fontWeight:700, color:"#fff", flexShrink:0,
    }}>{initials(name)}</div>
  );
}

function Toast({ msg, color, visible }) {
  return (
    <div style={{
      position:"fixed", bottom:24, right:24, zIndex:9999,
      background:"#fff", border:"1.5px solid #e8ecf2", borderRadius:12,
      padding:"12px 20px", display:"flex", alignItems:"center", gap:10,
      fontSize:13.5, color:"#1a1a2e", fontWeight:500,
      boxShadow:"0 8px 30px rgba(0,0,0,0.12)",
      opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(10px)",
      transition:"all 0.25s ease", pointerEvents:"none",
    }}>
      <div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>
      {msg}
    </div>
  );
}

/* ─── Search Icon SVG ────────────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width={14} height={14} viewBox="0 0 20 20" fill="#94a3b8">
    <path fillRule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM2 8a6 6 0 1 1 10.89 3.476l4.817 4.817a1 1 0 0 1-1.414 1.414l-4.816-4.816A6 6 0 0 1 2 8z" clipRule="evenodd"/>
  </svg>
);

/* ─── Stat Card ──────────────────────────────────────────────────────────────── */
function StatCard({ label, value, icon, accent, sub }) {
  return (
    <div className="stat-card">
      <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:accent,borderRadius:"14px 14px 0 0"}}/>
      <div style={{width:44,height:44,borderRadius:12,marginBottom:12,background:`${accent}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{icon}</div>
      <div style={{fontSize:11,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:4}}>{label}</div>
      <div style={{fontSize:28,fontWeight:700,color:"#1a1a2e",letterSpacing:-0.5}}>{value}</div>
      {sub && <div style={{fontSize:12,color:"#94a3b8",marginTop:4}}>{sub}</div>}
    </div>
  );
}

/* ─── Bar Chart ──────────────────────────────────────────────────────────────── */
function BarChart() {
  const max = Math.max(...BAR_DATA.map(d=>d.val));
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:10,height:140,paddingTop:8}}>
      {BAR_DATA.map((d,i)=>(
        <div key={d.day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
          <span style={{fontSize:10,color:"#94a3b8",fontWeight:500}}>{d.val}</span>
          <div style={{width:"100%",height:Math.round(d.val/max*100),background:BAR_COLORS[i],borderRadius:"6px 6px 0 0",opacity:0.85}}/>
          <span style={{fontSize:11,color:"#64748b",fontWeight:500}}>{d.day}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Donut Chart ────────────────────────────────────────────────────────────── */
function DonutChart({ available, claimed, expired }) {
  const total = available + claimed + expired || 1;
  const r = 42, circ = 2*Math.PI*r;
  const segs = [
    {val:claimed,   color:"#22c55e", label:"Claimed",   count:claimed},
    {val:available, color:"#3b82f6", label:"Available", count:available},
    {val:expired,   color:"#94a3b8", label:"Expired",   count:expired},
  ];
  let cum = 0;
  return (
    <div style={{display:"flex",alignItems:"center",gap:24}}>
      <svg width={110} height={110} viewBox="0 0 110 110">
        <circle cx={55} cy={55} r={r} fill="none" stroke="#f1f5f9" strokeWidth={16}/>
        {segs.map((seg,i)=>{
          const pct=seg.val/total, dash=pct*circ;
          const off=circ/4-cum*circ; cum+=pct;
          return <circle key={i} cx={55} cy={55} r={r} fill="none"
            stroke={seg.color} strokeWidth={16}
            strokeDasharray={`${dash} ${circ-dash}`}
            strokeDashoffset={off}
            transform="rotate(-90 55 55)"/>;
        })}
        <text x={55} y={50} textAnchor="middle" fill="#1a1a2e" fontSize={15} fontWeight={700}>{total}</text>
        <text x={55} y={63} textAnchor="middle" fill="#94a3b8" fontSize={9}>total</text>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {segs.map(s=>(
          <div key={s.label} style={{display:"flex",alignItems:"center",gap:8,fontSize:13}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:s.color,flexShrink:0}}/>
            <span style={{color:"#64748b"}}>{s.label}</span>
            <span style={{marginLeft:6,fontWeight:700,color:"#1a1a2e"}}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Nav Icons ──────────────────────────────────────────────────────────────── */
const ICONS = {
  dashboard:<svg width={17} height={17} viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>,
  donors:   <svg width={17} height={17} viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 5a5 5 0 0 1 10 0H3z"/></svg>,
  donations:<svg width={17} height={17} viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a3 3 0 0 1 3 3v1h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V4a3 3 0 0 1 3-3zm0 1.5a1.5 1.5 0 0 0-1.5 1.5v1h3V4A1.5 1.5 0 0 0 8 2.5z"/></svg>,
  users:    <svg width={17} height={17} viewBox="0 0 16 16" fill="currentColor"><path d="M6 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3.5 6C2 8 1 9 1 10.5V11h10v-.5C11 9 10 8 9.5 8h-7zM11 7a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm.5 2c-.4 0-.8.1-1.1.3.4.5.6 1.1.6 1.7H15v-.5c0-1-.8-1.5-1.5-1.5h-2z"/></svg>,
  logs:     <svg width={17} height={17} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z" clipRule="evenodd"/></svg>,
};

/* ─────────────────────── PAGES ─────────────────────────────────────────────── */

function DashboardPage({ donors, donations, users, onNavigate }) {
  const total  = donations.length;
  const claimed= donations.filter(d=>d.status==="CLAIMED").length;
  const expired= donations.filter(d=>d.status==="EXPIRED").length;
  const avail  = donations.filter(d=>d.status==="AVAILABLE").length;
  const pending= donors.filter(d=>d.status==="PENDING").length;

  return (
    <div className="page-enter">
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:22,fontWeight:700,color:"#1a1a2e",letterSpacing:-0.3}}>Overview</h1>
        <p style={{fontSize:13.5,color:"#94a3b8",marginTop:4}}>System-wide analytics and activity summary</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
        <StatCard label="Total Users"      value={users.length}   icon="👥" accent="#f97316" sub="Active accounts"/>
        <StatCard label="Total Donors"     value={donors.length}  icon="🤝" accent="#3b82f6" sub={`${pending} pending approval`}/>
        <StatCard label="Recipients"       value={users.filter(u=>u.role==="RECIPIENT").length} icon="🙋" accent="#8b5cf6" sub="Registered users"/>
        <StatCard label="Total Donations"  value={total}          icon="🍱" accent="#22c55e" sub="All time listings"/>
        <StatCard label="Claimed"          value={claimed}        icon="✅" accent="#f59e0b" sub={`${Math.round(claimed/total*100)}% claim rate`}/>
        <StatCard label="Expired"          value={expired}        icon="⏰" accent="#ef4444" sub={`${Math.round(expired/total*100)}% expiry rate`}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:16,marginBottom:16}}>
        <div className="card" style={{padding:22}}>
          <div style={{fontSize:13,fontWeight:600,color:"#64748b",marginBottom:18}}>Donations per day (last 7 days)</div>
          <BarChart/>
        </div>
        <div className="card" style={{padding:22}}>
          <div style={{fontSize:13,fontWeight:600,color:"#64748b",marginBottom:18}}>Status distribution</div>
          <DonutChart available={avail} claimed={claimed} expired={expired}/>
        </div>
      </div>

      {pending>0&&(
        <div style={{background:"#fff7ed",border:"1.5px solid #fed7aa",borderRadius:12,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:20}}>⏳</span>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:"#c2410c"}}>{pending} donor{pending>1?"s":""} awaiting verification</div>
              <div style={{fontSize:12,color:"#ea580c",marginTop:1}}>Review and approve or reject their requests</div>
            </div>
          </div>
          <button className="filter-btn active" style={{whiteSpace:"nowrap"}} onClick={()=>onNavigate("donors")}>Review now →</button>
        </div>
      )}
    </div>
  );
}

function DonorsPage({ donors, setDonors, showToast, setLogs }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const pending = donors.filter(d=>d.status==="PENDING").length;

  const filtered = donors.filter(d=>
    (filter==="ALL"||d.status===filter)&&
    (!search||d.name.toLowerCase().includes(search.toLowerCase())||d.email.toLowerCase().includes(search.toLowerCase()))
  );

  const approve = id => {
    const d = donors.find(x=>x.id===id);
    setDonors(p=>p.map(x=>x.id===id?{...x,status:"VERIFIED"}:x));
    setLogs(p=>[{id:Date.now(),color:"#16a34a",text:`Donor ${d.name} approved by admin`,time:"Just now"},...p]);
    showToast(`${d.name} approved ✓`, "#16a34a");
  };
  const reject = id => {
    const d = donors.find(x=>x.id===id);
    setDonors(p=>p.map(x=>x.id===id?{...x,status:"REJECTED"}:x));
    setLogs(p=>[{id:Date.now(),color:"#dc2626",text:`Donor ${d.name} rejected by admin`,time:"Just now"},...p]);
    showToast(`${d.name} rejected`, "#dc2626");
  };

  const FBTNS = [
    {v:"ALL",      l:"All"},
    {v:"PENDING",  l:`⏳ Pending (${pending})`},
    {v:"UNVERIFIED",l:"Unverified"},
    {v:"VERIFIED", l:"✅ Verified"},
    {v:"REJECTED", l:"Rejected"},
  ];

  return (
    <div className="page-enter">
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:22,fontWeight:700,color:"#1a1a2e",letterSpacing:-0.3}}>Donor Verification</h1>
        <p style={{fontSize:13.5,color:"#94a3b8",marginTop:4}}>Approve or reject donor registration requests</p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        {FBTNS.map(f=><button key={f.v} className={`filter-btn${filter===f.v?" active":""}`} onClick={()=>setFilter(f.v)}>{f.l}</button>)}
        <div className="search-box" style={{marginLeft:"auto"}}><SearchIcon/><input placeholder="Search donor..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      </div>
      <div className="card" style={{overflow:"hidden"}}>
        <table>
          <thead><tr><th>Donor</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length===0
              ?<tr><td colSpan={6} style={{textAlign:"center",padding:40,color:"#94a3b8"}}>No donors found</td></tr>
              :filtered.map(d=>(
              <tr key={d.id}>
                <td><div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Avatar name={d.name}/><span style={{fontWeight:600,color:"#1a1a2e"}}>{d.name}</span>
                </div></td>
                <td style={{color:"#64748b"}}>{d.email}</td>
                <td style={{color:"#64748b"}}>{d.phone}</td>
                <td style={{color:"#64748b"}}>{d.joined}</td>
                <td><Badge label={d.status}/></td>
                <td><div style={{display:"flex",gap:6}}>
                  {d.status!=="VERIFIED" &&<button className="btn-approve" onClick={()=>approve(d.id)}>✔ Approve</button>}
                  {d.status!=="REJECTED" &&<button className="btn-reject"  onClick={()=>reject(d.id)}>✖ Reject</button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DonationsPage({ donations, setDonations, showToast, setLogs }) {
  const [filter, setFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = donations.filter(d=>
    (filter==="ALL"||d.status===filter)&&
    (typeFilter==="ALL"||d.type===typeFilter)&&
    (!search||d.food.toLowerCase().includes(search.toLowerCase())||d.donor.toLowerCase().includes(search.toLowerCase()))
  );

  const del = id => {
    const d = donations.find(x=>x.id===id);
    if(!window.confirm(`Delete "${d.food}"?`)) return;
    setDonations(p=>p.filter(x=>x.id!==id));
    setLogs(p=>[{id:Date.now(),color:"#dc2626",text:`Donation ${d.food} deleted by admin`,time:"Just now"},...p]);
    showToast("Donation deleted","#dc2626");
  };

  const Chip = ({icon,text,danger}) => (
    <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,
      color:danger?"#dc2626":"#64748b",
      background:danger?"#fee2e2":"#f8fafc",
      border:`1px solid ${danger?"#fca5a5":"#e8ecf2"}`,
      borderRadius:20,padding:"3px 10px"}}>
      {icon} {text}
    </span>
  );

  return (
    <div className="page-enter">
      <div style={{marginBottom:18}}>
        <h1 style={{fontSize:22,fontWeight:700,color:"#1a1a2e",letterSpacing:-0.3}}>All Donations</h1>
        <p style={{fontSize:13.5,color:"#94a3b8",marginTop:4}}>{filtered.length} donation{filtered.length!==1?"s":""} found</p>
      </div>
      {/* Filter row matching screenshot */}
      <div style={{display:"flex",gap:10,marginBottom:20,alignItems:"center",flexWrap:"wrap"}}>
        <div className="search-box"><SearchIcon/><input placeholder="Search donations..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <select className="sel" value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="CLAIMED">Claimed</option>
          <option value="EXPIRED">Expired</option>
        </select>
        <select className="sel" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
          <option value="ALL">All types</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>
      </div>

      {filtered.length===0
        ?<div className="card" style={{padding:48,textAlign:"center",color:"#94a3b8"}}>No donations found</div>
        :filtered.map(d=>(
        <div key={d.id} className="donation-card">
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
            <div style={{display:"flex",alignItems:"center",gap:9,flexWrap:"wrap"}}>
              <span style={{fontSize:16,fontWeight:700,color:"#1a1a2e"}}>{d.food}</span>
              <Badge label={d.status}/>
              <Badge label={d.type}/>
            </div>
            <button className="btn-delete" onClick={()=>del(d.id)}>🗑 Delete</button>
          </div>
          <div style={{fontSize:13,color:"#94a3b8",marginBottom:10}}>by {d.donor}</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Chip icon="●" text={d.qty}/>
            <Chip icon="📍" text={d.location}/>
            <Chip icon="🕐" text={d.expires} danger={d.status==="EXPIRED"}/>
          </div>
          {d.status==="CLAIMED"&&(
            <div style={{marginTop:12,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"#15803d"}}>✓ Claimed by Recipient</div>
                <div style={{fontSize:11,color:"#16a34a",marginTop:2}}>{d.listed}</div>
              </div>
              <span style={{background:"#fef9c3",color:"#a16207",border:"1px solid #fde047",borderRadius:20,padding:"4px 14px",fontSize:12,fontWeight:600}}>
                ⏳ Pending pickup
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function UsersPage({ users, setUsers, showToast, setLogs }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = users.filter(u=>
    (filter==="ALL"||u.role===filter)&&
    (!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const del = (id, name) => {
    if(!window.confirm(`Delete user "${name}"?`)) return;
    setUsers(p=>p.filter(u=>u.id!==id));
    setLogs(p=>[{id:Date.now(),color:"#dc2626",text:`User ${name} deleted by admin`,time:"Just now"},...p]);
    showToast(`${name} deleted`,"#dc2626");
  };

  return (
    <div className="page-enter">
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:22,fontWeight:700,color:"#1a1a2e",letterSpacing:-0.3}}>User Management</h1>
        <p style={{fontSize:13.5,color:"#94a3b8",marginTop:4}}>View and manage all registered accounts</p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        {["ALL","DONOR","RECIPIENT","ADMIN"].map(f=>(
          <button key={f} className={`filter-btn${filter===f?" active":""}`} onClick={()=>setFilter(f)}>
            {f==="ALL"?"All":f.charAt(0)+f.slice(1).toLowerCase()+"s"}
          </button>
        ))}
        <div className="search-box" style={{marginLeft:"auto"}}><SearchIcon/><input placeholder="Search user..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      </div>
      <div className="card" style={{overflow:"hidden"}}>
        <table>
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length===0
              ?<tr><td colSpan={5} style={{textAlign:"center",padding:40,color:"#94a3b8"}}>No users found</td></tr>
              :filtered.map(u=>(
              <tr key={u.id}>
                <td><div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Avatar name={u.name}/><span style={{fontWeight:600,color:"#1a1a2e"}}>{u.name}</span>
                </div></td>
                <td style={{color:"#64748b"}}>{u.email}</td>
                <td><Badge label={u.role}/></td>
                <td style={{color:"#64748b"}}>{u.joined}</td>
                <td>{u.role!=="ADMIN"
                  ?<button className="btn-delete" onClick={()=>del(u.id,u.name)}>🗑 Delete</button>
                  :<span style={{fontSize:12,color:"#94a3b8",fontStyle:"italic"}}>Protected</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LogsPage({ logs }) {
  return (
    <div className="page-enter">
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:22,fontWeight:700,color:"#1a1a2e",letterSpacing:-0.3}}>Activity Logs</h1>
        <p style={{fontSize:13.5,color:"#94a3b8",marginTop:4}}>Full audit trail of all admin actions</p>
      </div>
      <div className="card" style={{overflow:"hidden"}}>
        {logs.map((log,i)=>(
          <div key={log.id} style={{display:"flex",gap:14,padding:"14px 20px",borderBottom:i<logs.length-1?"1px solid #f8fafc":"none",alignItems:"flex-start"}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:log.color,marginTop:3,flexShrink:0}}/>
            <div>
              <div style={{fontSize:13.5,color:"#374151"}}>{log.text}</div>
              <div style={{fontSize:11.5,color:"#94a3b8",marginTop:3}}>{log.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {id:"dashboard", label:"Overview"},
  {id:"donors",    label:"Donor Verification"},
  {id:"donations", label:"All Donations"},
  {id:"users",     label:"User Management"},
  {id:"logs",      label:"Activity Logs"},
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState(INIT_DONATIONS);
  const [users, setUsers] = useState(INIT_USERS);
  const [logs, setLogs] = useState(INIT_LOGS);
  const [toast, setToast] = useState({visible:false,msg:"",color:"#16a34a"});

  const showToast = (msg, color="#16a34a") => {
    setToast({visible:true,msg,color});
    setTimeout(()=>setToast(t=>({...t,visible:false})),2800);
  };
const fetchDonors = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/admin/donors");
    const data = await res.json();

    const mapped = data.map(u => ({
      id: u.id,
      name: u.fullName,
      email: u.email,
      phone: u.phone,
      joined: "—", // optional
      status: u.donorStatus,
    }));

    setDonors(mapped);

  } catch (err) {
    console.error("Error fetching donors:", err);
  }
};
  const pendingCount = donors.filter(d=>d.status==="PENDING").length;

  useEffect(() => {
  fetchDonors();
}, []);
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{display:"flex",minHeight:"100vh",background:"#f2f4f7"}}>

        {/* Sidebar */}
        <aside style={{
          width:220, minHeight:"100vh", background:"#fff",
          borderRight:"1px solid #e8ecf2",
          display:"flex", flexDirection:"column",
          position:"fixed", top:0, left:0, zIndex:100,
          boxShadow:"1px 0 8px rgba(0,0,0,0.04)",
        }}>
          {/* Logo */}
          <div style={{padding:"20px 18px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#f97316,#ef4444)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🍱</div>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"#f97316",letterSpacing:-0.3,fontFamily:"'DM Serif Display',serif"}}>FoodShare</div>
              <div style={{fontSize:11,color:"#94a3b8",fontWeight:500}}>Admin Portal</div>
            </div>
          </div>

          {/* Nav */}
          <div style={{padding:"14px 10px",flex:1}}>
            <div style={{fontSize:10,fontWeight:700,color:"#cbd5e1",letterSpacing:"1.2px",padding:"0 6px",marginBottom:8}}>MENU</div>
            {NAV_ITEMS.map(item=>(
              <div key={item.id} className={`nav-item${page===item.id?" active":""}`} onClick={()=>setPage(item.id)}>
                {ICONS[item.id]}
                {item.label}
                {item.id==="donors"&&pendingCount>0&&(
                  <span style={{marginLeft:"auto",background:"#f97316",color:"#fff",fontSize:10,fontWeight:800,padding:"1px 7px",borderRadius:10}}>
                    {pendingCount}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Admin footer */}
          <div style={{padding:"14px 16px 18px",borderTop:"1px solid #f1f5f9"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#f97316,#ef4444)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff"}}>SA</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e"}}>Super Admin</div>
                <div style={{fontSize:11,color:"#16a34a",fontWeight:600}}>✓ Verified</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{marginLeft:220,flex:1,minHeight:"100vh"}}>
          {/* Top bar */}
          <div style={{
            background:"#fff", borderBottom:"1px solid #e8ecf2",
            padding:"0 32px", height:60,
            display:"flex", alignItems:"center", justifyContent:"space-between",
            position:"sticky", top:0, zIndex:50,
            boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <h2 style={{fontSize:15,fontWeight:700,color:"#1a1a2e"}}>
              {NAV_ITEMS.find(n=>n.id===page)?.label}
            </h2>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button style={{padding:"6px 16px",borderRadius:8,border:"1.5px solid #e2e8f0",background:"#fff",color:"#374151",fontSize:13,fontWeight:600}}>
                🌙 Dark
              </button>
              <button style={{padding:"6px 18px",borderRadius:8,background:"#ef4444",color:"#fff",fontSize:13,fontWeight:700}}>
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{padding:"28px 32px",maxWidth:1080}}>
            {page==="dashboard"  &&<DashboardPage donors={donors} donations={donations} users={users} onNavigate={setPage}/>}
            {page==="donors"     &&<DonorsPage    donors={donors} setDonors={setDonors} showToast={showToast} setLogs={setLogs}/>}
            {page==="donations"  &&<DonationsPage donations={donations} setDonations={setDonations} showToast={showToast} setLogs={setLogs}/>}
            {page==="users"      &&<UsersPage     users={users} setUsers={setUsers} showToast={showToast} setLogs={setLogs}/>}
            {page==="logs"       &&<LogsPage      logs={logs}/>}
          </div>
        </main>
      </div>
      <Toast msg={toast.msg} color={toast.color} visible={toast.visible}/>
    </>
  );
}