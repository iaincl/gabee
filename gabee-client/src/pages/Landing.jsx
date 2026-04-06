import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CORTADO = "#7C3D00";

const DEMO_BREWS = [
  { type: "brew", bean_name: "Ethiopia Yirgacheffe", brew_time: 36, dose_in: 18, yield_out: 36, caffeine_mg: 63, rating: 5, ratioStatus: "on_target", brewed_at: "08:14" },
  { type: "drink", drink_type: "Iced Americano", place_name: "Ona Coffee", caffeine_mg: 126, drank_at: "11:30" },
  { type: "brew", bean_name: "Colombia Huila", brew_time: 34, dose_in: 18, yield_out: 38, caffeine_mg: 63, rating: 4, ratioStatus: "over_extracted", brewed_at: "07:02" },
];
function IcedCup() {
    const [mg, setMg] = useState(0);
    const [animDone, setAnimDone] = useState(false);
    const CUP_TOP = 32, CUP_BOTTOM = 188, CH = CUP_BOTTOM - CUP_TOP;
    const LIMIT = 400;
    const pct = Math.min(mg / LIMIT, 1);
    const liquidY = Math.round(CUP_BOTTOM - pct * CH);
    const liquidH = Math.round(pct * CH);
    const showIce = pct > 0.15;
    const showFoam = pct > 0.05;
    const liquidColor = pct >= 1 ? "#3B0000" : pct >= 0.75 ? "#4A1500" : "#5C2E00";
  
    const getCups = (mg) => {
      const cups = mg / 95;
      if (mg === 0) return { label: "0 cups", sub: "no caffeine yet" };
      if (cups < 1.5) return { label: "1 cup", sub: `~${Math.round(mg)}mg` };
      if (cups < 2.5) return { label: "2 cups", sub: `~${Math.round(mg)}mg` };
      if (cups < 3.5) return { label: "3 cups", sub: `~${Math.round(mg)}mg` };
      if (cups < 4.5) return { label: "4 cups", sub: `~${Math.round(mg)}mg` };
      return { label: "4+ cups", sub: `~${Math.round(mg)}mg — limit!` };
    };
  
    const getStatus = (pct) => {
      if (pct === 0) return { msg: "NO CAFFEINE YET — TIME FOR A SHOT", bg: "#F3F4F6", color: "#6B7280" };
      if (pct < 0.25) return { msg: "JUST GETTING STARTED", bg: "#F0FDF4", color: "#15803D" };
      if (pct < 0.5) return { msg: "LOOKING GOOD — ROOM FOR MORE", bg: "#F0FDF4", color: "#15803D" };
      if (pct < 0.75) return { msg: "HALF WAY — SIP MINDFULLY", bg: "#FEF3C7", color: "#D97706" };
      if (pct < 1) return { msg: "ALMOST AT YOUR LIMIT", bg: "#FEF3C7", color: "#D97706" };
      return { msg: "DAILY LIMIT REACHED — TIME FOR WATER!", bg: "#FEE2E2", color: "#DC2626" };
    };
  
    useEffect(() => {
      let step = 0;
      const target = 209;
      const steps = 80;
      const timer = setInterval(() => {
        step++;
        const eased = 1 - Math.pow(1 - step / steps, 3);
        setMg(Math.round(eased * target));
        if (step >= steps) {
          setMg(target);
          setAnimDone(true);
          clearInterval(timer);
        }
      }, 1000 / steps);
      return () => clearInterval(timer);
    }, []);
  
    const cups = getCups(mg);
    const status = getStatus(pct);
  
    const SmallCup = ({ color }) => (
      <svg width="14" height="18" viewBox="0 0 18 22" xmlns="http://www.w3.org/2000/svg">
        <path d="M3,4 L2,17 Q2,19 4,19 L14,19 Q16,19 16,17 L15,4 Z" fill="none" stroke={color} strokeWidth="1.5"/>
        <ellipse cx="9" cy="4" rx="6" ry="1.5" fill={color === "#CCC" ? "#EEE" : color === "#DC2626" ? "#FEE2E2" : "#FDF4EC"} stroke={color} strokeWidth="1"/>
        <path d="M16,8 Q20,8 20,11 Q20,14 16,14" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width="180" height="200" viewBox="0 0 180 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="landingClip">
              <path d="M44,32 L38,180 Q38,188 46,188 L126,188 Q134,188 134,180 L128,32 Z"/>
            </clipPath>
          </defs>
          <path d="M44,32 L38,180 Q38,188 46,188 L126,188 Q134,188 134,180 L128,32 Z" fill="#fff"/>
          <g clipPath="url(#landingClip)">
            <rect x="16" y={liquidY} width="130" height={liquidH} fill={liquidColor}/>
            {showFoam && (
              <rect x="20" y={liquidY - 3} width="120" height="6" rx="3" fill="#A0522D" opacity="0.65"/>
            )}
            {showIce && <>
              <rect x="42" y={liquidY + 4} width="22" height="22" rx="3" fill="white" opacity="0.45"/>
              <rect x="71" y={liquidY + 10} width="18" height="18" rx="3" fill="white" opacity="0.35"/>
              <rect x="98" y={liquidY + 2} width="20" height="20" rx="3" fill="white" opacity="0.4"/>
              <rect x="48" y={liquidY + 28} width="16" height="16" rx="3" fill="white" opacity="0.3"/>
              <rect x="84" y={liquidY + 26} width="20" height="20" rx="3" fill="white" opacity="0.38"/>
            </>}
          </g>
          <path d="M44,32 L38,180 Q38,188 46,188 L126,188 Q134,188 134,180 L128,32 Z" fill="none" stroke="#111" strokeWidth="2"/>
          <ellipse cx="86" cy="32" rx="42" ry="6" fill="#F3F4F6" stroke="#111" strokeWidth="1.5"/>
          <path d="M134,72 Q158,72 158,110 Q158,140 134,140" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
          <g fill="#111" opacity="0.07">
            <ellipse cx="42" cy="95" rx="2" ry="3.5"/>
            <ellipse cx="132" cy="118" rx="1.5" ry="2.5"/>
            <ellipse cx="40" cy="140" rx="1.5" ry="2.5"/>
          </g>
        </svg>
  
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 52, color: "#111", letterSpacing: "-0.02em", lineHeight: 1, marginTop: 12 }}>
          {Math.round(mg)}
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 10, color: "#444", letterSpacing: "0.08em", marginTop: 6, marginBottom: 10 }}>
          MG CAFFEINE · 400MG DAILY LIMIT
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 10, padding: "6px 14px", borderRadius: 2, letterSpacing: "0.06em", marginBottom: 20, background: status.bg, color: status.color }}>
          {status.msg}
        </div>
  
        {/* Slider */}
        {animDone && (
          <div style={{ width: "100%", maxWidth: 280 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <SmallCup color="#CCC"/>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 700, color: "#CCC" }}>0 cups</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700, color: pct >= 1 ? "#DC2626" : pct >= 0.75 ? "#D97706" : "#111" }}>
                  {cups.label}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#999" }}>{cups.sub}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  <SmallCup color="#7C3D00"/>
                  <SmallCup color="#7C3D00"/>
                  <SmallCup color="#7C3D00"/>
                  <SmallCup color="#DC2626"/>
                </div>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 700, color: "#DC2626" }}>4+ cups</span>
              </div>
            </div>
            <input
              type="range" min="0" max="400" step="1"
              value={mg}
              onChange={e => setMg(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>
    );
  }

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={s.page}>
      {/* Ticker */}
      <div style={s.ticker}>
        <div style={s.tickerTrack}>
          {[1, 2].map(i => (
            <span key={i} style={s.tickerInner}>
              GABEE — YOUR PERSONAL COFFEE DIARY &nbsp;•&nbsp; TRACK EVERY SHOT &nbsp;•&nbsp; DIAL IN YOUR ESPRESSO &nbsp;•&nbsp; MONITOR YOUR CAFFEINE &nbsp;•&nbsp; KNOW YOUR LIMIT &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav style={s.navbar}>
        <div style={s.logo}>GA<span style={{ color: CORTADO }}>B</span>EE</div>
        <div style={s.navRight}>
          <button style={s.navLogin} onClick={() => navigate("/login")}>SIGN IN</button>
          <button style={s.navSignup} onClick={() => navigate("/login")}>GET STARTED</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroLeft}>
          <div style={s.heroTag}>YOUR PERSONAL COFFEE DIARY</div>
          <div style={s.heroTitle}>
            Every shot.<br/>
            Every sip.<br/>
            <span style={{ color: CORTADO }}>Dialled in.</span>
          </div>
          <div style={s.heroSub}>
            Track your espresso pulls, log outside drinks, and monitor your daily caffeine — all in one clean, minimal app built for coffee obsessives.
          </div>
          <div style={s.heroBtns}>
            <button style={s.btnPrimary} onClick={() => navigate("/login")}>
              Start tracking free
            </button>
            <button style={s.btnSecondary} onClick={() => {
              document.getElementById("features").scrollIntoView({ behavior: "smooth" });
            }}>
              See how it works
            </button>
          </div>
        </div>

        <div style={s.heroRight}>
        <IcedCup />
        </div>
        </div>

      {/* Stats bar */}
      <div style={s.statsBar}>
        {[
          { val: "400mg", lbl: "DAILY LIMIT TRACKED" },
          { val: "1:2", lbl: "GOLDEN RATIO CHECKER" },
          { val: "12+", lbl: "DRINK TYPES SUPPORTED" },
          { val: "100%", lbl: "FREE TO USE" },
        ].map((stat, i) => (
          <div key={i} style={{
            ...s.statItem,
            borderRight: i < 3 ? "1px solid #EBEBEB" : "none"
          }}>
            <div style={s.statVal}>{stat.val}</div>
            <div style={s.statLbl}>{stat.lbl}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div id="features" style={s.features}>
        <div style={s.featuresTitle}>EVERYTHING YOU NEED TO DIAL IN</div>
        <div style={s.featuresGrid}>
          {[
            { emoji: "⚗️", title: "Espresso dial-in", desc: "Log dose, yield, grind and brew time. Get instant ratio feedback — perfect, under, or over extracted." },
            { emoji: "🧊", title: "Outside drink tracker", desc: "Log café drinks, office coffee, energy drinks. Auto-estimates caffeine so you don't have to." },
            { emoji: "📊", title: "Daily caffeine cup", desc: "An animated iced cup fills up as you consume caffeine. Visual, intuitive, and oddly satisfying." },
            { emoji: "⚠️", title: "Smart alerts", desc: "Get notified when you're approaching your daily 400mg limit. Stay informed, not wired." },
            { emoji: "📅", title: "Full history", desc: "Every brew and drink logged, grouped by day. See your best shots and track your habits over time." },
            { emoji: "🔒", title: "Private & secure", desc: "Your data is yours. Secure auth with hashed passwords and JWT tokens. Nobody else sees your logs." },
          ].map((f, i) => (
            <div key={i} style={s.featureCard}>
              <div style={s.featureEmoji}>{f.emoji}</div>
              <div style={s.featureTitle}>{f.title}</div>
              <div style={s.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo cards */}
      <div style={s.demo}>
        <div style={s.demoTitle}>WHAT YOUR LOG LOOKS LIKE</div>
        <div style={s.demoCards}>
          {DEMO_BREWS.map((entry, i) => (
            <div key={i} style={s.demoCard}>
              <div style={s.demoCardTop}>
                <div style={s.demoCardName}>
                  {entry.type === "brew" ? entry.bean_name : entry.drink_type}
                </div>
                <div style={s.demoCardTime}>
                  {entry.brewed_at || entry.drank_at}
                </div>
              </div>
              <div style={{
                ...s.demoBadge,
                background: entry.type === "brew" ? "#FDF4EC" : "#EFF6FF",
                color: entry.type === "brew" ? CORTADO : "#1D4ED8",
              }}>
                {entry.type === "brew"
                  ? entry.ratioStatus.replace(/_/g, " ").toUpperCase()
                  : "OUTSIDE DRINK"}
              </div>
              {entry.type === "brew" ? (
                <div style={s.demoStats}>
                  <span style={s.demoStat}><b>{entry.dose_in}g</b> in</span>
                  <span style={s.demoStat}><b>{entry.yield_out}g</b> out</span>
                  <span style={s.demoStat}><b>{entry.brew_time}s</b></span>
                  <span style={s.demoStat}><b>{entry.caffeine_mg}mg</b></span>
                </div>
              ) : (
                <div style={s.demoStats}>
                  <span style={s.demoStat}><b>{entry.place_name}</b></span>
                  <span style={s.demoStat}><b>{entry.caffeine_mg}mg</b></span>
                </div>
              )}
              {entry.rating && (
                <div style={{ color: CORTADO, fontSize: 12, marginTop: 6 }}>
                  {"★".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={s.cta}>
        <div style={s.ctaTitle}>Ready to dial in?</div>
        <div style={s.ctaSub}>Free. No credit card. Just coffee.</div>
        <button style={s.btnPrimary} onClick={() => navigate("/login")}>
          Create your account
        </button>
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <div style={s.footerLogo}>GA<span style={{ color: CORTADO }}>B</span>EE</div>
        <div style={s.footerSub}>Built for coffee obsessives.</div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#fff" },
  ticker: { background: "#111", overflow: "hidden", whiteSpace: "nowrap", padding: "8px 0" },
  tickerTrack: { display: "inline-block", animation: "ticker 24s linear infinite" },
  tickerInner: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, color: "#fff", letterSpacing: "0.08em", paddingRight: 32 },
  navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 48px", borderBottom: "1px solid #EBEBEB" },
  logo: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 22, color: "#111" },
  navRight: { display: "flex", gap: 12, alignItems: "center" },
  navLogin: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, color: "#555", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em" },
  navSignup: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 11, color: "#fff", background: "#111", border: "none", borderRadius: 4, padding: "8px 16px", cursor: "pointer", letterSpacing: "0.06em" },
  hero: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, padding: "80px 48px", borderBottom: "1px solid #EBEBEB", maxWidth: 1100, margin: "0 auto" },
  heroLeft: { display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 64 },
  heroTag: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 10, color: "#999", letterSpacing: "0.12em", marginBottom: 16 },
  heroTitle: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 48, color: "#111", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.02em" },
  heroSub: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 32, maxWidth: 420 },
  heroBtns: { display: "flex", gap: 12 },
  heroRight: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FAFAFA", borderRadius: 16, padding: 40 },
  heroMg: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 56, color: "#111", marginTop: 16, lineHeight: 1 },
  heroMgSub: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 10, color: "#999", letterSpacing: "0.1em", marginTop: 6, marginBottom: 10 },
  heroPill: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 10, color: "#15803D", background: "#F0FDF4", padding: "6px 14px", borderRadius: 2, letterSpacing: "0.04em" },
  statsBar: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid #EBEBEB", borderTop: "1px solid #EBEBEB" },
  statItem: { padding: "28px 32px", textAlign: "center" },
  statVal: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 28, color: "#111", marginBottom: 4 },
  statLbl: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 9, color: "#999", letterSpacing: "0.1em" },
  features: { padding: "80px 48px", maxWidth: 1100, margin: "0 auto" },
  featuresTitle: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 11, color: "#999", letterSpacing: "0.12em", marginBottom: 40, textAlign: "center" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  featureCard: { border: "1px solid #EBEBEB", borderRadius: 10, padding: "24px 20px" },
  featureEmoji: { fontSize: 28, marginBottom: 12 },
  featureTitle: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 13, color: "#111", marginBottom: 8 },
  featureDesc: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, fontSize: 11, color: "#666", lineHeight: 1.7 },
  demo: { background: "#FAFAFA", padding: "80px 48px", borderTop: "1px solid #EBEBEB", borderBottom: "1px solid #EBEBEB" },
  demoTitle: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 11, color: "#999", letterSpacing: "0.12em", marginBottom: 32, textAlign: "center" },
  demoCards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 900, margin: "0 auto" },
  demoCard: { background: "#fff", border: "1px solid #EBEBEB", borderRadius: 10, padding: "16px 18px" },
  demoCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  demoCardName: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 12, color: "#111" },
  demoCardTime: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#bbb" },
  demoBadge: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 9, padding: "3px 8px", borderRadius: 2, display: "inline-block", marginBottom: 10, letterSpacing: "0.04em" },
  demoStats: { display: "flex", gap: 10, flexWrap: "wrap" },
  demoStat: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#555" },
  cta: { padding: "100px 48px", textAlign: "center", maxWidth: 600, margin: "0 auto" },
  ctaTitle: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 36, color: "#111", marginBottom: 12, letterSpacing: "-0.02em" },
  ctaSub: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 12, color: "#999", letterSpacing: "0.08em", marginBottom: 32 },
  footer: { borderTop: "1px solid #EBEBEB", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  footerLogo: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 18, color: "#111" },
  footerSub: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, fontSize: 11, color: "#999" },
  btnPrimary: { height: 44, background: CORTADO, color: "#fff", border: "none", borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", cursor: "pointer", padding: "0 28px" },
  btnSecondary: { height: 44, background: "#fff", color: "#111", border: "1px solid #EBEBEB", borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 12, letterSpacing: "0.06em", cursor: "pointer", padding: "0 28px" },
};