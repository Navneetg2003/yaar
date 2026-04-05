import { useState, useRef, useEffect } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const textareaRef     = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [text]);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="input-bar">
      <div className="input-inner flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="tell yaar anything..."
          disabled={disabled}
          rows={1}
          className="chat-input flex-1 bg-transparent resize-none outline-none py-1"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="send-btn flex-shrink-0"
          aria-label="Send"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
      <p className="text-center mt-2" style={{ fontSize: "10px", color: "var(--text-muted)", opacity: 0.5 }}>
        Yaar is an AI — not a therapist. For emergencies call iCall: 9152987821
      </p>
    </div>
  );
}