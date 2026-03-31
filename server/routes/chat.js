import express from "express";
import { crisisCheck, getCrisisResponse } from "../services/crisis.js";
import { streamYaarResponse } from "../services/ai.js";
import { getRecentMessages, saveMessage, getOrCreateConversation } from "../services/memory.js";
import { getPersonalityProfile, updatePersonalityProfile } from "../services/personality.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// POST /api/chat/message
// Main chat route — streams Yaar's response back token by token
router.post("/message", authMiddleware, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  // ── Step 1: Crisis check — always first, never skipped ──────
  if (crisisCheck(message)) {
    // Log flagged message to DB (fire and forget)
    supabaseFlagMessage(userId, message);

    return res.json({
      response: getCrisisResponse(),
      flagged: true,
    });
  }

  try {
    // ── Step 2: Fetch context in parallel ────────────────────
    const [recentMessages, personalityProfile, conversationId] = await Promise.all([
      getRecentMessages(userId),
      getPersonalityProfile(userId),
      getOrCreateConversation(userId),
    ]);

    // ── Step 3: Stream AI response ───────────────────────────
    const aiResponse = await streamYaarResponse(
      message,
      personalityProfile,
      recentMessages,
      res
    );

    // ── Step 4: Save both messages after stream completes ────
    await Promise.all([
      saveMessage(userId, conversationId, "user", message),
      saveMessage(userId, conversationId, "assistant", aiResponse),
    ]);

    // ── Step 5: Trigger personality update every 10 messages ─
    const totalMessages = recentMessages.length + 2;
    if (totalMessages % 10 === 0) {
      const updatedMessages = [...recentMessages,
        { role: "user", content: message },
        { role: "assistant", content: aiResponse },
      ];
      // Fire and forget — don't await, don't block the response
      updatePersonalityProfile(userId, updatedMessages).catch(console.warn);
    }

  } catch (err) {
    console.error("Chat route error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  }
});

// GET /api/chat/history
// Returns last 50 messages for the current user
router.get("/history", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const messages = await getRecentMessages(userId);
    res.json({ messages });
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ error: "Could not fetch history." });
  }
});

// ─── Helpers ──────────────────────────────────────────────────
import supabase from "../db/supabase.js";

async function supabaseFlagMessage(userId, content) {
  try {
    await supabase.from("messages").insert({
      user_id: userId,
      role: "user",
      content,
      flagged: true,
    });
  } catch (err) {
    console.warn("Failed to flag message:", err.message);
  }
}

export default router;