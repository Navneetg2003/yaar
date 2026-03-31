import { useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import CrisisAlert from "./CrisisAlert";

/**
 * ChatWindow - displays chat messages and handles scrolling
 */
export function ChatWindow({ messages, loading, crisisDetected, messagesEndRef }) {
  // Load history on mount
  useEffect(() => {
    // Messages already loaded by parent
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 space-y-2">
      {messages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-6xl mb-4">💙</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hey, I'm Yaar</h2>
          <p className="text-gray-600 max-w-sm">
            Your supportive AI friend. I'm here to listen, understand, and be there for you. No judgment, just genuine care.
          </p>
          <p className="text-sm text-gray-500 mt-4">Start a conversation whenever you're ready.</p>
        </div>
      )}

      {messages.length > 0 && (
        <div className="space-y-2">
          {crisisDetected && <CrisisAlert />}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {loading && <TypingIndicator />}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow;
