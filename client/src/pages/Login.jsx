import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, register, loginAnonymous } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]         = useState("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      mode === "login" ? await login(email, password) : await register(email, password);
      navigate(localStorage.getItem("yaar_onboarded") ? "/dashboard" : "/onboarding");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function handleAnonymous() {
    setError(""); setLoading(true);
    try {
      await loginAnonymous();
      navigate("/onboarding");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <div className="orb orb-1" /><div className="orb orb-2" />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">Y</div>
          <h1 className="auth-logo-title">YAAR</h1>
          <p className="auth-logo-sub">your friend. always here.</p>
        </div>

        <div className="auth-tabs">
          {["login", "register"].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              className={`auth-tab ${mode === m ? "auth-tab-active" : ""}`}>
              {m === "login" ? "login" : "sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" placeholder="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
          <input type="password" placeholder="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required minLength={6} className="auth-input" />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={loading} className="auth-btn-primary">
            {loading ? "please wait…" : mode === "login" ? "come in →" : "create account →"}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button onClick={handleAnonymous} disabled={loading} className="auth-btn-ghost">
          try without signing up
        </button>

        <p className="auth-disclaimer">
          yaar is an AI companion, not a therapist.<br/>
          for emergencies, call iCall: 9152987821
        </p>
      </div>
    </div>
  );
}