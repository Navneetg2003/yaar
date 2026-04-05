import { useState, useRef } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput(e) {
    setText(e.target.value);
    // Auto-grow textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="input-wrap">
      <div className="input-bar">
        <div className="input-inner">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="tell yaar anything..."
            value={text}
            onInput={handleInput}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "4px" }}>
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <p className="input-disclaimer">
        Yaar is an AI — not a therapist. For emergencies call iCall: 9152987821
      </p>
    </div>
  );
}