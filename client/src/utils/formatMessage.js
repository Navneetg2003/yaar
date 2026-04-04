export function formatTime(timestamp) {
  if (!timestamp) return "";
  const date   = new Date(timestamp);
  const now    = new Date();
  const diffMin = Math.floor((now - date) / 60000);

  if (diffMin < 1)  return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export const MOODS = [
  { score: 1, label: "Sad",     emoji: "😔", color: "#7AA2C4", colorLight: "rgba(122,162,196,0.15)" },
  { score: 2, label: "Anxious", emoji: "😰", color: "#C47A7A", colorLight: "rgba(196,122,122,0.15)" },
  { score: 3, label: "Okay",    emoji: "😐", color: "#A89FC4", colorLight: "rgba(168,159,196,0.15)" },
  { score: 4, label: "Calm",    emoji: "😌", color: "#7AC4A8", colorLight: "rgba(122,196,168,0.15)" },
  { score: 5, label: "Joy",     emoji: "😄", color: "#F2A854", colorLight: "rgba(242,168,84,0.15)"  },
];

export function getMoodByScore(score) {
  return MOODS.find((m) => m.score === score) || MOODS[2];
}

export function getMoodByLabel(label) {
  return MOODS.find((m) => m.label === label) || MOODS[2];
}

export function greetingByTime() {
  const hour = new Date().getHours();
  if (hour < 12) return "good morning";
  if (hour < 17) return "hey";
  if (hour < 21) return "good evening";
  return "night owl mode 🌙";
}