import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logBrew } from "../api";

const CORTADO = "#7C3D00";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav style={s.navbar}>
      <div style={s.logo}>GA<span style={{ color: CORTADO }}>B</span>EE</div>
      <div style={s.navLinks}>
        <span style={s.navLink} onClick={() => navigate("/")}>DASHBOARD</span>
        <span style={{ ...s.navLink, ...s.navActive }}>LOG BREW</span>
        <span style={s.navLink} onClick={() => navigate("/log-drink")}>LOG DRINK</span>
        <span style={s.navLink} onClick={() => navigate("/history")}>HISTORY</span>
      </div>
      <span style={s.navTag} onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>LOGOUT</span>
    </nav>
  );
}

export default function LogBrew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    bean_name: "", origin: "", roast_level: "light",
    grind_setting: "", dose_in: "", yield_out: "",
    brew_time: "", rating: 0, notes: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Live ratio calculation
  const ratio = form.dose_in && form.yield_out
    ? (parseFloat(form.yield_out) / parseFloat(form.dose_in)).toFixed(2)
    : null;

  const ratioStatus = ratio
    ? ratio >= 1.8 && ratio <= 2.2 ? "on_target"
    : ratio < 1.8 ? "under_extracted" : "over_extracted"
    : null;

  const ratioColor = ratioStatus === "on_target" ? "#15803D"
    : ratioStatus ? "#D97706" : "#999";

  const ratioMsg = ratioStatus === "on_target" ? `${ratio} — Perfect ratio!`
    : ratioStatus === "under_extracted" ? `${ratio} — Under extracted, try finer grind`
    : ratioStatus === "over_extracted" ? `${ratio} — Over extracted, try coarser grind`
    : "Enter dose and yield to check ratio";

  const handleSubmit = async () => {
    if (!form.dose_in || !form.yield_out) {
      setError("Dose and yield are required"); return;
    }
    setLoading(true); setError("");
    try {
      const res = await logBrew({
        ...form,
        grind_setting: parseFloat(form.grind_setting),
        dose_in: parseFloat(form.dose_in),
        yield_out: parseFloat(form.yield_out),
        brew_time: parseInt(form.brew_time),
        rating: parseInt(form.rating) || null,
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
          <div style={s.successIcon}>☕</div>
          <div style={s.successTitle}>SHOT LOGGED!</div>
          <div style={s.successStat}>~{Math.round(result.caffeine_mg)}mg caffeine</div>
          <div style={{ ...s.successRatio, color: ratioColor }}>
            Ratio {result.ratio} — {result.ratioStatus?.replace("_", " ")}
          </div>
          <div style={s.successMsg}>{result.message}</div>
          <div style={s.successBtns}>
            <button style={s.btnPrimary} onClick={() => navigate("/")}>Back to dashboard</button>
            <button style={s.btnSecondary} onClick={() => { setResult(null); setForm({ bean_name: "", origin: "", roast_level: "light", grind_setting: "", dose_in: "", yield_out: "", brew_time: "", rating: 5, notes: "" }); }}>
              Log another
            </button>
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
          <div style={s.title}>LOG A HOME BREW</div>
          <div style={s.subtitle}>DIAL IN YOUR ESPRESSO SHOT</div>
        </div>

        <div style={s.form}>
          {/* Bean info */}
          <div style={s.section}>BEAN INFO</div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>BEAN NAME</label>
              <input style={s.input} placeholder="e.g. Ethiopia Yirgacheffe"
                value={form.bean_name} onChange={e => set("bean_name", e.target.value)}/>
            </div>
            <div style={s.field}>
              <label style={s.label}>ORIGIN</label>
              <input style={s.input} placeholder="e.g. Ethiopia"
                value={form.origin} onChange={e => set("origin", e.target.value)}/>
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>ROAST LEVEL</label>
            <select style={s.select} value={form.roast_level} onChange={e => set("roast_level", e.target.value)}>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Shot params */}
          <div style={{ ...s.section, marginTop: 24 }}>SHOT PARAMETERS</div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>DOSE IN (g)</label>
              <input style={s.input} placeholder="18" type="number"
                value={form.dose_in} onChange={e => set("dose_in", e.target.value)}/>
            </div>
            <div style={s.field}>
              <label style={s.label}>YIELD OUT (g)</label>
              <input style={s.input} placeholder="36" type="number"
                value={form.yield_out} onChange={e => set("yield_out", e.target.value)}/>
            </div>
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>BREW TIME (s)</label>
              <input style={s.input} placeholder="36" type="number"
                value={form.brew_time} onChange={e => set("brew_time", e.target.value)}/>
            </div>
            <div style={s.field}>
              <label style={s.label}>GRIND SETTING</label>
              <input style={s.input} placeholder="12" type="number"
                value={form.grind_setting} onChange={e => set("grind_setting", e.target.value)}/>
            </div>
          </div>

          {/* Live ratio checker */}
          <div style={{ ...s.ratioBadge, borderColor: ratioColor }}>
            <div style={{ ...s.ratioLabel, color: ratioColor }}>RATIO CHECK</div>
            <div style={{ ...s.ratioMsg, color: ratioColor }}>{ratioMsg}</div>
          </div>

          {/* Notes & rating */}
          <div style={{ ...s.section, marginTop: 24 }}>NOTES & RATING</div>
          <div style={s.field}>
            <label style={s.label}>TASTING NOTES</label>
            <textarea style={s.textarea} placeholder="Floral, blueberry, bright acidity..."
              value={form.notes} onChange={e => set("notes", e.target.value)}/>
          </div>
          <div style={s.field}>
            <label style={s.label}>RATING</label>
            <div style={s.stars}>
            {[1,2,3,4,5].map(n => (
                <span key={n} style={{ ...s.star, color: n <= form.rating ? CORTADO : "#CCC" }}
                    onClick={() => set("rating", n)}>★</span>
                ))}
            </div>
          </div>

          {error && <div style={s.error}>{error}</div>}

          <button style={s.submit} onClick={handleSubmit} disabled={loading}>
            {loading ? "LOGGING..." : "LOG THIS SHOT"}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#fff" },
  navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: "1px solid #EBEBEB" },
  logo: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, color: "#111" },
  navLinks: { display: "flex", gap: 28 },
  navLink: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#555", fontWeight: 600, letterSpacing: "0.06em", cursor: "pointer" },
  navActive: { color: "#111", textDecoration: "underline", textUnderlineOffset: 4 },
  navTag: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, background: "#111", color: "#fff", padding: "4px 12px", borderRadius: 2, cursor: "pointer" },
  main: { maxWidth: 560, margin: "0 auto", padding: "40px 24px" },
  header: { marginBottom: 32 },
  title: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, color: "#111", marginBottom: 4 },
  subtitle: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#999", letterSpacing: "0.1em" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  section: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#999", letterSpacing: "0.1em", borderBottom: "1px solid #EBEBEB", paddingBottom: 8 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: "0.1em" },
  input: { height: 40, border: "1px solid #EBEBEB", borderRadius: 6, padding: "0 12px", fontSize: 14, outline: "none", color: "#111", width: "100%" },
  select: { height: 40, border: "1px solid #EBEBEB", borderRadius: 6, padding: "0 12px", fontSize: 14, outline: "none", color: "#111", background: "#fff" },
  textarea: { border: "1px solid #EBEBEB", borderRadius: 6, padding: "10px 12px", fontSize: 14, outline: "none", color: "#111", resize: "vertical", minHeight: 80, fontFamily: "'DM Sans', sans-serif" },
  ratioBadge: { border: "1px solid", borderRadius: 6, padding: "12px 16px", marginTop: 4 },
  ratioLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", marginBottom: 4 },
  ratioMsg: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 },
  stars: { display: "flex", gap: 6 },
  star: { fontSize: 24, cursor: "pointer" },
  error: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#DC2626", letterSpacing: "0.04em" },
  submit: { height: 44, background: CORTADO, color: "#fff", border: "none", borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.08em", cursor: "pointer", marginTop: 8 },
  successCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "48px 32px", border: "1px solid #EBEBEB", borderRadius: 12, textAlign: "center" },
  successIcon: { fontSize: 40 },
  successTitle: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, color: "#111" },
  successStat: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#999" },
  successRatio: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 },
  successMsg: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#555", fontWeight: 600, letterSpacing: "0.04em" },
  successBtns: { display: "flex", gap: 10, marginTop: 8 },
  btnPrimary: { height: 40, background: CORTADO, color: "#fff", border: "none", borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.06em", cursor: "pointer", padding: "0 20px" },
  btnSecondary: { height: 40, background: "#fff", color: "#111", border: "1px solid #EBEBEB", borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.06em", cursor: "pointer", padding: "0 20px" },
};