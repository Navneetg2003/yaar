export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4">
      <div className="yaar-avatar-sm">Y</div>
      <div className="glass-bubble px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1.5 items-center h-4">
          <span className="dot-bounce" style={{ animationDelay: "0ms" }} />
          <span className="dot-bounce" style={{ animationDelay: "150ms" }} />
          <span className="dot-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}