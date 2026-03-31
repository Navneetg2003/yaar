/**
 * TypingIndicator - animated dots showing AI is typing
 */
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 mb-4">
      <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
