import express from "express";
import supabase from "../db/supabase.js";
import { crisisCheck, getCrisisResponse } from "../services/crisis.js";
import { streamYaarResponse } from "../services/ai.js";
import { getRecentMessages, saveMessage, getOrCreateConversation } from "../services/memory.js";
import { getPersonalityProfile, updatePersonalityProfile } from "../services/personality.js";
import { authMiddleware } from "../middleware/auth.js";
import { chatRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/message", authMiddleware, chatRateLimit, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  if (crisisCheck(message)) {
    flagMessage(userId, message);
    return res.json({ response: getCrisisResponse(), flagged: true });
  }

  try {
    const [recentMessages, personalityProfile, conversationId] = await Promise.all([
      getRecentMessages(userId),
      getPersonalityProfile(userId),
      getOrCreateConversation(userId),
    ]);

    const aiResponse = await streamYaarResponse(message, personalityProfile, recentMessages, res);

    await Promise.all([
      saveMessage(userId, conversationId, "user", message),
      saveMessage(userId, conversationId, "assistant", aiResponse),
    ]);

    const totalMessages = recentMessages.length + 2;
    if (totalMessages % 10 === 0) {
      const updatedMessages = [
        ...recentMessages,
        { role: "user", content: message },
        { role: "assistant", content: aiResponse },
      ];
      updatePersonalityProfile(userId, updatedMessages).catch(console.warn);
    }
  } catch (err) {
    console.error("Chat route error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  }
});

router.get("/history", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("id, role, content, flagged, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(50);

    if (error) throw error;
    res.json({ messages: data || [] });
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ error: "Could not fetch history." });
  }
});

async function flagMessage(userId, content) {
  try {
    await supabase.from("messages").insert({ user_id: userId, role: "user", content, flagged: true });
  } catch (err) {
    console.warn("Failed to flag message:", err.message);
  }
}

export default router;