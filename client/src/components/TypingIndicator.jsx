export default function TypingIndicator() {
  return (
    <div className="bubble-row bubble-row--ai">
      <div className="bubble-avatar">Y</div>
      <div className="bubble bubble--ai bubble--typing">
        <span className="dot-bounce" style={{ animationDelay: "0ms" }} />
        <span className="dot-bounce" style={{ animationDelay: "160ms" }} />
        <span className="dot-bounce" style={{ animationDelay: "320ms" }} />
      </div>
    </div>
  );
}