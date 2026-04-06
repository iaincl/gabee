import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBrews, getDrinks } from "../api";

const LIMIT = 400;
const CORTADO = "#7C3D00";
function IcedCup({ pct }) {
    const [displayPct, setDisplayPct] = useState(0);
    const CUP_TOP = 32, CUP_BOTTOM = 188, CH = CUP_BOTTOM - CUP_TOP;
    const liquidY = Math.round(CUP_BOTTOM - Math.min(displayPct, 1) * CH);
    const liquidH = Math.round(Math.min(displayPct, 1) * CH);
    const showIce = displayPct > 0.15;
    const showFoam = displayPct > 0.05;
  
    const liquidColor = displayPct >= 1 ? "#3B0000"
      : displayPct >= 0.75 ? "#4A1500" : "#5C2E00";
  
    const getCups = (pct) => {
      const mg = Math.round(pct * 400);
      const cups = mg / 95;
      if (mg === 0) return { label: "0 cups", sub: "no caffeine yet" };
      if (cups < 1.5) return { label: "1 cup", sub: `~${mg}mg` };
      if (cups < 2.5) return { label: "2 cups", sub: `~${mg}mg` };
      if (cups < 3.5) return { label: "3 cups", sub: `~${mg}mg` };
      if (cups < 4.5) return { label: "4 cups", sub: `~${mg}mg` };
      return { label: "4+ cups", sub: `~${mg}mg — limit!` };
    };
  
    useEffect(() => {
      if (pct === 0) { setDisplayPct(0); return; }
      const steps = 80;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const eased = 1 - Math.pow(1 - step / steps, 3);
        setDisplayPct(eased * pct);
        if (step >= steps) { setDisplayPct(pct); clearInterval(timer); }
      }, 1000 / steps);
      return () => clearInterval(timer);
    }, [pct]);
  
    const cups = getCups(pct);
  
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <svg width="180" height="200" viewBox="0 0 180 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="cupClip">
              <path d="M44,32 L38,180 Q38,188 46,188 L126,188 Q134,188 134,180 L128,32 Z"/>
            </clipPath>
          </defs>
          <path d="M44,32 L38,180 Q38,188 46,188 L126,188 Q134,188 134,180 L128,32 Z" fill="#fff"/>
          <g clipPath="url(#cupClip)">
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
          <rect x="94" y="10" width="6" height="100" rx="3" fill={CORTADO} opacity="0.85"/>
          <path d="M134,72 Q158,72 158,110 Q158,140 134,140" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
          <g fill="#111" opacity="0.07">
            <ellipse cx="42" cy="95" rx="2" ry="3.5"/>
            <ellipse cx="132" cy="118" rx="1.5" ry="2.5"/>
            <ellipse cx="40" cy="140" rx="1.5" ry="2.5"/>
          </g>
        </svg>
  
        {/* Cup counter label */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: 13,
          color: displayPct >= 1 ? "#DC2626" : displayPct >= 0.75 ? "#D97706" : "#111",
          marginTop: 8,
          letterSpacing: "0.04em",
        }}>
          {cups.label}
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: 10,
          color: "#999",
          letterSpacing: "0.06em",
          marginTop: 2,
        }}>
          {cups.sub}
        </div>
      </div>
    );
  }
  
function Navbar({ onLogout }) {
  const navigate = useNavigate();
  return (
    <nav style={s.navbar}>
      <div style={s.logo}>GA<span style={{ color: CORTADO }}>B</span>EE</div>
      <div style={s.navLinks}>
        <span style={{ ...s.navLink, ...s.navActive }}>DASHBOARD</span>
        <span style={s.navLink} onClick={() => navigate("/log-brew")}>LOG BREW</span>
        <span style={s.navLink} onClick={() => navigate("/log-drink")}>LOG DRINK</span>
        <span style={s.navLink} onClick={() => navigate("/history")}>HISTORY</span>
      </div>
      <span style={s.navTag} onClick={onLogout}>LOGOUT</span>
    </nav>
  );
}

function getStatus(pct) {
  if (pct === 0) return { msg: "NO CAFFEINE YET — TIME FOR A SHOT", bg: "#F3F4F6", color: "#6B7280" };
  if (pct < 0.25) return { msg: "JUST GETTING STARTED", bg: "#F0FDF4", color: "#15803D" };
  if (pct < 0.5) return { msg: "LOOKING GOOD — ROOM FOR MORE", bg: "#F0FDF4", color: "#15803D" };
  if (pct < 0.75) return { msg: "HALF WAY — SIP MINDFULLY", bg: "#FEF3C7", color: "#D97706" };
  if (pct < 1) return { msg: "ALMOST AT YOUR LIMIT", bg: "#FEF3C7", color: "#D97706" };
  return { msg: "DAILY LIMIT REACHED", bg: "#FEE2E2", color: "#DC2626" };
}

// Toast notification component — nicer than browser alert()
function Toast({ msg, color, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 999,
      background: "#111", color: "#fff", borderRadius: 8,
      padding: "14px 20px", maxWidth: 320,
      fontFamily: "'IBM Plex Mono', monospace",
      fontWeight: 600, fontSize: 12, letterSpacing: "0.04em",
      borderLeft: `4px solid ${color}`,
      boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
    }}>
      <span>{msg}</span>
      <span style={{ cursor: "pointer", opacity: 0.5, fontSize: 16 }} onClick={onClose}>×</span>
    </div>
  );
}

export default function Dashboard() {
  const [brews, setBrews] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [alertedThreshold, setAlertedThreshold] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [brewRes, drinkRes] = await Promise.all([getBrews(), getDrinks()]);
        setBrews(brewRes.data);
        setDrinks(drinkRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const today = new Date().toDateString();

  const todayBrews = brews.filter(b => {
    if (!b.brewed_at) return false;
    // Append Z to tell JS this is UTC — it auto converts to your local timezone
    return new Date(b.brewed_at.replace(" ", "T") + "Z").toDateString() === today;
  });
  
  const todayDrinks = drinks.filter(d => {
    if (!d.drank_at) return false;
    return new Date(d.drank_at.replace(" ", "T") + "Z").toDateString() === today;
  });

  const totalCaffeine = [
    ...todayBrews.map(b => b.caffeine_mg || 0),
    ...todayDrinks.map(d => d.caffeine_mg || 0),
  ].reduce((a, b) => a + b, 0);

  const pct = totalCaffeine / LIMIT;
  const status = getStatus(pct);
  const remaining = Math.max(0, LIMIT - totalCaffeine);

  const allToday = [
    ...todayBrews.map(b => ({ ...b, type: "brew" })),
    ...todayDrinks.map(d => ({ ...d, type: "drink" })),
  ].sort((a, b) => new Date(b.brewed_at || b.drank_at) - new Date(a.brewed_at || a.drank_at));

  // Caffeine threshold alerts — only fires once per threshold
  useEffect(() => {
    if (totalCaffeine === 0) return;
    if (pct >= 1 && alertedThreshold !== "limit") {
      setToast({ msg: "🚨 Daily limit reached! That's 400mg today. Time for water.", color: "#DC2626" });
      setAlertedThreshold("limit");
    } else if (pct >= 0.75 && pct < 1 && alertedThreshold !== "warning") {
      setToast({ msg: "⚠️ You're at 75% of your daily limit. One more shot max!", color: "#D97706" });
      setAlertedThreshold("warning");
    }
  }, [totalCaffeine]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "GOOD MORNING";
    if (h < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  };

  if (loading) return (
    <div style={s.loadWrap}>
      <div style={s.loadText}>BREWING...</div>
    </div>
  );

  return (
    <div style={s.page}>
      {toast && (
        <Toast
          msg={toast.msg}
          color={toast.color}
          onClose={() => setToast(null)}
        />
      )}

      <Navbar onLogout={handleLogout} />

      <div style={s.ticker}>
        <div style={s.tickerTrack}>
          {[1, 2].map(i => (
            <span key={i} style={s.tickerInner}>
              GABEE — YOUR COFFEE DIARY &nbsp;•&nbsp; TODAY: {Math.round(totalCaffeine)}MG CAFFEINE &nbsp;•&nbsp; {allToday.length} DRINKS LOGGED &nbsp;•&nbsp; {Math.round(remaining)}MG REMAINING &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div style={s.main}>
        <div style={s.greeting}>{greeting()}</div>

        <IcedCup pct={pct} />

        <div style={s.mgNumber}>{Math.round(totalCaffeine)}</div>
        <div style={s.mgSub}>MG CAFFEINE · {LIMIT}MG DAILY LIMIT</div>
        <div style={{ ...s.pill, background: status.bg, color: status.color }}>
          {status.msg}
        </div>

        <div style={s.metrics}>
          <div style={s.metric}>
            <div style={s.metricVal}>{allToday.length}</div>
            <div style={s.metricLbl}>DRINKS TODAY</div>
          </div>
          <div style={{ ...s.metric, borderLeft: "1px solid #EBEBEB", borderRight: "1px solid #EBEBEB" }}>
            <div style={s.metricVal}>{Math.round(remaining)}</div>
            <div style={s.metricLbl}>MG REMAINING</div>
          </div>
          <div style={s.metric}>
            <div style={s.metricVal}>{Math.round(pct * 100)}%</div>
            <div style={s.metricLbl}>LIMIT USED</div>
          </div>
        </div>

        {allToday.length > 0 && (
          <>
            <div style={s.sectionTitle}>TODAY'S LOG</div>
            <div style={s.cards}>
              {allToday.map((entry, i) => (
                <div key={i} style={s.card}>
                  <div style={s.cardBean}>
                    {entry.type === "brew" ? entry.bean_name || "Home brew" : entry.drink_type?.replace(/_/g, " ").toUpperCase()}
                  </div>
                  <div style={s.cardTime}>
                    {new Date(entry.brewed_at || entry.drank_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div style={{
                    ...s.badge,
                    background: entry.type === "brew" ? "#FDF4EC" : "#F3F4F6",
                    color: entry.type === "brew" ? CORTADO : "#6B7280",
                  }}>
                    {entry.type === "brew" ? entry.ratioStatus?.toUpperCase().replace(/_/g, " ") || "HOME BREW" : "OUTSIDE DRINK"}
                  </div>
                  <div style={s.cardStats}>
                    {entry.type === "brew" ? (
                      <>
                        <span style={s.stat}><b>{entry.dose_in}g</b> in</span>
                        <span style={s.stat}><b>{entry.yield_out}g</b> out</span>
                        <span style={s.stat}><b>{entry.brew_time}s</b></span>
                      </>
                    ) : (
                      <span style={s.stat}><b>{entry.place_name}</b></span>
                    )}
                    <span style={s.stat}><b>{Math.round(entry.caffeine_mg)}mg</b></span>
                  </div>
                  {entry.rating > 0 && (
                    <div style={{ color: CORTADO, fontSize: 12, marginTop: 6 }}>
                      {"★".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {allToday.length === 0 && (
          <div style={s.empty}>
            No drinks logged today yet.{" "}
            <span style={{ color: CORTADO, cursor: "pointer" }} onClick={() => navigate("/log-brew")}>
              Log your first shot →
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#fff" },
  loadWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" },
  loadText: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 14, color: "#555", letterSpacing: "0.1em" },
  navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: "1px solid #EBEBEB" },
  logo: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 22, color: "#111" },
  navLinks: { display: "flex", gap: 28 },
  navLink: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, color: "#555", letterSpacing: "0.06em", cursor: "pointer" },
  navActive: { color: "#111", textDecoration: "underline", textUnderlineOffset: 4 },
  navTag: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, background: "#111", color: "#fff", padding: "4px 12px", borderRadius: 2, cursor: "pointer" },
  ticker: { background: "#111", overflow: "hidden", whiteSpace: "nowrap", padding: "8px 0" },
  tickerTrack: { display: "inline-block", animation: "ticker 20s linear infinite" },
  tickerInner: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, color: "#fff", letterSpacing: "0.08em", paddingRight: 32 },
  main: { display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 32px 48px" },
  greeting: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 12, color: "#333", letterSpacing: "0.1em", marginBottom: 20 },
  mgNumber: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 64, color: "#111", letterSpacing: "-0.02em", marginTop: 16, lineHeight: 1 },
  mgSub: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, color: "#444", letterSpacing: "0.08em", marginTop: 8, marginBottom: 12 },
  pill: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, padding: "6px 18px", borderRadius: 2, letterSpacing: "0.06em", marginBottom: 32 },
  metrics: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", width: "100%", maxWidth: 420, border: "1px solid #EBEBEB", borderRadius: 8, overflow: "hidden", marginBottom: 32 },
  metric: { padding: "16px 20px", textAlign: "center", background: "#fff" },
  metricVal: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 28, color: "#111" },
  metricLbl: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 10, color: "#444", letterSpacing: "0.08em", marginTop: 4 },
  sectionTitle: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, color: "#444", letterSpacing: "0.1em", width: "100%", maxWidth: 480, marginBottom: 12 },
  cards: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 480 },
  card: { border: "1px solid #EBEBEB", borderRadius: 8, padding: "14px 16px", background: "#fff" },
  cardBean: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 12, color: "#111", marginBottom: 2 },
  cardTime: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, fontSize: 10, color: "#888", marginBottom: 8 },
  badge: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 9, padding: "2px 8px", borderRadius: 2, display: "inline-block", marginBottom: 8, letterSpacing: "0.04em" },
  cardStats: { display: "flex", gap: 10, flexWrap: "wrap" },
  stat: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, fontSize: 10, color: "#555" },
  empty: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 12, color: "#444", letterSpacing: "0.06em", marginTop: 16 },
};