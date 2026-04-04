import { formatTime } from "../utils/formatMessage";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-2 px-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && <div className="yaar-avatar-sm flex-shrink-0">Y</div>}

      <div className={`flex flex-col gap-1 max-w-[76%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words
          ${isUser ? "user-bubble rounded-br-sm" : "glass-bubble rounded-bl-sm"}
          ${message.flagged ? "border border-red-400/40" : ""}
        `}>
          {message.content}
          {!isUser && message.content === "" && (
            <span className="inline-block w-0.5 h-4 bg-amber-400 animate-pulse ml-0.5 align-middle" />
          )}
        </div>

        {message.timestamp && (
          <span className="text-[10px] px-1" style={{ color: "var(--text-muted)" }}>
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}