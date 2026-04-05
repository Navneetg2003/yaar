import { useAuth } from "../hooks/useAuth.js";
import { greetingByTime, formatDate } from "../utils/formatMessage";

export default function Navbar({ onMoodClick }) {
  const { user } = useAuth();
  const name    = user?.email?.split("@")[0] || "yaar";
  const initial = name.charAt(0).toUpperCase();
  const today   = formatDate(new Date().toISOString());

  return (
    <nav className="navbar">

      {/* Left: Date */}
      <div className="navbar-left">
        <span className="date-pill">{today}</span>
      </div>

      {/* Center: Logo — absolute so it's always perfectly centered */}
      <div className="nav-wordmark">YAAR<span>·</span></div>

      {/* Right: Greeting + Bell + Avatar */}
      <div className="navbar-right">
        <span className="nav-greeting">{greetingByTime()}, {name}</span>
        <button onClick={onMoodClick} className="bell-btn" aria-label="Log mood">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
        <div className="nav-avatar" title={name}>{initial}</div>
      </div>

    </nav>
  );
}