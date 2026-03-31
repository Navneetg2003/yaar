import express from "express";
import supabase from "../db/supabase.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// POST /api/mood
// Log a mood score (1–5) with an optional note
router.post("/", authMiddleware, async (req, res) => {
  const { score, note } = req.body;
  const userId = req.user.id;

  if (!score || typeof score !== "number" || score < 1 || score > 5) {
    return res.status(400).json({ error: "Score must be a number between 1 and 5." });
  }

  try {
    const { data, error } = await supabase
      .from("moods")
      .insert({
        user_id: userId,
        score,
        note: note?.trim() || null,
      })
      .select("id, score, note, created_at")
      .single();

    if (error) throw error;

    res.status(201).json({ mood: data });
  } catch (err) {
    console.error("Mood log error:", err);
    res.status(500).json({ error: "Could not save mood. Please try again." });
  }
});

// GET /api/mood
// Returns last 30 mood entries for the current user
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("moods")
      .select("id, score, note, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) throw error;

    res.json({ moods: data || [] });
  } catch (err) {
    console.error("Mood fetch error:", err);
    res.status(500).json({ error: "Could not fetch mood history." });
  }
});

// GET /api/mood/summary
// Returns average mood per day for the last 7 days — used for the mood chart
router.get("/summary", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("moods")
      .select("score, created_at")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Group by date and average the scores
    const grouped = {};
    for (const entry of data || []) {
      const day = entry.created_at.split("T")[0];
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(entry.score);
    }

    const summary = Object.entries(grouped).map(([date, scores]) => ({
      date,
      avg: parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)),
      count: scores.length,
    }));

    res.json({ summary });
  } catch (err) {
    console.error("Mood summary error:", err);
    res.status(500).json({ error: "Could not fetch mood summary." });
  }
});

export default router;