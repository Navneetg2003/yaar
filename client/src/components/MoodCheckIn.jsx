import { useState } from "react";
import { apiLogMood } from "../services/api";
import { MOODS } from "../utils/formatMessage";

export default function MoodCheckIn({ onClose }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote]         = useState("");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      await apiLogMood(selected.score, selected.label, note);
      setSaved(true);
      setTimeout(onClose, 1400);
    } catch (err) {
      console.error("Mood save failed:", err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {saved ? (
          <div className="text-center py-6">
            <p style={{ fontSize: 40 }}>✨</p>
            <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>Noted, yaar.</p>
          </div>
        ) : (
          <>
            <h3 className="text-center text-lg mb-1"
              style={{ color: "var(--text)", fontFamily: "'Playfair Display', serif" }}>
              kaisa feel ho raha hai?
            </h3>
            <p className="text-center text-xs mb-5" style={{ color: "var(--text-muted)" }}>
              how are you feeling right now?
            </p>

            <div className="flex justify-between mb-4">
              {MOODS.map((mood) => (
                <button key={mood.score} onClick={() => setSelected(mood)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
                  style={{
                    background: selected?.score === mood.score ? mood.colorLight : "transparent",
                    transform:  selected?.score === mood.score ? "scale(1.12)" : "scale(1)",
                    border: "none", cursor: "pointer",
                  }}>
                  <span style={{ fontSize: 24 }}>{mood.emoji}</span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{mood.label}</span>
                </button>
              ))}
            </div>

            {selected && (
              <input type="text" value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="anything you want to add?"
                className="mood-note-input w-full mb-4"
                style={{ fontFamily: "'Caveat', cursive" }}
              />
            )}

            <div className="flex gap-2">
              <button onClick={onClose}
                className="flex-1 py-2 text-sm rounded-xl"
                style={{ color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer" }}>
                skip
              </button>
              <button onClick={handleSave} disabled={!selected || saving}
                className="flex-1 py-2 text-sm font-medium rounded-xl"
                style={{
                  background: "linear-gradient(135deg, var(--amber), #e8895a)",
                  color: "#080B18", border: "none", cursor: "pointer",
                  opacity: (!selected || saving) ? 0.4 : 1,
                }}>
                {saving ? "saving…" : "save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}