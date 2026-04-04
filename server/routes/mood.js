import express from "express";
import supabase from "../db/supabase.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { score, label, note } = req.body;
  const userId = req.user.id;

  if (!score || typeof score !== "number" || score < 1 || score > 5) {
    return res.status(400).json({ error: "Score must be a number between 1 and 5." });
  }

  try {
    const { data, error } = await supabase
      .from("moods")
      .insert({ user_id: userId, score, label: label || null, note: note || null })
      .select("id, score, label, note, created_at")
      .single();

    if (error) throw error;
    res.status(201).json({ mood: data });
  } catch (err) {
    console.error("Mood log error:", err);
    res.status(500).json({ error: "Could not save mood." });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const limit = Math.min(parseInt(req.query.limit) || 30, 90);

  try {
    const { data, error } = await supabase
      .from("moods")
      .select("id, score, label, note, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json({ moods: data || [] });
  } catch (err) {
    console.error("Mood fetch error:", err);
    res.status(500).json({ error: "Could not fetch mood history." });
  }
});

router.get("/summary", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const { data, error } = await supabase
      .from("moods")
      .select("score, label, created_at")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const byDay = {};
    for (const entry of data || []) {
      const day = entry.created_at.split("T")[0];
      if (!byDay[day]) byDay[day] = { scores: [], labels: [] };
      byDay[day].scores.push(entry.score);
      if (entry.label) byDay[day].labels.push(entry.label);
    }

    const summary = Object.entries(byDay).map(([date, { scores, labels }]) => ({
      date,
      avg: parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)),
      count: scores.length,
      dominantLabel: labels[0] || null,
    }));

    res.json({ summary });
  } catch (err) {
    console.error("Mood summary error:", err);
    res.status(500).json({ error: "Could not fetch mood summary." });
  }
});

export default router;