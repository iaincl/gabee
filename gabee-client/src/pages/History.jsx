import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBrews, getDrinks } from "../api";

const CORTADO = "#7C3D00";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav style={s.navbar}>
      <div style={s.logo}>GA<span style={{ color: CORTADO }}>B</span>EE</div>
      <div style={s.navLinks}>
        <span style={s.navLink} onClick={() => navigate("/dashboard")}>DASHBOARD</span>
        <span style={s.navLink} onClick={() => navigate("/log-brew")}>LOG BREW</span>
        <span style={s.navLink} onClick={() => navigate("/log-drink")}>LOG DRINK</span>
        <span style={{ ...s.navLink, ...s.navActive }}>HISTORY</span>
      </div>
      <span style={s.navTag} onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>LOGOUT</span>
    </nav>
  );
}

export default function History() {
  const [brews, setBrews] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
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
  }, []);

  const all = [
    ...brews.map(b => ({ ...b, type: "brew" })),
    ...drinks.map(d => ({ ...d, type: "drink" })),
    ].sort((a, b) =>
        new Date((b.brewed_at || b.drank_at).replace(" ", "T") + "Z") -
        new Date((a.brewed_at || a.drank_at).replace(" ", "T") + "Z")
    );

  const filtered = filter === "all" ? all
    : filter === "brew" ? all.filter(e => e.type === "brew")
    : all.filter(e => e.type === "drink");

  // Group by date
  const grouped = filtered.reduce((acc, entry) => {
    const date = new Date(
      (entry.brewed_at || entry.drank_at).replace(" ", "T") + "Z"
    ).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  // Total caffeine per day
  const dailyCaffeine = (entries) =>
    entries.reduce((sum, e) => sum + (e.caffeine_mg || 0), 0);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (d.toDateString() === today) return "TODAY";
    if (d.toDateString() === yesterday) return "YESTERDAY";
    return d.toLocaleDateString("en-AU", { weekday: "short", month: "short", day: "numeric" }).toUpperCase();
  };

  const ratioColor = (status) => {
    if (status === "on_target") return "#15803D";
    if (status === "under_extracted") return "#D97706";
    if (status === "over_extracted") return "#DC2626";
    return "#999";
  };

  if (loading) return (
    <div style={s.loadWrap}>
      <div style={s.loadText}>BREWING...</div>
    </div>
  );

  return (
    <div style={s.page}>
      <Navbar />

      <div style={s.main}>
        <div style={s.header}>
          <div style={s.title}>HISTORY</div>
          <div style={s.subtitle}>{all.length} ENTRIES TOTAL</div>
        </div>

        {/* Stats bar */}
        <div style={s.statsBar}>
          <div style={s.statItem}>
            <div style={s.statVal}>{brews.length}</div>
            <div style={s.statLbl}>HOME BREWS</div>
          </div>
          <div style={{ ...s.statItem, borderLeft: "1px solid #EBEBEB", borderRight: "1px solid #EBEBEB" }}>
            <div style={s.statVal}>{drinks.length}</div>
            <div style={s.statLbl}>OUTSIDE DRINKS</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statVal}>
              {Math.round(all.reduce((s, e) => s + (e.caffeine_mg || 0), 0) / (Object.keys(grouped).length || 1))}
            </div>
            <div style={s.statLbl}>AVG MG / DAY</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={s.filters}>
          {["all", "brew", "drink"].map(f => (
            <button
              key={f}
              style={{
                ...s.filterBtn,
                background: filter === f ? "#111" : "#fff",
                color: filter === f ? "#fff" : "#555",
                borderColor: filter === f ? "#111" : "#EBEBEB",
              }}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "ALL" : f === "brew" ? "HOME BREWS" : "OUTSIDE DRINKS"}
            </button>
          ))}
        </div>

        {/* Grouped entries */}
        {Object.keys(grouped).length === 0 && (
          <div style={s.empty}>
            No entries yet.{" "}
            <span style={{ color: CORTADO, cursor: "pointer" }} onClick={() => navigate("/log-brew")}>
              Log your first shot →
            </span>
          </div>
        )}

        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date} style={s.dayGroup}>
            {/* Day header */}
            <div style={s.dayHeader}>
              <div style={s.dayLabel}>{formatDate(date)}</div>
              <div style={s.dayCaffeine}>
                {Math.round(dailyCaffeine(entries))}mg total
              </div>
            </div>

            {/* Cards */}
            <div style={s.cards}>
              {entries.map((entry, i) => (
                <div key={i} style={s.card}>
                  {entry.type === "brew" ? (
                    <>
                      <div style={s.cardTop}>
                        <div>
                          <div style={s.cardTitle}>{entry.bean_name || "Home brew"}</div>
                          {entry.origin && (
                            <div style={s.cardSub}>{entry.origin} · {entry.roast_level} roast</div>
                          )}
                        </div>
                        <div style={s.cardTime}>
                        {new Date(entry.brewed_at.replace(" ", "T") + "Z").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>

                      <div style={s.cardBadge}>
                        <span style={{
                          ...s.badge,
                          background: "#FDF4EC",
                          color: ratioColor(entry.ratioStatus),
                          borderColor: ratioColor(entry.ratioStatus),
                        }}>
                          {entry.ratioStatus?.replace(/_/g, " ").toUpperCase() || "HOME BREW"}
                        </span>
                        <span style={{ ...s.badge, background: "#F3F4F6", color: "#555", borderColor: "#EBEBEB" }}>
                          ☕ HOME BREW
                        </span>
                      </div>

                      <div style={s.shotStats}>
                        <div style={s.shotStat}>
                          <div style={s.shotStatVal}>{entry.dose_in}g</div>
                          <div style={s.shotStatLbl}>IN</div>
                        </div>
                        <div style={s.shotDivider}>→</div>
                        <div style={s.shotStat}>
                          <div style={s.shotStatVal}>{entry.yield_out}g</div>
                          <div style={s.shotStatLbl}>OUT</div>
                        </div>
                        <div style={s.shotDivider}>·</div>
                        <div style={s.shotStat}>
                          <div style={s.shotStatVal}>{entry.brew_time}s</div>
                          <div style={s.shotStatLbl}>TIME</div>
                        </div>
                        <div style={s.shotDivider}>·</div>
                        <div style={s.shotStat}>
                          <div style={s.shotStatVal}>{entry.grind_setting}</div>
                          <div style={s.shotStatLbl}>GRIND</div>
                        </div>
                        <div style={s.shotDivider}>·</div>
                        <div style={s.shotStat}>
                          <div style={s.shotStatVal}>{Math.round(entry.caffeine_mg)}mg</div>
                          <div style={s.shotStatLbl}>CAFFEINE</div>
                        </div>
                      </div>

                      {entry.notes && (
                        <div style={s.notes}>"{entry.notes}"</div>
                      )}

                      {entry.rating > 0 && (
                        <div style={s.stars}>
                          {"★".repeat(entry.rating)}
                          <span style={{ color: "#DDD" }}>{"★".repeat(5 - entry.rating)}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div style={s.cardTop}>
                        <div>
                          <div style={s.cardTitle}>
                            {entry.drink_type?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                          </div>
                          {entry.place_name && (
                            <div style={s.cardSub}>{entry.place_name}</div>
                          )}
                        </div>
                        <div style={s.cardTime}>
                        {new Date(entry.drank_at.replace(" ", "T") + "Z").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}                        </div>
                      </div>

                      <div style={s.cardBadge}>
                        <span style={{ ...s.badge, background: "#EFF6FF", color: "#1D4ED8", borderColor: "#DBEAFE" }}>
                          🏃 OUTSIDE
                        </span>
                        <span style={{ ...s.badge, background: "#F3F4F6", color: "#555", borderColor: "#EBEBEB" }}>
                          {entry.drink_size?.toUpperCase()}
                        </span>
                      </div>

                      <div style={s.drinkCaffeine}>
                        {Math.round(entry.caffeine_mg)}mg caffeine
                      </div>

                      {entry.notes && (
                        <div style={s.notes}>"{entry.notes}"</div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
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
  main: { maxWidth: 640, margin: "0 auto", padding: "40px 24px" },
  header: { marginBottom: 24 },
  title: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 28, color: "#111", marginBottom: 4 },
  subtitle: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11, color: "#999", letterSpacing: "0.1em" },
  statsBar: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "1px solid #EBEBEB", borderRadius: 8, overflow: "hidden", marginBottom: 24 },
  statItem: { padding: "16px 20px", textAlign: "center" },
  statVal: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 24, color: "#111" },
  statLbl: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 9, color: "#999", letterSpacing: "0.08em", marginTop: 4 },
  filters: { display: "flex", gap: 8, marginBottom: 28 },
  filterBtn: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 10, letterSpacing: "0.06em", padding: "7px 14px", border: "1px solid", borderRadius: 99, cursor: "pointer", transition: "all 0.15s" },
  dayGroup: { marginBottom: 32 },
  dayHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #EBEBEB" },
  dayLabel: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 12, color: "#111", letterSpacing: "0.06em" },
  dayCaffeine: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 10, color: "#999", letterSpacing: "0.06em" },
  cards: { display: "flex", flexDirection: "column", gap: 10 },
  card: { border: "1px solid #EBEBEB", borderRadius: 10, padding: "16px 18px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  cardTitle: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 13, color: "#111", marginBottom: 2 },
  cardSub: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, fontSize: 10, color: "#888" },
  cardTime: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, fontSize: 10, color: "#bbb" },
  cardBadge: { display: "flex", gap: 6, marginBottom: 12 },
  badge: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 9, padding: "3px 8px", borderRadius: 99, border: "1px solid", letterSpacing: "0.04em" },
  shotStats: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 },
  shotStat: { textAlign: "center" },
  shotStatVal: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 13, color: "#111" },
  shotStatLbl: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 8, color: "#999", letterSpacing: "0.08em" },
  shotDivider: { color: "#DDD", fontSize: 12 },
  drinkCaffeine: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 13, color: "#111", marginBottom: 8 },
  notes: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, fontSize: 11, color: "#888", fontStyle: "italic", marginBottom: 8 },
  stars: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: CORTADO },
  empty: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 12, color: "#999", letterSpacing: "0.06em" },
};