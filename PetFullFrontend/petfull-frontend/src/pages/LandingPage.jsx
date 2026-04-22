import React, { useEffect, useRef, useState } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-main:    #f8f9fd;   /* Soft lavender/gray from your screenshot */
    --card-bg:    #ffffff;
    --primary:    #e8621a;   /* The orange from your "Pending" tags */
    --accent-v:   #6366f1;   /* Indigo for a modern touch */
    --accent-g:   #10b981;   /* Green for success states */
    --text-main:  #1e293b;
    --text-muted: #64748b;
    --border:     #e2e8f0;
    --font:       'Plus Jakarta Sans', sans-serif;
  }

  body {
    font-family: var(--font);
    background: var(--bg-main);
    color: var(--text-main);
    overflow-x: hidden;
    line-height: 1.5;
  }

  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 60px;
    transition: all 300ms ease;
  }
  .nav.scrolled {
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(12px);
    padding: 12px 60px;
    border-bottom: 1px solid var(--border);
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-size: 20px; font-weight: 800;
    color: var(--text-main); text-decoration: none;
  }
  .nav-logo-paw {
    width: 36px; height: 36px; border-radius: 10px;
    background: #fff; display: flex; align-items: center;
    justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  .nav-links { display: flex; align-items: center; gap: 12px; }
  .nav-link {
    padding: 8px 16px; border-radius: 8px; font-size: 14px;
    font-weight: 600; color: var(--text-muted); text-decoration: none;
    transition: all 200ms ease;
  }
  .nav-link:hover { color: var(--primary); background: #fff; }
  .nav-btn {
    padding: 10px 24px; border-radius: 10px;
    background: var(--text-main); color: #fff;
    font-size: 14px; font-weight: 700; border: none;
    cursor: pointer; transition: all 200ms ease; text-decoration: none;
  }
  .nav-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

  /* ── Hero ── */
  .hero {
    min-height: 90vh;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    padding: 140px 60px 80px;
    text-align: center;
  }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-radius: 99px;
    background: #fff; border: 1px solid var(--border);
    font-size: 12px; font-weight: 700; color: var(--primary);
    margin-bottom: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .hero-h1 {
    font-size: clamp(48px, 6vw, 82px);
    font-weight: 800; line-height: 1.1;
    letter-spacing: -2px; color: var(--text-main);
    max-width: 900px; margin-bottom: 24px;
  }
  .hero-h1 span { color: var(--primary); }
  
  .hero-sub {
    font-size: 18px; color: var(--text-muted);
    max-width: 600px; margin-bottom: 40px;
  }

  .btn-primary {
    padding: 16px 32px; border-radius: 12px;
    background: var(--primary); color: #fff;
    font-size: 16px; font-weight: 700;
    border: none; cursor: pointer; transition: 300ms; text-decoration: none;
    box-shadow: 0 10px 25px rgba(232, 98, 26, 0.2);
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(232, 98, 26, 0.3); }

  /* ── Dashboard-style Cards ── */
  .section { padding: 100px 60px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
  
  .white-card {
    background: var(--card-bg);
    border-radius: 20px;
    padding: 40px;
    border: 1px solid var(--border);
    transition: 300ms;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01);
  }
  .white-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05);
  }

  .icon-box {
    width: 50px; height: 50px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; margin-bottom: 24px;
    background: var(--bg-main);
  }

  .section-h2 { font-size: 42px; font-weight: 800; letter-spacing: -1px; margin-bottom: 12px; }

  /* ── Impact Section (Referencing your screenshot layout) ── */
  .stats-strip {
    display: flex; gap: 20px; justify-content: center; margin-bottom: 60px;
  }
  .stat-card {
    background: #fff; padding: 24px; border-radius: 16px; min-width: 200px;
    border: 1px solid var(--border); text-align: left;
  }
  .stat-val { font-size: 32px; font-weight: 800; color: var(--text-main); }
  .stat-lab { font-size: 13px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }

  /* ── Marquee ── */
  .marquee-wrap { background: #fff; padding: 20px 0; border-y: 1px solid var(--border); overflow: hidden; }
  .marquee-track { display: flex; animation: marquee 30s linear infinite; width: max-content; }
  .marquee-item { padding: 0 40px; font-weight: 700; color: var(--text-muted); font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  .footer { background: #fff; padding: 80px 60px 40px; border-top: 1px solid var(--border); }

  @media (max-width: 768px) {
    .nav { padding: 15px 24px; }
    .grid-3 { grid-template-columns: 1fr; }
    .section { padding: 60px 24px; }
  }
`;

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [heroRef, heroVisible] = useReveal();
  const [howRef, howVisible] = useReveal();

  return (
    <>
      <style>{CSS}</style>

      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="/" className="nav-logo">
          <div className="nav-logo-paw">🐾</div>
          <span style={{marginLeft: '8px'}}>PetFull</span>
        </a>
        <div className="nav-links">
          <a href="#how" className="nav-link">Process</a>
          <a href="#impact" className="nav-link">Impact</a>
          <a href="/login" className="nav-link">Login</a>
          <a href="/register" className="nav-btn">Join Now</a>
        </div>
      </nav>

      <section className="hero" ref={heroRef}>
        <div className="hero-tag">✨ Community Food Sharing</div>
        <h1 className="hero-h1">Sharing surplus food<br/>made <span>effortless.</span></h1>
        <p className="hero-sub">
          Join a verified network of donors and recipients. We help you track, share, and claim fresh food in real-time.
        </p>
        <div style={{display:'flex', gap: '16px'}}>
          <a href="/register" className="btn-primary">Start Donating</a>
          <a href="/register" className="nav-btn" style={{background:'#fff', color: 'var(--text-main)', border:'1px solid var(--border)'}}>Find Food</a>
        </div>
      </section>

      <div className="stats-strip">
        <div className="stat-card">
          <div className="stat-lab">Total Donations</div>
          <div className="stat-val">12,400+</div>
        </div>
        <div className="stat-card">
          <div className="stat-lab">Meals Provided</div>
          <div className="stat-val">60k</div>
        </div>
        <div className="stat-card">
          <div className="stat-lab">Success Rate</div>
          <div className="stat-val">98%</div>
        </div>
      </div>

      <div className="marquee-wrap">
        <div className="marquee-track">
          {["Verified Donors", "Real-time Tracking", "Zero Waste", "NGO Support", "Safe Pickups"].map((item, i) => (
            <span key={i} className="marquee-item">● {item}</span>
          ))}
          {/* Duplicate for loop */}
          {["Verified Donors", "Real-time Tracking", "Zero Waste", "NGO Support", "Safe Pickups"].map((item, i) => (
            <span key={i+5} className="marquee-item">● {item}</span>
          ))}
        </div>
      </div>

      <section className="section" id="how" ref={howRef} style={{background: '#fff'}}>
        <div style={{textAlign: 'center'}}>
          <h2 className="section-h2">How it works</h2>
          <p style={{color: 'var(--text-muted)'}}>Simple steps to make a massive difference.</p>
        </div>
        <div className="grid-3">
          {[
            { icon: "📝", t: "List Food", d: "Upload details of surplus food including expiry and location." },
            { icon: "🔔", t: "Instant Alert", d: "Nearby verified recipients get notified to claim the meal." },
            { icon: "🤝", t: "Secure Pickup", d: "Coordinate via the app for a smooth, safe handoff." }
          ].map((item, i) => (
            <div className="white-card" key={i} style={{background: 'var(--bg-main)', border: 'none'}}>
              <div className="icon-box" style={{background: '#fff'}}>{item.icon}</div>
              <h3 style={{marginBottom: '10px'}}>{item.t}</h3>
              <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="white-card" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '60px', background: 'var(--text-main)', color: '#fff'}}>
          <div>
            <h2 style={{fontSize: '32px', marginBottom: '12px'}}>Ready to reduce food waste?</h2>
            <p style={{opacity: 0.7}}>Create your donor or recipient account in less than 2 minutes.</p>
          </div>
          <a href="/register" className="btn-primary">Get Started Today →</a>
        </div>
      </section>

      <footer className="footer">
        <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px'}}>
          <div style={{maxWidth: '300px'}}>
            <div className="nav-logo" style={{marginBottom: '20px'}}>
              <div className="nav-logo-paw" style={{background: 'var(--bg-main)'}}>🐾</div>
              <span style={{marginLeft: '8px'}}>PetFull</span>
            </div>
            <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Connecting the community through the simple act of sharing food. Every meal counts.</p>
          </div>
          <div style={{display: 'flex', gap: '60px'}}>
            <div>
              <h4 style={{marginBottom: '15px'}}>Platform</h4>
              <p style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px'}}>Donors</p>
              <p style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px'}}>Recipients</p>
              <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>NGOs</p>
            </div>
            <div>
              <h4 style={{marginBottom: '15px'}}>Support</h4>
              <p style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px'}}>Help Center</p>
              <p style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px'}}>Safety</p>
              <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Terms</p>
            </div>
          </div>
        </div>
        <div style={{marginTop: '60px', paddingTop: '20px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center'}}>
          © 2026 PetFull. Built for a better tomorrow.
        </div>
      </footer>
    </>
  );
}