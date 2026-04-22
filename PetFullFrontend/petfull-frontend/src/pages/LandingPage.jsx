import React, { useEffect, useRef, useState } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-main:    #f8f9fd;
    --card-bg:    #ffffff;
    --primary:    #e8621a;
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
  }

  /* Reveal Animation */
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease-out;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Nav */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 60px; transition: 300ms;
  }
  .nav.scrolled {
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(12px);
    padding: 12px 60px;
    border-bottom: 1px solid var(--border);
  }

  .nav-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; text-decoration: none; color: inherit; }
  .nav-logo-paw { width: 36px; height: 36px; background: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

  .nav-links { display: flex; align-items: center; gap: 12px; }
  .nav-link { padding: 8px 16px; font-size: 14px; font-weight: 600; color: var(--text-muted); text-decoration: none; }
  .nav-btn { padding: 10px 24px; border-radius: 10px; background: var(--text-main); color: #fff; font-weight: 700; text-decoration: none; font-size: 14px; }

  /* Hero */
  .hero { min-height: 90vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 100px 60px; text-align: center; }
  .hero-tag { padding: 8px 16px; background: #fff; border: 1px solid var(--border); border-radius: 99px; font-size: 12px; font-weight: 700; color: var(--primary); margin-bottom: 24px; }
  .hero-h1 { font-size: clamp(40px, 6vw, 72px); font-weight: 800; line-height: 1.1; margin-bottom: 24px; }
  .hero-h1 span { color: var(--primary); }
  .hero-sub { color: var(--text-muted); max-width: 600px; margin-bottom: 40px; font-size: 18px; }

  .btn-primary { padding: 16px 32px; background: var(--primary); color: #fff; border-radius: 12px; text-decoration: none; font-weight: 700; box-shadow: 0 10px 20px rgba(232, 98, 26, 0.2); transition: 0.3s; }
  .btn-primary:hover { transform: translateY(-3px); }

  /* Cards */
  .section { padding: 80px 60px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
  .white-card { background: #fff; padding: 40px; border-radius: 20px; border: 1px solid var(--border); transition: 0.3s; }
  .icon-box { width: 50px; height: 50px; border-radius: 12px; background: var(--bg-main); display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px; }

  .stats-strip { display: flex; gap: 20px; justify-content: center; margin-bottom: 60px; flex-wrap: wrap; }
  .stat-card { background: #fff; padding: 24px; border-radius: 16px; border: 1px solid var(--border); min-width: 200px; }
  .stat-val { font-size: 32px; font-weight: 800; }
  .stat-lab { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }

  .footer { background: #fff; padding: 60px; border-top: 1px solid var(--border); }

  @media (max-width: 768px) {
    .nav { padding: 20px; }
    .hero { padding: 100px 20px; }
    .grid-3 { grid-template-columns: 1fr; }
    .section { padding: 60px 20px; }
  }
`;

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    if (node) obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [heroRef, heroVisible] = useReveal();
  const [howRef, howVisible] = useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="/" className="nav-logo">
          <div className="nav-logo-paw">🐾</div>
          <span>PetFull</span>
        </a>
        <div className="nav-links">
          <a href="#how" className="nav-link">Process</a>
          <a href="/login" className="nav-link">Login</a>
          <a href="/register" className="nav-btn">Join Now</a>
        </div>
      </nav>

      {/* FIXED: heroVisible is now used in className */}
      <section className={`hero reveal ${heroVisible ? "visible" : ""}`} ref={heroRef}>
        <div className="hero-tag">✨ Community Food Sharing</div>
        <h1 className="hero-h1">Sharing surplus food<br/>made <span>effortless.</span></h1>
        <p className="hero-sub">
          Join a verified network of donors and recipients. We help you track, share, and claim fresh food in real-time.
        </p>
        <a href="/register" className="btn-primary">Start Donating Today</a>
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
      </div>

      {/* FIXED: howVisible is now used in className */}
      <section className={`section reveal ${howVisible ? "visible" : ""}`} id="how" ref={howRef} style={{background: '#fff'}}>
        <div style={{textAlign: 'center'}}>
          <h2 style={{fontSize: '36px', fontWeight: 800}}>How it works</h2>
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

      <footer className="footer">
        <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px'}}>
          <div style={{maxWidth: '300px'}}>
            <div className="nav-logo" style={{marginBottom: '20px'}}>
              <div className="nav-logo-paw" style={{background: 'var(--bg-main)'}}>🐾</div>
              <span>PetFull</span>
            </div>
            <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Connecting the community through the simple act of sharing food.</p>
          </div>
          <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>
            © 2026 PetFull. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}