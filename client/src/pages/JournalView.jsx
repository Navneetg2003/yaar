import { useState, useEffect, useRef, useCallback } from "react";
import { apiGetJournal, apiSaveJournal, apiGetJournalDates } from "../services/api";
import { formatDate, todayISO } from "../utils/formatMessage";
import JournalAnimation from "../components/JournalAnimation";

const DEBOUNCE_MS = 1200;
const ANIM_DURATION = 3200;

// ─── Main View ────────────────────────────────────────────────

export default function JournalView() {
  const [phase, setPhase]           = useState("anim");
  const [content, setContent]       = useState("");
  const [activeDate, setActiveDate] = useState(todayISO());
  const [dates, setDates]           = useState([]);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [loading, setLoading]       = useState(false);
  const [showCal, setShowCal]       = useState(false);
  const saveTimer                   = useRef(null);
  const calRef                      = useRef(null);

  // Opening animation
  useEffect(() => {
    const t = setTimeout(() => setPhase("open"), ANIM_DURATION);
    return () => clearTimeout(t);
  }, []);

  // Close calendar on outside click
  useEffect(() => {
    if (!showCal) return;
    function handleClick(e) {
      if (calRef.current && !calRef.current.contains(e.target)) {
        setShowCal(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showCal]);

  const loadDates = useCallback(async () => {
    try {
      const data = await apiGetJournalDates();
      setDates(data.dates || []);
    } catch {
      // non-critical — calendar dots just won't show
    }
  }, []);

  const loadEntry = useCallback(async (date) => {
    setLoading(true);
    try {
      const data = await apiGetJournal(date);
      setContent(data.entry?.content || "");
    } catch {
      setContent("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (phase !== "open") return;
    loadEntry(activeDate);
    loadDates();
  }, [phase, activeDate, loadEntry, loadDates]);

  // Cleanup save timer on unmount
  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const autoSave = useCallback((text) => {
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await apiSaveJournal(text, activeDate);
        setSaved(true);
        loadDates(); // refresh calendar dots
        setTimeout(() => setSaved(false), 2000);
      } catch {
        // silent fail — user still sees their text
      } finally {
        setSaving(false);
      }
    }, DEBOUNCE_MS);
  }, [activeDate, loadDates]);

  function handleChange(e) {
    setContent(e.target.value);
    autoSave(e.target.value);
  }

  function handleDateSelect(date) {
    if (date === activeDate) { setShowCal(false); return; }
    // Cancel any pending save before switching date
    clearTimeout(saveTimer.current);
    setSaving(false);
    setSaved(false);
    setActiveDate(date);
    setShowCal(false);
  }

  if (phase === "anim") return <JournalAnimation />;

  return (
    <div className="journal-view">
      <div className="journal-spread">

        {/* ── Left page ── */}
        <div className="journal-page journal-page-left">
          <div className="journal-lines" />

          <div className="journal-date-area" ref={calRef}>
            <button
              className="journal-date-btn"
              onClick={() => setShowCal(v => !v)}
              aria-label="Pick a date"
            >
              {formatDate(activeDate)}
            </button>
            {showCal && (
              <MiniCalendar
                activeDate={activeDate}
                markedDates={dates}
                onSelect={handleDateSelect}
              />
            )}
          </div>

          <div className="journal-doodle">
            <svg viewBox="0 0 120 32" fill="none" width="120">
              <text x="4" y="22" fontFamily="'Caveat', cursive" fontSize="18"
                fill="#C4A882" opacity="0.5">yaar ♥</text>
              <circle cx="98" cy="10" r="3" fill="none" stroke="#C4A882"
                strokeWidth="1" opacity="0.4"/>
              <circle cx="108" cy="17" r="2" fill="none" stroke="#C4A882"
                strokeWidth="1" opacity="0.3"/>
            </svg>
          </div>

          <div className="wax-seal">Y</div>
        </div>

        {/* ── Spine ── */}
        <div className="journal-spine" />

        {/* ── Right page ── */}
        <div className="journal-page journal-page-right">
          <div className="journal-lines" />

          <div className="save-indicator">
            {loading && <span style={{ color: "var(--text-muted)" }}>loading…</span>}
            {!loading && saving && <span style={{ color: "var(--text-muted)" }}>saving…</span>}
            {!loading && saved  && <span style={{ color: "#9CB89A" }}>✓ saved</span>}
          </div>

          <textarea
            value={content}
            onChange={handleChange}
            placeholder={loading ? "" : "what's on your mind today?"}
            className="journal-editor"
            style={{ opacity: loading ? 0.4 : 1, transition: "opacity 0.2s" }}
            disabled={loading}
            spellCheck={false}
            aria-label="Journal entry"
          />

          <div className="bookmark" />
        </div>

      </div>
    </div>
  );
}

// ─── Mini calendar ────────────────────────────────────────────

function MiniCalendar({ activeDate, markedDates, onSelect }) {
  const today = todayISO();
  const init  = new Date(activeDate + "T00:00:00"); // force local parse
  const [viewYear,  setViewYear]  = useState(init.getFullYear());
  const [viewMonth, setViewMonth] = useState(init.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const monthLabel  = new Date(viewYear, viewMonth).toLocaleDateString("en-IN", {
    month: "long", year: "numeric",
  });

  // Prevent future date navigation
  const now = new Date();
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  function prevMonth() {
    viewMonth === 0
      ? (setViewMonth(11), setViewYear(y => y - 1))
      : setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (isCurrentMonth) return; // can't go to future
    viewMonth === 11
      ? (setViewMonth(0), setViewYear(y => y + 1))
      : setViewMonth(m => m + 1);
  }

  return (
    <div className="mini-calendar" onClick={e => e.stopPropagation()}>
      <div className="cal-header">
        <button onClick={prevMonth} className="cal-nav">‹</button>
        <span className="cal-month">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="cal-nav"
          style={{ opacity: isCurrentMonth ? 0.25 : 1, cursor: isCurrentMonth ? "default" : "pointer" }}
          disabled={isCurrentMonth}
        >›</button>
      </div>

      <div className="cal-grid">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <span key={i} className="cal-day-label">{d}</span>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day      = i + 1;
          const iso      = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isFuture = iso > today;
          const isToday  = iso === today;
          const isActive = iso === activeDate;
          const hasEntry = markedDates.includes(iso);

          return (
            <button
              key={day}
              onClick={() => !isFuture && onSelect(iso)}
              disabled={isFuture}
              className={`cal-day${isActive ? " cal-day-active" : ""}${isToday ? " cal-day-today" : ""}`}
              style={{ opacity: isFuture ? 0.25 : 1, cursor: isFuture ? "default" : "pointer" }}
              aria-label={iso}
            >
              {day}
              {hasEntry && !isActive && <span className="cal-dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}