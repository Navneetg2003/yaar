import { useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";
import MessageInput from "../components/MessageInput";

const WELCOME = {
  id: "welcome",
  role: "assistant",
  content: "Hey yaar 👋 Kya chal raha hai? I'm here — what's on your mind?",
  timestamp: new Date().toISOString(),
};

export default function ChatView() {
  const { messages, isStreaming, error, send, loadHistory } = useChat();
  const bottomRef = useRef(null);

  // loadHistory in deps array to satisfy exhaustive-deps rule
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Scroll to bottom whenever messages update or streaming starts/stops
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Show welcome message only when history is empty
  const display = messages.length === 0 ? [WELCOME] : messages;

  // Show typing indicator whenever AI is streaming —
  // even if last message already has partial content
  const showTyping = isStreaming;

  return (
    <div className="view-panel">

      {/* Header */}
      <div className="chat-header">
        <div className="yaar-avatar-sm">Y</div>
        <div>
          <p style={{
            fontSize: "14px",
            color: "var(--text)",
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
          }}>
            yaar bot
          </p>
          <p style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "2px",
          }}>
            <span className={`status-dot ${isStreaming ? "typing" : "online"}`} />
            {isStreaming ? "typing…" : "always here"}
          </p>
        </div>
      </div>

      {/* Message list */}
      <div className="chat-scroll">
        <div className="chat-messages">
          {display.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {showTyping && <TypingIndicator />}
          {error && <div className="chat-error">{error}</div>}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <MessageInput onSend={send} disabled={isStreaming} />

    </div>
  );
}