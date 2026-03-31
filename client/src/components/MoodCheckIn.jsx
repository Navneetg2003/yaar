import { useState } from "react";
import { mood as moodAPI } from "../services/api";

/**
 * MoodCheckIn - allows user to log their current mood (1-5 scale)
 */
export function MoodCheckIn({ onMoodLogged }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const moods = [
    { score: 1, emoji: "😢", label: "Terrible" },
    { score: 2, emoji: "😟", label: "Bad" },
    { score: 3, emoji: "😐", label: "Okay" },
    { score: 4, emoji: "🙂", label: "Good" },
    { score: 5, emoji: "😄", label: "Great" },
  ];

  const handleMoodSelect = async (score) => {
    setLoading(true);
    try {
      await moodAPI.log(score, note || null);
      setIsOpen(false);
      setNote("");
      if (onMoodLogged) onMoodLogged(score);
    } catch (err) {
      console.error("Failed to log mood:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition"
      >
        <span>😊 How are you?</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 z-50">
          <h3 className="font-semibold text-gray-900 mb-3">How are you feeling right now?</h3>

          {/* Mood selector */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {moods.map((mood) => (
              <button
                key={mood.score}
                onClick={() => handleMoodSelect(mood.score)}
                disabled={loading}
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded transition disabled:opacity-50"
                title={mood.label}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-xs text-gray-600 mt-1">{mood.label}</span>
              </button>
            ))}
          </div>

          {/* Optional note */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 mb-3"
            rows={2}
          />

          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Close"}
          </button>
        </div>
      )}
    </div>
  );
}

export default MoodCheckIn;
