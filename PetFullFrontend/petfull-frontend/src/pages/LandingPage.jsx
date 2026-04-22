import React, { useEffect, useRef, useState } from "react";
import myLogo from "/"; // Adjust path to your file
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-main:    #f8f9fd;   /* Soft lavender/gray from your dashboard */
    --card-bg:    #ffffff;
    --primary:    #e8621a;   /* Dashboard orange accent */
    --green:      #2d5a27;   /* Kept for heritage but adjusted for light theme */
    --accent-v:   #6366f1;   /* Modern Indigo */
    --text:       #1e293b;
    --muted:      #64748b;
    --border:     #e2e8f0;
    --font-d:     'Fraunces', serif;
    --font:       'Plus Jakarta Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font);
    background: var(--bg-main);
    color: var(--text);
    overflow-x: hidden;
  }

  /* ── Noise texture (Lightened for pleasant look) ── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1000;
    opacity: .3;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-main); }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }

  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 60px;
    transition: all 400ms ease;
  }
  .nav.scrolled {
    background: rgba(255,255,255,.85);
    backdrop-filter: blur(12px);
    padding: 14px 60px;
    border-bottom: 1px solid var(--border);
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--font-d); font-size: 22px; font-weight: 900;
    color: var(--text); text-decoration: none;
  }
  .nav-logo-paw {
    width: 34px; height: 34px; border-radius: 10px;
    background: var(--text); color: #fff; display: flex; align-items: center;
    justify-content: center; font-size: 17px;
  }
  .nav-links { display: flex; align-items: center; gap: 8px; }
  .nav-link {
    padding: 8px 18px; border-radius: 99px; font-size: 14px;
    font-weight: 600; color: var(--muted); text-decoration: none;
    transition: all 200ms ease; cursor: pointer;
  }
  .nav-link:hover { color: var(--primary); background: #fff; }
  .nav-btn {
    padding: 10px 24px; border-radius: 12px;
    background: var(--text); color: #fff;
    font-size: 14px; font-weight: 700; border: none;
    cursor: pointer; transition: all 200ms ease; text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .nav-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 15px rgba(0,0,0,0.1); }

  /* ── Hero ── */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start;
    padding: 140px 60px 80px;
    position: relative; overflow: hidden;
  }
  .hero-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); opacity: .12; pointer-events: none;
  }
  .hero-blob-1 { width: 600px; height: 600px; background: var(--accent-v); top: -100px; right: -100px; }
  .hero-blob-2 { width: 400px; height: 400px; background: var(--primary); bottom: -50px; left: 30%; }

  .hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px; border-radius: 99px;
    background: #fff; border: 1px solid var(--border);
    font-size: 12px; font-weight: 700; color: var(--primary);
    text-transform: uppercase; letter-spacing: 1.5px;
    margin-bottom: 28px;
  }
  .hero-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); }

  .hero-h1 {
    font-family: var(--font-d);
    font-size: clamp(52px, 7vw, 96px);
    font-weight: 900; line-height: 1.0;
    letter-spacing: -2px; color: var(--text);
    max-width: 820px; margin-bottom: 28px;
  }
  .hero-h1 em { font-style: italic; color: var(--accent-v); font-weight: 300; }
  .hero-h1 .accent { position: relative; display: inline-block; }
  .hero-h1 .accent::after {
    content: ''; position: absolute; bottom: 4px; left: 0; right: 0;
    height: 8px; background: rgba(232, 98, 26, 0.15); border-radius: 3px; z-index: -1;
  }

  .hero-sub {
    font-size: 18px; color: var(--muted); line-height: 1.65;
    max-width: 520px; margin-bottom: 44px;
  }

  .hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
  .btn-primary {
    padding: 16px 36px; border-radius: 12px;
    background: var(--primary); color: #fff;
    font-size: 16px; font-weight: 700;
    border: none; cursor: pointer; transition: all 250ms ease; text-decoration: none;
    display: inline-flex; align-items: center; gap: 8px;
    box-shadow: 0 10px 25px rgba(232, 98, 26, 0.2);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(232, 98, 26, 0.3); }
  .btn-outline {
    padding: 16px 36px; border-radius: 12px;
    background: #fff; color: var(--text);
    font-size: 16px; font-weight: 700;
    border: 1px solid var(--border); cursor: pointer;
    transition: all 250ms ease; text-decoration: none;
  }
  .btn-outline:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }

  .hero-stats {
    display: flex; gap: 48px; margin-top: 80px;
    padding-top: 40px; border-top: 1px solid var(--border);
  }
  .hero-stat-num {
    font-family: var(--font-d); font-size: 36px; font-weight: 900;
    color: var(--text); letter-spacing: -1px; line-height: 1;
  }
  .hero-stat-label { font-size: 13px; color: var(--muted); margin-top: 4px; font-weight: 600; text-transform: uppercase; }

  /* ── Marquee ── */
  .marquee-wrap { background: #fff; padding: 16px 0; overflow: hidden; border-y: 1px solid var(--border); }
  .marquee-track { display: flex; gap: 0; animation: marquee 28s linear infinite; width: max-content; }
  .marquee-item {
    display: inline-flex; align-items: center; gap: 16px;
    padding: 0 32px; font-size: 13px; font-weight: 800;
    color: var(--muted); text-transform: uppercase;
    letter-spacing: 1px; white-space: nowrap;
  }
  .marquee-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--primary); }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ── General Section Styles ── */
  .section { padding: 120px 60px; }
  .section-tag {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 2px; color: var(--primary); margin-bottom: 20px;
  }
  .section-tag-line { width: 28px; height: 2px; background: var(--primary); border-radius: 2px; }
  .section-h2 {
    font-family: var(--font-d); font-size: clamp(36px, 4vw, 58px);
    font-weight: 900; line-height: 1.1; letter-spacing: -1.5px;
    color: var(--text); margin-bottom: 16px;
  }
  .section-h2 em { font-style: italic; color: var(--accent-v); font-weight: 300; }
  .section-sub { font-size: 17px; color: var(--muted); line-height: 1.6; max-width: 480px; }

  /* ── How It Works (Steps) ── */
  .steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-top: 72px; }
  .step-card {
    background: #fff; border-radius: 24px;
    padding: 40px 36px; position: relative; overflow: hidden;
    border: 1px solid var(--border);
    transition: all 300ms ease;
  }
  .step-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
  .step-card:nth-child(2) { background: var(--text); color: #fff; margin-top: 32px; border: none; }
  .step-card:nth-child(2) .step-sub { color: rgba(255,255,255,.7); }
  .step-card:nth-child(2) .step-num { color: rgba(255,255,255,.1); }
  .step-card:nth-child(3) { margin-top: 64px; }
  .step-num {
    font-family: var(--font-d); font-size: 80px; font-weight: 900;
    color: var(--bg-main); line-height: 1; margin-bottom: 24px;
  }
  .step-icon { font-size: 36px; margin-bottom: 20px; }
  .step-title { font-family: var(--font-d); font-size: 26px; font-weight: 700; margin-bottom: 12px; }
  .step-sub { font-size: 15px; line-height: 1.65; color: var(--muted); }

  /* ── Features ── */
  .features-section { padding: 120px 60px; background: #fff; border-y: 1px solid var(--border); }
  .features-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; margin-top: 72px; }
  .feature-card {
    border-radius: 24px; padding: 36px;
    border: 1px solid var(--border); background: var(--bg-main);
    transition: all 300ms ease; position: relative;
  }
  .feature-card:hover { border-color: var(--accent-v); transform: translateY(-4px); background: #fff; }
  .feature-card.large { grid-column: span 2; display: flex; gap: 48px; align-items: center; }
  .feature-icon-wrap {
    width: 56px; height: 56px; border-radius: 16px;
    background: #fff; display: flex; box-shadow: 0 4px 10px rgba(0,0,0,0.04);
    align-items: center; justify-content: center; font-size: 26px;
    margin-bottom: 20px;
  }
  .feature-title { font-family: var(--font-d); font-size: 22px; font-weight: 700; margin-bottom: 10px; }
  .feature-desc { font-size: 14.5px; color: var(--muted); line-height: 1.65; }

  /* ── Impact ── */
  .impact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; margin-top: 72px; }
  .impact-visual { position: relative; height: 480px; }
  .impact-card-big {
    position: absolute; background: var(--text); color: #fff;
    border-radius: 28px; padding: 40px; width: 300px; top: 0; left: 0;
    box-shadow: 0 32px 60px rgba(0,0,0,0.1);
  }
  .impact-card-big-num { font-family: var(--font-d); font-size: 64px; font-weight: 900; line-height: 1; }
  .impact-card-big-label { font-size: 14px; opacity: .7; margin-top: 8px; font-weight: 600; }
  
  .impact-card-sm {
    position: absolute; background: #fff; border-radius: 20px; padding: 24px 28px;
    border: 1px solid var(--border); box-shadow: 0 16px 40px rgba(0,0,0,0.04);
  }
  .impact-card-sm-1 { right: 20px; top: 60px; width: 200px; }
  .impact-card-sm-2 { left: 60px; bottom: 40px; width: 240px; }
  .impact-card-sm-3 { right: 0; bottom: 120px; width: 190px; }
  .impact-card-sm-num { font-family: var(--font-d); font-size: 32px; font-weight: 900; color: var(--primary); }

  .impact-list { list-style: none; margin-top: 36px; display: flex; flex-direction: column; gap: 16px; }
  .impact-list-item { display: flex; align-items: flex-start; gap: 14px; font-size: 16px; color: var(--muted); }
  .impact-list-check {
    width: 24px; height: 24px; border-radius: 50%;
    background: rgba(99, 102, 241, 0.1); display: flex;
    align-items: center; justify-content: center;
    font-size: 12px; color: var(--accent-v); flex-shrink: 0;
  }

  /* ── Roles ── */
  .roles-section { padding: 120px 60px; background: #fff; border-top: 1px solid var(--border); }
  .roles-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-top: 72px; }
  .role-card {
    background: var(--bg-main); border-radius: 24px; padding: 44px 36px;
    border: 1px solid var(--border); transition: all 300ms ease; cursor: pointer;
  }
  .role-card:hover { border-color: var(--accent-v); transform: translateY(-4px); background: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.04); }
  .role-emoji { font-size: 48px; margin-bottom: 24px; display: block; }
  .role-title { font-family: var(--font-d); font-size: 28px; font-weight: 900; margin-bottom: 12px; }
  .role-desc { font-size: 15px; color: var(--muted); margin-bottom: 28px; }
  .role-perk { font-size: 13px; color: var(--text); font-weight: 700; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
  .role-perk::before { content: '✓'; color: var(--accent-v); }

  /* ── Testimonials ── */
  .testimonial-card { background: #fff; border-radius: 24px; padding: 36px; border: 1px solid var(--border); transition: 300ms; }
  .testimonial-card:nth-child(2) { background: var(--accent-v); color: #fff; margin-top: 28px; border: none; }
  .testimonial-card:nth-child(2) .testimonial-text, .testimonial-card:nth-child(2) .testimonial-role { color: rgba(255,255,255,0.7); }
  .testimonial-card:nth-child(2) .testimonial-name { color: #fff; }
  .testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }

  /* ── CTA ── */
  .cta-section {
    margin: 0 60px 120px; border-radius: 36px;
    background: var(--text); padding: 100px 80px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
    position: relative; overflow: hidden;
  }
  .cta-h2 { font-family: var(--font-d); font-size: clamp(36px,4vw,64px); font-weight: 900; color: #fff; margin-bottom: 20px; }
  .cta-sub { font-size: 18px; color: rgba(255,255,255,.6); margin-bottom: 44px; max-width: 500px; }

  /* ── Footer ── */
  .footer { background: #fff; border-top: 1px solid var(--border); padding: 80px 60px 40px; }
  .footer-logo-text { font-family: var(--font-d); font-size: 20px; font-weight: 900; color: var(--text); }
  .footer-col-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--text); margin-bottom: 20px; }
  .footer-link { font-size: 14px; color: var(--muted); text-decoration: none; transition: 200ms; }
  .footer-link:hover { color: var(--primary); }

  /* ── Animations ── */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .reveal { opacity: 0; transform: translateY(32px); transition: opacity .8s ease, transform .8s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 1024px) {
    .nav { padding: 18px 32px; }
    .hero, .section, .footer { padding: 80px 32px; }
    .grid-3, .steps-grid, .features-grid, .roles-grid, .impact-grid { grid-template-columns: 1fr; }
    .step-card:nth-child(2), .step-card:nth-child(3) { margin-top: 0; }
  }
`;

// Animation Hook
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Reveal Hook
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (node) obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function StatItem({ num, suffix, label, start }) {
  const count = useCounter(num, 1800, start);
  return (
    <div>
      <div className="hero-stat-num">{count.toLocaleString()}{suffix}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const node = statsRef.current;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.4 });
    if (node) obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const [howRef, howVisible]     = useReveal();
  const [featRef, featVisible]   = useReveal();
  const [impRef, impVisible]     = useReveal();
  const [rolesRef, rolesVisible] = useReveal();
  const [testRef, testVisible]   = useReveal();
  const [ctaRef, ctaVisible]     = useReveal();

  const MARQUEE_ITEMS = ["Zero Food Waste", "Verified Donors", "Real-Time Tracking", "Community Impact", "Fresh Food Access", "Sustainable Future", "Connect & Share", "Make a Difference"];

  return (
    <>
      <style>{CSS}</style>

      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="/" className="nav-logo">
  <img 
    src="/PetFullLogo.jpg" 
    alt="PetFull Logo" 
    style={{ width: '34px', height: '34px', borderRadius: '10px', objectFit: 'cover' }} 
  />
  <span style={{ marginLeft: '10px' }}>PetFull</span>
</a>
        <div className="nav-links">
          <a href="#how" className="nav-link">Process</a>
          <a href="#impact" className="nav-link">Impact</a>
          <a href="#roles" className="nav-link">For you</a>
          <a href="/login" className="nav-link">Sign In</a>
          <a href="/register" className="nav-btn">Get Started</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-blob hero-blob-1"/>
        <div className="hero-blob hero-blob-2"/>
        <div className="hero-tag"><span className="hero-tag-dot"/> Community Driven · India</div>
        <h1 className="hero-h1">Turn surplus food<br/>into <em>someone's</em><br/><span className="accent">next meal</span></h1>
        <p className="hero-sub">PetFull connects food donors with verified recipients — making it effortless to share and track donations across your community.</p>
        <div className="hero-cta">
          <a href="/register" className="btn-primary">Start Donating 🍱</a>
          <a href="/register?role=RECIPIENT" className="btn-outline">Find Food Near Me</a>
        </div>
        <div className="hero-stats" ref={statsRef}>
          <StatItem num={12400} suffix="+" label="Meals donated" start={statsVisible}/>
          <StatItem num={840}   suffix="+" label="Active donors"  start={statsVisible}/>
          <StatItem num={98}    suffix="%" label="Success rate" start={statsVisible}/>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">{item} <span className="marquee-dot"/></span>
          ))}
        </div>
      </div>

      <section className="section" id="how" ref={howRef}>
        <div className={`reveal ${howVisible ? "visible" : ""}`}>
          <div className="section-tag"><span className="section-tag-line"/> How It Works</div>
          <h2 className="section-h2">Three steps to <em>zero</em><br/>food waste</h2>
        </div>
        <div className="steps-grid">
          {[
            { num:"01", icon:"📋", title:"List donation", desc:"Add food details—quantity, type, and location. Takes under 2 mins." },
            { num:"02", icon:"🔍", title:"Claim instantly", desc:"Recipients nearby browse and claim what they need in real-time." },
            { num:"03", icon:"🤝", title:"Track impact", desc:"Coordinate pickup directly. See your community impact score grow." },
          ].map((s, i) => (
            <div key={i} className={`step-card reveal ${howVisible ? "visible" : ""}`}>
              <div className="step-num">{s.num}</div>
              <div className="step-icon">{s.icon}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-sub">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section" ref={featRef}>
        <div className={`reveal ${featVisible ? "visible" : ""}`}>
          <div className="section-tag"><span className="section-tag-line"/> Features</div>
          <h2 className="section-h2">Everything you <em>need</em></h2>
        </div>
        <div className="features-grid">
          {[
            { icon:"✓", title:"Verified system", desc:"Donors are verified to ensure food safety and trust." },
            { icon:"⏱", title:"Expiry alerts", desc:"Smart notifications when food is about to expire." },
            { icon:"📊", title:"Impact analytics", desc:"Track meals and waste reduction scores.", large:true, extra:"Every milestone represents real food reaching real people. The dashboard celebrates your most dedicated moments." },
          ].map((f, i) => (
            <div key={i} className={`feature-card ${f.large ? "large" : ""} reveal ${featVisible ? "visible" : ""}`}>
              <div>
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
              {f.large && <div style={{flex:1, padding:'20px', background:'#fff', borderRadius:'16px', border:'1px solid var(--border)'}}>{f.extra}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="impact" ref={impRef}>
        <div className="impact-grid">
          <div className={`reveal ${impVisible ? "visible" : ""}`}>
            <div className="section-tag"><span className="section-tag-line"/> Impact</div>
            <h2 className="section-h2">Numbers that<br/><em>matter</em></h2>
            <ul className="impact-list">
              {["End-to-end tracking","Verified safety","Free forever"].map((item,i) => (
                <li key={i} className="impact-list-item"><span className="impact-list-check">✓</span>{item}</li>
              ))}
            </ul>
          </div>
          <div className={`impact-visual reveal ${impVisible ? "visible" : ""}`}>
             <div className="impact-card-big"><div className="impact-card-big-num">12K+</div><div className="impact-card-big-label">Meals donated</div></div>
             <div className="impact-card-sm impact-card-sm-1"><div className="impact-card-sm-num">840+</div><div className="impact-card-sm-label">Donors</div></div>
          </div>
        </div>
      </section>

      <section className="roles-section" id="roles" ref={rolesRef}>
        <div className={`reveal ${rolesVisible ? "visible" : ""}`} style={{textAlign:'center'}}>
          <h2 className="section-h2">Built for <em>everyone</em></h2>
        </div>
        <div className="roles-grid">
          {[
            { emoji:"🧑‍🍳", title:"Donors", perks:["Get verified","Track impact"] },
            { emoji:"🙋", title:"Recipients", perks:["Find food","Free access"] },
            { emoji:"⚙️", title:"Admins", perks:["Moderate listings","Audit trail"] },
          ].map((r, i) => (
            <div key={i} className={`role-card reveal ${rolesVisible ? "visible" : ""}`}>
              <span className="role-emoji">{r.emoji}</span>
              <h3 className="role-title">{r.title}</h3>
              {r.perks.map(p => <div key={p} className="role-perk">{p}</div>)}
            </div>
          ))}
        </div>
      </section>

      <section className="section" ref={testRef}>
        <div className={`reveal ${testVisible ? "visible" : ""}`}>
          <h2 className="section-h2">Community <em>Voices</em></h2>
        </div>
        <div className="steps-grid">
           {[
             { q:"Simple and effective. Donated 200 meals in a week.", n:"Priya S.", r:"Restaurateur" },
             { q:"Found fresh food within 2km. Trustworthy and fast.", n:"Rahul M.", r:"Recipient" },
             { q:"Game changer for NGO coordination.", n:"Deepa N.", r:"NGO Lead" }
           ].map((t, i) => (
             <div key={i} className={`testimonial-card reveal ${testVisible ? "visible" : ""}`}>
                <p className="testimonial-text">"{t.q}"</p>
                <div style={{marginTop:'20px'}}><strong>{t.n}</strong> — {t.r}</div>
             </div>
           ))}
        </div>
      </section>

      <div ref={ctaRef}>
        <div className={`cta-section reveal ${ctaVisible ? "visible" : ""}`}>
          <h2 className="cta-h2">Ready to make<br/><em>food matter</em>?</h2>
          <div className="hero-cta">
            <a href="/register" className="btn-primary" style={{background:'#fff', color:'var(--text)'}}>Start for free</a>
            <a href="/login" className="btn-outline" style={{background:'transparent', color:'#fff'}}>Sign in</a>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'40px'}}>
          <div>
            <div className="nav-logo" style={{ marginBottom: '20px' }}>
  <img 
    src="/cd068eaa-4022-44b6-a781-b530207b1a9...jpg" 
    alt="PetFull Logo" 
    style={{ width: '34px', height: '34px', borderRadius: '10px', objectFit: 'cover' }} 
  />
  <span className="footer-logo-text" style={{ marginLeft: '10px' }}>PetFull</span>
</div>
            <p style={{maxWidth:'300px', color:'var(--muted)'}}>Building hunger-free communities, one meal at a time.</p>
          </div>
          <div style={{display:'flex', gap:'60px'}}>
            <div>
              <div className="footer-col-title">Platform</div>
              <a href="/register" className="footer-link">Donate</a><br/>
              <a href="/register" className="footer-link">Find Food</a>
            </div>
          </div>
        </div>
        <div style={{marginTop:'60px', textAlign:'center', color:'var(--muted)', fontSize:'12px'}}>
          © 2026 PetFull. Made with 🌿 for communities.
        </div>
      </footer>
    </>
  );
}