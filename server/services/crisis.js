const CRISIS_KEYWORDS = [
  "kill myself", "end my life", "want to die", "suicidal",
  "suicide", "self harm", "self-harm", "cut myself", "hurt myself",
  "can't go on", "cannot go on", "no point living", "not worth living",
  "better off dead", "end it all", "end everything",
  "marna chahta", "marna chahti", "jaan dena", "khatam karna",
  "khatam kar lunga", "khatam kar lungi", "jeena nahi",
  "mar jaana", "mar jaunga", "mar jaungi",
  "zindagi khatam", "sab khatam", "khud ko hurt",
];

const HELPLINE_RESPONSE = `Yaar, I hear you and I'm really glad you reached out.

What you're feeling right now sounds incredibly heavy, and you don't have to carry it alone.

Please reach out to someone who can really help right now:

📞 iCall: 9152987821 (Mon–Sat, 8am–10pm)
📞 Vandrevala Foundation: 1860-2662-345 (24/7)
📞 AASRA: 9820466627 (24/7)

These are real people who care and will listen — no judgment at all.

I'm still here with you. 💙`;

export function crisisCheck(message) {
  if (!message || typeof message !== "string") return false;
  const lower = message.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

export function getCrisisResponse() {
  return HELPLINE_RESPONSE;
}