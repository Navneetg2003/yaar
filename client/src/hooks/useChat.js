import { useState, useCallback } from "react";
import { apiSendMessage, apiGetHistory } from "../services/api";

export function useChat() {
  const [messages, setMessages]      = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError]            = useState(null);

  async function loadHistory() {
    try {
      const data = await apiGetHistory();
      if (data.messages?.length) {
        setMessages(data.messages.map((m) => ({
          id: m.id, role: m.role, content: m.content,
          flagged: m.flagged, timestamp: m.created_at,
        })));
      }
    } catch (err) {
      console.warn("Could not load history:", err.message);
    }
  }

  const send = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return;
    setError(null);

    const assistantId = `a-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: text, timestamp: new Date().toISOString() },
      { id: assistantId,       role: "assistant", content: "", timestamp: new Date().toISOString() },
    ]);

    setIsStreaming(true);

    try {
      const res = await apiSendMessage(text);
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId
            ? { ...m, content: data.response, flagged: data.flagged }
            : m)
        );
        return;
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full      = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value, { stream: true }).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;
          try {
            const { token } = JSON.parse(payload);
            full += token;
            setMessages((prev) =>
              prev.map((m) => m.id === assistantId ? { ...m, content: full } : m)
            );
          } catch { /* skip malformed chunk */ }
        }
      }
    } catch (err) {
      setError(err.message);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming]);

  return { messages, isStreaming, error, send, loadHistory };
}