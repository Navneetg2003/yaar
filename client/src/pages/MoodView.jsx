import { useState, useEffect } from "react";
import { apiLogMood, apiGetMoodSummary } from "../services/api";
import { getMoodByScore } from "../utils/formatMessage";

const WHEEL_MOODS = [
  { label: "Joy",      emoji: "😄", color: "#F2A854", desc: "feeling bright and happy"  },
  { label: "Calm",     emoji: "😌", color: "#7AC4A8", desc: "at peace, settled"          },
  { label: "Grateful", emoji: "🙏", color: "#C084FC", desc: "appreciating what's here"   },
  { label: "Tired",    emoji: "😴", color: "#7A7A96", desc: "low energy, need rest"      },
  { label: "Anxious",  emoji: "😰", color: "#C47A7A", desc: "worried or on edge"         },
  { label: "Sad",      emoji: "😢", color: "#7AA2C4", desc: "feeling low or heavy"       },
  { label: "Angry",    emoji: "😤", color: "#E8895A", desc: "frustrated or upset"        },
];

const LABEL_SCORE = { Joy:5, Calm:4, Grateful:5, Tired:2, Anxious:2, Sad:1, Angry:1 };

export default function MoodView() {
  const [selected, setSelected]     = useState(null);
  const [washing, setWashing]       = useState(false);
  const [washColor, setWashColor]   = useState("#F2A854");
  const [note, setNote]             = useState("");
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [summary, setSummary]       = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => { loadSummary(); }, []);

  async function loadSummary() {
    try {
      const data = await apiGetMoodSummary();
      setSummary(data.summary || []);
    } catch {}
  }

  function handleSelect(mood) {
    setSelected(mood);
    setNote("");
    setWashColor(mood.color);
    setWashing(true);
    setTimeout(() => setWashing(false), 2200);
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      await apiLogMood(LABEL_SCORE[selected.label] || 3, selected.label, note);
      setSaved(true);
      setTimeout(() => { setSaved(false); setSelected(null); loadSummary(); }, 1800);
    } catch {}
    finally { setSaving(false); }
  }

  return (
    <div className="view-panel overflow-auto relative">

      {washing && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: `radial-gradient(circle at 50% 40%, ${washColor}22 0%, transparent 70%)`,
          animation: "washPulse 2.2s ease forwards",
        }} />
      )}

      <div className="mood-content" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="mood-header">how are you feeling today?</h2>

        <div className="mood-wheel">
          {WHEEL_MOODS.map((mood) => (
            <button key={mood.label} onClick={() => handleSelect(mood)}
              className="mood-segment"
              style={{
                background:  selected?.label === mood.label ? `${mood.color}22` : "transparent",
                borderColor: selected?.label === mood.label ? `${mood.color}60` : "var(--border)",
                transform:   selected?.label === mood.label ? "scale(1.08)" : "scale(1)",
              }}>
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label-text"
                style={{ color: selected?.label === mood.label ? mood.color : "var(--text-muted)" }}>
                {mood.label.toLowerCase()}
              </span>
            </button>
          ))}
        </div>

        {selected && !saved && (
          <div className="mood-detail" style={{ borderColor: `${selected.color}40` }}>
            <p style={{ color: selected.color, fontSize: 14, marginBottom: 12 }}>{selected.desc}</p>
            <input type="text" value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="anything you want to add?"
              className="mood-note-input w-full"
              style={{ fontFamily: "'Caveat', cursive" }}
            />
            <button onClick={handleSave} disabled={saving} className="mood-save-btn"
              style={{ background: `linear-gradient(135deg, ${selected.color}, ${selected.color}cc)` }}>
              {saving ? "saving…" : "log this feeling →"}
            </button>
          </div>
        )}

        {saved && (
          <div className="mood-saved">
            <span style={{ fontSize: 36 }}>✨</span>
            <p style={{ color: "var(--text-muted)", marginTop: 8 }}>logged, yaar</p>
          </div>
        )}

        {summary.length > 0 && (
          <div className="mood-history">
            <p className="mood-history-title">your week</p>
            <div className="mood-dots-track">
              {summary.map((day, i) => {
                const mood = getMoodByScore(Math.round(day.avg));
                return (
                  <div key={day.date} className="mood-dot-wrap"
                    onMouseEnter={() => setHoveredDay(i)}
                    onMouseLeave={() => setHoveredDay(null)}>
                    <div className="mood-dot" style={{
                      background: mood.color,
                      boxShadow: `0 0 10px ${mood.color}60`,
                      transform: hoveredDay === i ? "scale(1.3)" : "scale(1)",
                    }}>
                      <span style={{ fontSize: 14 }}>{mood.emoji}</span>
                    </div>
                    {hoveredDay === i && (
                      <div className="mood-tooltip">
                        <p style={{ color: mood.color, fontSize: 12, fontWeight: 500 }}>{mood.label}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: 11 }}>
                          {new Date(day.date + "T00:00:00").toLocaleDateString("en-IN", {
                            weekday: "short", day: "numeric", month: "short"
                          })}
                        </p>
                      </div>
                    )}
                    {i < summary.length - 1 && <div className="mood-connector" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes washPulse {
          0%   { opacity: 0; }
          20%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}