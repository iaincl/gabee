import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const fn = isRegister ? register : login;
      const res = await fn(email, password);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          GA<span style={{ color: "#7C3D00" }}>B</span>EE
        </div>
        <div style={styles.sub}>Your personal coffee diary</div>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : isRegister ? "Create account" : "Sign in"}
        </button>

        <div style={styles.toggle}>
          {isRegister ? "Already have an account?" : "No account?"}{" "}
          <span
            style={styles.link}
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
          >
            {isRegister ? "Sign in" : "Create one"}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
  },
  card: {
    width: 360,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  // change logo style
logo: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 700,
    fontSize: 28,
    color: "#111",
    marginBottom: 4,
  },
  sub: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    fontSize: 11,
    color: "#555",
    letterSpacing: "0.08em",
    marginBottom: 16,
  },
  btn: {
    height: 42,
    background: "#7C3D00",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 14,
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.04em",
    marginTop: 4,
  },
  input: {
    width: "100%",
    height: 42,
    border: "1px solid #EBEBEB",
    borderRadius: 6,
    padding: "0 14px",
    fontSize: 14,
    outline: "none",
    color: "#111",
  },
  error: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: "#DC2626",
    letterSpacing: "0.04em",
  },
  btn: {
    height: 42,
    background: "#7C3D00",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 14,
    fontFamily: "'IBM Plex Mono', monospace",
    cursor: "pointer",
    letterSpacing: "0.04em",
    marginTop: 4,
  },
  toggle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: "#999",
    textAlign: "center",
    letterSpacing: "0.04em",
  },
  link: {
    color: "#7C3D00",
    cursor: "pointer",
  },
};