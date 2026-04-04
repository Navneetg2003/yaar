import express from "express";
import supabase from "../db/supabase.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const date = req.query.date || new Date().toISOString().split("T")[0];

  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("id, content, entry_date, updated_at")
      .eq("user_id", userId)
      .eq("entry_date", date)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    res.json({ entry: data || null });
  } catch (err) {
    console.error("Journal fetch error:", err);
    res.status(500).json({ error: "Could not fetch journal entry." });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { content, date } = req.body;
  const entry_date = date || new Date().toISOString().split("T")[0];

  if (typeof content !== "string") {
    return res.status(400).json({ error: "Content must be a string." });
  }

  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .upsert(
        { user_id: userId, content, entry_date, updated_at: new Date().toISOString() },
        { onConflict: "user_id,entry_date" }
      )
      .select("id, content, entry_date, updated_at")
      .single();

    if (error) throw error;
    res.json({ entry: data });
  } catch (err) {
    console.error("Journal save error:", err);
    res.status(500).json({ error: "Could not save journal entry." });
  }
});

router.get("/dates", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("entry_date")
      .eq("user_id", userId)
      .order("entry_date", { ascending: false });

    if (error) throw error;
    res.json({ dates: (data || []).map((r) => r.entry_date) });
  } catch (err) {
    console.error("Journal dates error:", err);
    res.status(500).json({ error: "Could not fetch journal dates." });
  }
});

export default router;