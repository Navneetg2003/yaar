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

  useEffect(() => { loadHistory(); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const display    = messages.length === 0 ? [WELCOME] : messages;
  const showTyping = isStreaming && messages[messages.length - 1]?.content === "";

  return (
    <div className="view-panel flex flex-col">
      <div className="chat-header">
        <div className="yaar-avatar-sm">Y</div>
        <div>
          <p className="text-sm" style={{ color: "var(--text)", fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
            yaar bot
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <span className={`status-dot ${isStreaming ? "typing" : "online"}`} />
            {isStreaming ? "typing…" : "always here"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {display.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
        {showTyping && <TypingIndicator />}
        {error && (
          <div className="mx-4 p-3 rounded-xl text-xs" style={{
            background: "rgba(196,122,122,0.1)",
            border: "1px solid rgba(196,122,122,0.2)",
            color: "#e8a0a0",
          }}>
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={send} disabled={isStreaming} />
    </div>
  );
}