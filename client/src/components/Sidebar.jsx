import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

const NAV = [
  {
    id: "chat",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        {active && <><circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"/></>}
      </svg>
    ),
    label: "yaar bot",
    sublabel: "chat",
  },
  {
    id: "journal",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        {active && <><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="13" y2="13"/></>}
      </svg>
    ),
    label: "my journal",
    sublabel: "write",
  },
  {
    id: "mood",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d={active ? "M8 14s1.5 2 4 2 4-2 4-2" : "M8 14s1.5 1 4 1 4-1 4-1"}/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    label: "how i feel",
    sublabel: "mood",
  },
];

export default function Sidebar({ active, onChange }) {
  const { user, logout } = useAuth();
  const [hoveredId, setHoveredId]   = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  const initials = user?.email ? user.email[0].toUpperCase() : "Y";
  const username = user?.email?.split("@")[0] || "guest";

  return (
    <aside className="sb">
      <div className="sb-aurora" />
      <div className="sb-grain" />

      {/* Logo */}
      <div className="sb-logo">
        <div className="sb-logo-mark">Y</div>
        <div className="sb-logo-text">
          <span className="sb-logo-title">YAAR</span>
          <span className="sb-logo-dot">·</span>
        </div>
      </div>

      <div className="sb-rule" />

      {/* Nav */}
      <nav className="sb-nav">
        {NAV.map((item, i) => {
          const isActive  = active === item.id;
          const isHovered = hoveredId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`sb-item${isActive ? " sb-item--on" : ""}`}
              style={{ animationDelay: `${i * 70}ms` }}
              title={item.label}
            >
              <span className="sb-item-bar" />
              <span className={`sb-item-icon${isActive ? " sb-item-icon--on" : ""}`}>
                {item.icon(isActive || isHovered)}
              </span>
              <span className="sb-item-labels">
                <span className="sb-item-label">{item.label}</span>
                <span className="sb-item-sub">{item.sublabel}</span>
              </span>
              {isActive && <span className="sb-item-pulse" />}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />
      <div className="sb-rule" />

      {/* User */}
      <div className="sb-user">
        <button
          className="sb-user-row"
          onClick={() => setShowLogout(v => !v)}
          title="Account options"
        >
          <div className="sb-avatar">
            {initials}
            <span className="sb-avatar-ring" />
          </div>
          <div className="sb-user-info">
            <span className="sb-user-name">{username}</span>
            <span className="sb-user-status">
              <span className="sb-online-dot" />
              online
            </span>
          </div>
          <svg
            width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            style={{
              color: "var(--text-muted)",
              opacity: 0.4,
              flexShrink: 0,
              transition: "transform 0.2s",
              transform: showLogout ? "rotate(180deg)" : "rotate(0)",
            }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {showLogout && (
          <button
            className="sb-logout"
            onClick={() => { logout(); setShowLogout(false); }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            sign out
          </button>
        )}
      </div>
    </aside>
  );
}