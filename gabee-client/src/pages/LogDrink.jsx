import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logDrink } from "../api";

const CORTADO = "#7C3D00";

const DRINKS = [
  { key: "iced_americano", emoji: "☕", label: "Iced\nAmericano" },
  { key: "flat_white",     emoji: "🥛", label: "Flat\nWhite" },
  { key: "latte",          emoji: "☁️", label: "Latte" },
  { key: "cappuccino",     emoji: "🫧", label: "Cappuccino" },
  { key: "espresso",       emoji: "⚡", label: "Espresso" },
  { key: "cold_brew",      emoji: "🧊", label: "Cold\nBrew" },
  { key: "matcha_latte",   emoji: "🍵", label: "Matcha\nLatte" },
  { key: "drip_coffee",    emoji: "☕", label: "Drip\nCoffee" },
  { key: "energy_drink",   emoji: "🔋", label: "Energy\nDrink" },
  { key: "green_tea",      emoji: "🍃", label: "Green\nTea" },
  { key: "black_tea",      emoji: "🫖", label: "Black\nTea" },
  { key: "americano",      emoji: "🖤", label: "Americano" },
];

const CAFFEINE_MAP = {
  espresso:       { small: 63,  medium: 63,  large: 126 },
  flat_white:     { small: 130, medium: 130, large: 180 },
  latte:          { small: 63,  medium: 126, large: 189 },
  cappuccino:     { small: 63,  medium: 126, large: 189 },
  iced_americano: { small: 63,  medium: 126, large: 189 },
  americano:      { small: 63,  medium: 126, large: 189 },
  drip_coffee:    { small: 95,  medium: 165, large: 240 },
  cold_brew:      { small: 100, medium: 200, large: 300 },
  matcha_latte:   { small: 35,  medium: 70,  large: 105 },
  energy_drink:   { small: 80,  medium: 160, large: 240 },
  green_tea:      { small: 28,  medium: 45,  large: 60  },
  black_tea:      { small: 47,  medium: 75,  large: 100 },
};

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav style={s.navbar}>
      <div style={s.logo}>GA<span style={{ color: CORTADO }}>B</span>EE</div>
      <div style={s.navLinks}>
        <span style={s.navLink} onClick={() => navigate("/")}>DASHBOARD</span>
        <span style={s.navLink} onClick={() => navigate("/log-brew")}>LOG BREW</span>
        <span style={{ ...s.navLink, ...s.navActive }}>LOG DRINK</span>
        <span style={s.navLink} onClick={() => navigate("/history")}>HISTORY</span>
      </div>
      <span style={s.navTag} onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>LOGOUT</span>
    </nav>
  );
}

export default function LogDrink() {
  const navigate = useNavigate();
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [size, setSize] = useState("medium");
  const [place, setPlace] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const estimatedCaffeine = selectedDrink
    ? CAFFEINE_MAP[selectedDrink]?.[size] ?? null
    : null;

  const handleSubmit = async () => {
    if (!selectedDrink) { setError("Please select a drink"); return; }
    setLoading(true); setError("");
    try {
      const res = await logDrink({
        drink_type: selectedDrink,
        drink_size: size,
        place_name: place,
        notes,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (result) return (
    <div style={s.page}>
      <Navbar />
      <div style={s.main}>
        <div style={s.successCard}>
          <div style={s.successEmoji}>
            {DRINKS.find(d => d.key === selectedDrink)?.emoji}
          </div>
          <div style={s.successTitle}>DRINK LOGGED!</div>
          <div style={s.successStat}>~{result.caffeine_mg}mg caffeine added</div>
          <div style={s.successMsg}>{result.message}</div>
          <div style={s.successBtns}>
            <button style={s.btnPrimary} onClick={() => navigate("/")}>Back to dashboard</button>
            <button style={s.btnSecondary} onClick={() => {
              setResult(null); setSelectedDrink(null);
              setSize("medium"); setPlace(""); setNotes("");
            }}>Log another</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.main}>
        <div style={s.header}>
          <div style={s.title}>LOG A DRINK</div>
          <div style={s.subtitle}>WHAT ARE YOU HAVING?</div>
        </div>

        {/* Drink grid */}
        <div style={s.grid}>
          {DRINKS.map(d => (
            <div
              key={d.key}
              style={{
                ...s.drinkCard,
                borderColor: selectedDrink === d.key ? CORTADO : "#EBEBEB",
                borderWidth: selectedDrink === d.key ? 2 : 1,
                background: selectedDrink === d.key ? "#FDF4EC" : "#fff",
              }}
              onClick={() => setSelectedDrink(d.key)}
            >
              <div style={s.drinkEmoji}>{d.emoji}</div>
              <div style={{
                ...s.drinkLabel,
                color: selectedDrink === d.key ? CORTADO : "#555",
              }}>
                {d.label}
              </div>
            </div>
          ))}
        </div>

        {/* Size */}
        <div style={s.section}>SIZE</div>
        <div style={s.sizeRow}>
          {["small", "medium", "large"].map(sz => (
            <button
              key={sz}
              style={{
                ...s.sizeBtn,
                borderColor: size === sz ? CORTADO : "#EBEBEB",
                color: size === sz ? CORTADO : "#555",
                background: size === sz ? "#FDF4EC" : "#fff",
                fontWeight: size === sz ? 700 : 600,
              }}
              onClick={() => setSize(sz)}
            >
              {sz.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Caffeine estimate */}
        {estimatedCaffeine && (
          <div style={s.caffeineBadge}>
            ~{estimatedCaffeine}mg caffeine estimated
          </div>
        )}

        {/* Place */}
        <div style={s.section}>WHERE?</div>
        <input
          style={s.input}
          placeholder="Ona Coffee, office, 7-Eleven..."
          value={place}
          onChange={e => setPlace(e.target.value)}
        />

        {/* Notes */}
        <div style={s.section}>NOTES (OPTIONAL)</div>
        <input
          style={s.input}
          placeholder="Good vibe, bad espresso..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        {error && <div style={s.error}>{error}</div>}

        <button style={s.submit} onClick={handleSubmit} disabled={loading}>
          {loading ? "LOGGING..." : "LOG THIS DRINK"}
        </button>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#fff" },
  navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: "1px solid #EBEBEB" },
  logo: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 22, color: "#111" },
  navLinks: { display: "flex", gap: 28 },
  navLink: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, color: "#555", letterSpacing: "0.06em", cursor: "pointer" },
  navActive: { color: "#111", textDecoration: "underline", textUnderlineOffset: 4 },
  navTag: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, background: "#111", color: "#fff", padding: "4px 12px", borderRadius: 2, cursor: "pointer" },
  main: { maxWidth: 560, margin: "0 auto", padding: "40px 24px" },
  header: { marginBottom: 24 },
  title: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 22, color: "#111", marginBottom: 4 },
  subtitle: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 10, color: "#999", letterSpacing: "0.1em" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 },
  drinkCard: { border: "1px solid", borderRadius: 10, padding: "14px 8px", textAlign: "center", cursor: "pointer", transition: "all 0.15s" },
  drinkEmoji: { fontSize: 24, marginBottom: 6 },
  drinkLabel: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 9, letterSpacing: "0.04em", whiteSpace: "pre-line", lineHeight: 1.4 },
  section: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 10, color: "#444", letterSpacing: "0.1em", borderBottom: "1px solid #EBEBEB", paddingBottom: 8, marginBottom: 12 },
  sizeRow: { display: "flex", gap: 10, marginBottom: 16 },
  sizeBtn: { flex: 1, height: 40, border: "1.5px solid", borderRadius: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.06em", cursor: "pointer", transition: "all 0.15s" },
  caffeineBadge: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 11, color: "#15803D", background: "#F0FDF4", padding: "10px 14px", borderRadius: 6, marginBottom: 20 },
  input: { width: "100%", height: 40, border: "1px solid #EBEBEB", borderRadius: 6, padding: "0 12px", fontSize: 14, outline: "none", color: "#111", marginBottom: 20, fontFamily: "'IBM Plex Mono', monospace" },
  error: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#DC2626", letterSpacing: "0.04em", marginBottom: 8 },
  submit: { width: "100%", height: 44, background: CORTADO, color: "#fff", border: "none", borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", cursor: "pointer" },
  successCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "48px 32px", border: "1px solid #EBEBEB", borderRadius: 12, textAlign: "center" },
  successEmoji: { fontSize: 48 },
  successTitle: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 20, color: "#111" },
  successStat: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 13, color: "#555" },
  successMsg: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#999" },
  successBtns: { display: "flex", gap: 10, marginTop: 8 },
  btnPrimary: { height: 40, background: CORTADO, color: "#fff", border: "none", borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 11, letterSpacing: "0.06em", cursor: "pointer", padding: "0 20px" },
  btnSecondary: { height: 40, background: "#fff", color: "#111", border: "1px solid #EBEBEB", borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", cursor: "pointer", padding: "0 20px" },
};