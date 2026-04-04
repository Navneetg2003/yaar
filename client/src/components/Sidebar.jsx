import { useAuth } from "../hooks/useAuth";

const NAV = [
  { id: "chat",    icon: "💬", label: "yaar bot"  },
  { id: "journal", icon: "📓", label: "my journal" },
  { id: "mood",    icon: "🎭", label: "how i feel" },
];

export default function Sidebar({ active, onChange }) {
  const { user, logout } = useAuth();
  const initials = user?.email ? user.email[0].toUpperCase() : "Y";

  return (
    <aside className="sidebar">
      <div className="sidebar-aurora" />

      <div className="px-5 mb-6">
        <span className="sidebar-wordmark">YAAR</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2">
        {NAV.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`nav-item ${active === item.id ? "active" : ""}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {active === item.id && <span className="nav-active-dot" />}
          </button>
        ))}
      </nav>

      <div className="px-4 pb-2 flex items-center gap-3">
        <div className="avatar-sm">{initials}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
            {user?.email || "guest"}
          </p>
        </div>
        <button
          onClick={logout}
          style={{ color: "var(--text-muted)", opacity: 0.5, background: "transparent", border: "none", cursor: "pointer", fontSize: 14 }}
          title="Sign out"
        >
          ↩
        </button>
      </div>
    </aside>
  );
}