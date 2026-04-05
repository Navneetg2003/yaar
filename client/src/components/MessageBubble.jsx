import { formatTime } from "../utils/formatMessage";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`bubble-row ${isUser ? "bubble-row--user" : "bubble-row--ai"}`}>
      {/* AI avatar — only shown for assistant */}
      {!isUser && (
        <div className="bubble-avatar">Y</div>
      )}

      <div className="bubble-body">
        <div className={`bubble ${isUser ? "bubble--user" : "bubble--ai"}`}>
          {message.content}
        </div>
        <span className="bubble-time">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}