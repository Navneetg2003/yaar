export default function CrisisAlert() {
  return (
    <div className="mx-4 my-2 p-4 rounded-2xl" style={{
      background: "rgba(196,122,122,0.1)",
      border: "1px solid rgba(196,122,122,0.3)",
    }}>
      <div className="flex items-start gap-3">
        <span style={{ fontSize: 20 }}>🫂</span>
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "#e8a0a0" }}>
            You don't have to face this alone.
          </p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-muted)" }}>
            Please reach out to someone who can truly help:
          </p>
          <div className="space-y-1">
            {[
              { label: "iCall",                  number: "9152987821"   },
              { label: "Vandrevala Foundation",  number: "1860-2662-345" },
              { label: "AASRA",                  number: "9820466627"   },
            ].map(({ label, number }) => (
              <a key={label} href={`tel:${number}`}
                className="block text-xs transition-opacity hover:opacity-80"
                style={{ color: "var(--amber)" }}>
                📞 {label}: {number}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}