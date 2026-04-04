import { useState } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { emoji: "👋", title: "Meet Yaar",         body: "Yaar is your AI best friend — someone who listens without judgment, remembers what you share, and talks the way you do." },
  { emoji: "🧠", title: "Yaar learns you",   body: "The more you talk, the more Yaar adapts — your language, your humour, your vibe. No two Yaars are the same." },
  { emoji: "📓", title: "Your journal",       body: "Write freely in your private journal. No one reads it. It's just yours — a quiet space to think out loud." },
  { emoji: "🎭", title: "Track your mood",   body: "Check in with how you feel each day. Yaar notices patterns and gently reflects them back to you." },
  { emoji: "🫂", title: "One thing to know", body: "Yaar is an AI, not a therapist. If you're ever in crisis, Yaar will always point you to real help. You're not alone." },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate        = useNavigate();
  const current         = STEPS[step];
  const isLast          = step === STEPS.length - 1;

  function next() {
    if (isLast) {
      localStorage.setItem("yaar_onboarded", "true");
      navigate("/dashboard");
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="onboarding-page">
      <div className="orb orb-1" /><div className="orb orb-2" />

      <div className="onboarding-dots">
        {STEPS.map((_, i) => (
          <div key={i} className={`onboarding-dot ${i === step ? "active" : i < step ? "done" : ""}`} />
        ))}
      </div>

      <div className="onboarding-content" key={step}>
        <div className="onboarding-emoji">{current.emoji}</div>
        <h2 className="onboarding-title">{current.title}</h2>
        <p className="onboarding-body">{current.body}</p>
      </div>

      <button onClick={next} className="onboarding-btn">
        {isLast ? "start talking →" : "next →"}
      </button>

      {!isLast && (
        <button onClick={() => { localStorage.setItem("yaar_onboarded", "true"); navigate("/dashboard"); }}
          className="onboarding-skip">
          skip intro
        </button>
      )}
    </div>
  );
}