import { useState, useEffect, useRef, useCallback } from "react";
import { apiGetJournal, apiSaveJournal, apiGetJournalDates } from "../services/api";
import { formatDate, todayISO } from "../utils/formatMessage";

const DEBOUNCE_MS = 1200;

export default function JournalView() {
  const [phase, setPhase]           = useState("anim");
  const [content, setContent]       = useState("");
  const [activeDate, setActiveDate] = useState(todayISO());
  const [dates, setDates]           = useState([]);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [showCal, setShowCal]       = useState(false);
  const saveTimer                   = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase("open"), 3200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === "open") { loadEntry(activeDate); loadDates(); }
  }, [phase, activeDate]);

  async function loadEntry(date) {
    try {
      const data = await apiGetJournal(date);
      setContent(data.entry?.content || "");
    } catch { setContent(""); }
  }

  async function loadDates() {
    try {
      const data = await apiGetJournalDates();
      setDates(data.dates || []);
    } catch {}
  }

  const autoSave = useCallback((text) => {
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await apiSaveJournal(text, activeDate);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        loadDates();
      } catch {}
      finally { setSaving(false); }
    }, DEBOUNCE_MS);
  }, [activeDate]);

  function handleChange(e) {
    setContent(e.target.value);
    autoSave(e.target.value);
  }

  if (phase === "anim") return <JournalAnimation />;

  return (
    <div className="view-panel flex flex-col items-center justify-center p-4 md:p-8 overflow-auto">
      <div className="journal-spread">

        {/* Left page */}
        <div className="journal-page journal-page-left">
          <div className="journal-lines" />
          <div className="journal-date-area">
            <button className="journal-date-btn" onClick={() => setShowCal(!showCal)}>
              {formatDate(activeDate)}
            </button>
            {showCal && (
              <MiniCalendar
                activeDate={activeDate}
                markedDates={dates}
                onSelect={(d) => { setActiveDate(d); setShowCal(false); }}
                onClose={() => setShowCal(false)}
              />
            )}
          </div>
          <div className="journal-doodle">
            <svg viewBox="0 0 120 32" fill="none" width="120">
              <text x="4" y="22" fontFamily="'Caveat', cursive" fontSize="18" fill="#C4A882" opacity="0.5">yaar ♥</text>
              <circle cx="98" cy="10" r="3" fill="none" stroke="#C4A882" strokeWidth="1" opacity="0.4"/>
              <circle cx="108" cy="17" r="2" fill="none" stroke="#C4A882" strokeWidth="1" opacity="0.3"/>
            </svg>
          </div>
          <div className="wax-seal">Y</div>
        </div>

        {/* Spine */}
        <div className="journal-spine" />

        {/* Right page */}
        <div className="journal-page journal-page-right">
          <div className="journal-lines" />
          <div className="save-indicator">
            {saving && <span style={{ color: "var(--text-muted)" }}>saving…</span>}
            {saved  && <span style={{ color: "#9CB89A" }}>✓ saved</span>}
          </div>
          <textarea
            value={content}
            onChange={handleChange}
            placeholder="what's on your mind today?"
            className="journal-editor"
            spellCheck={false}
          />
          <div className="bookmark" />
        </div>

      </div>
    </div>
  );
}

function JournalAnimation() {
  const [animPhase, setAnimPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimPhase(1), 1500);
    const t2 = setTimeout(() => setAnimPhase(2), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="view-panel flex items-center justify-center">
      <div style={{ position: "relative", width: 220, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Crayon drawing */}
        <div style={{
          position: "absolute",
          transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1)",
          opacity: animPhase >= 1 ? 0 : 1,
          transform: animPhase >= 1 ? "scale(0.6) rotate(-8deg)" : "scale(1)",
        }}>
          <svg viewBox="0 0 200 160" width="200" height="160">
            <rect x="40" y="100" width="120" height="8" rx="2" fill="#D4956A"/>
            <line x1="55" y1="108" x2="55" y2="130" stroke="#D4956A" strokeWidth="3"/>
            <line x1="145" y1="108" x2="145" y2="130" stroke="#D4956A" strokeWidth="3"/>
            <circle cx="100" cy="60" r="12" fill="none" stroke="#E8965A" strokeWidth="2"/>
            <line x1="100" y1="72" x2="100" y2="98" stroke="#E8965A" strokeWidth="2"/>
            <line x1="100" y1="80" x2="80" y2="90" stroke="#E8965A" strokeWidth="2"/>
            <line x1="100" y1="80" x2="118" y2="86" stroke="#E8965A" strokeWidth="2"/>
            <line x1="100" y1="98" x2="88" y2="118" stroke="#E8965A" strokeWidth="2"/>
            <line x1="100" y1="98" x2="112" y2="118" stroke="#E8965A" strokeWidth="2"/>
            <rect x="78" y="90" width="28" height="18" rx="2" fill="#F4D4A0" stroke="#C4956A" strokeWidth="1.5"/>
            <line x1="92" y1="90" x2="92" y2="108" stroke="#C4956A" strokeWidth="1"/>
            <text x="54" y="46" fontFamily="'Caveat', cursive" fontSize="20" fill="#F2A854" opacity="0.9">YAAR</text>
          </svg>
        </div>

        {/* Leather journal */}
        <div style={{
          position: "absolute",
          transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1)",
          opacity: animPhase === 0 ? 0 : 1,
          transform: animPhase === 1 ? "rotateX(20deg) scale(0.9)" : "rotateX(0deg) scale(1)",
          perspective: 600,
        }}>
          <div style={{
            width: 140, height: 100,
            background: "linear-gradient(135deg,#5C3A1E,#8B5E3C)",
            borderRadius: "4px 12px 12px 4px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "4px 4px 20px rgba(0,0,0,0.5)",
            borderLeft: "6px solid #3D2410",
          }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28, fontWeight: 700, color: "#F2A854",
              textShadow: "0 0 12px rgba(242,168,84,0.4)",
              letterSpacing: "0.2em",
            }}>YAAR</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCalendar({ activeDate, markedDates, onSelect }) {
  const today  = todayISO();
  const init   = new Date(activeDate);
  const [viewYear, setViewYear]   = useState(init.getFullYear());
  const [viewMonth, setViewMonth] = useState(init.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const monthLabel  = new Date(viewYear, viewMonth).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  function prevMonth() { viewMonth === 0  ? (setViewMonth(11), setViewYear(y => y-1)) : setViewMonth(m => m-1); }
  function nextMonth() { viewMonth === 11 ? (setViewMonth(0),  setViewYear(y => y+1)) : setViewMonth(m => m+1); }

  return (
    <div className="mini-calendar" onClick={(e) => e.stopPropagation()}>
      <div className="cal-header">
        <button onClick={prevMonth} className="cal-nav">‹</button>
        <span className="cal-month">{monthLabel}</span>
        <button onClick={nextMonth} className="cal-nav">›</button>
      </div>
      <div className="cal-grid">
        {["S","M","T","W","T","F","S"].map((d,i) => (
          <span key={i} className="cal-day-label">{d}</span>
        ))}
        {Array.from({ length: firstDay }).map((_,i) => <span key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_,i) => {
          const day      = i + 1;
          const iso      = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isToday  = iso === today;
          const isActive = iso === activeDate;
          const hasEntry = markedDates.includes(iso);
          return (
            <button key={day} onClick={() => onSelect(iso)}
              className={`cal-day ${isActive ? "cal-day-active" : ""} ${isToday ? "cal-day-today" : ""}`}>
              {day}
              {hasEntry && !isActive && <span className="cal-dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}