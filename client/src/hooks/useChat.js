import { useState, useCallback, useRef, useEffect } from "react";
import { chat } from "../services/api";

/**
 * useChat hook - manages chat state, messages, and streaming responses
 */
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /**
   * Load chat history from server
   */
  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { messages: history } = await chat.history();
      setMessages(history || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Send a message and stream the response
   */
  const sendMessage = useCallback(
    async (userMessage) => {
      if (!userMessage.trim()) return;

      // Add user message immediately
      const userMsg = {
        id: Date.now(),
        role: "user",
        content: userMessage,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setError(null);
      setCrisisDetected(false);
      setLoading(true);

      // Add placeholder for AI response
      const aiMsgId = Date.now() + 1;
      const aiMsg = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      try {
        await chat.sendMessage(
          userMessage,
          // onToken - accumulate streamed tokens
          (token) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMsgId
                  ? { ...msg, content: msg.content + token }
                  : msg
              )
            );
          },
          // onComplete - final response
          (response, flagged) => {
            if (flagged) {
              setCrisisDetected(true);
            }
          },
          // onError
          (err) => {
            setError(err);
            // Remove incomplete AI message on error
            setMessages((prev) => prev.filter((msg) => msg.id !== aiMsgId));
          }
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setCrisisDetected(false);
  }, []);

  return {
    messages,
    loading,
    error,
    crisisDetected,
    messagesEndRef,
    sendMessage,
    loadHistory,
    clearMessages,
  };
}

export default useChat;
