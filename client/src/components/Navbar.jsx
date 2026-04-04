import { useAuth } from "../hooks/useAuth";
import { greetingByTime, formatDate } from "../utils/formatMessage";

export default function Navbar({ onMoodClick }) {
  const { user } = useAuth();
  const name     = user?.email?.split("@")[0] || "yaar";
  const greeting = `${greetingByTime()}, ${name}`;
  const today    = formatDate(new Date().toISOString());

  return (
    <nav className="navbar">
      <div className="flex items-center gap-3">
        <div className="nav-avatar">{name[0]?.toUpperCase()}</div>
        <span className="nav-greeting">{greeting}</span>
      </div>

      <div className="nav-wordmark">YAAR<span>·</span></div>

      <div className="flex items-center gap-2">
        <span className="date-pill">{today}</span>
        <button onClick={onMoodClick} className="bell-btn" title="Log your mood">
          🔔
        </button>
      </div>
    </nav>
  );
}