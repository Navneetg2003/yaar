import redis from "../db/redis.js";
import supabase from "../db/supabase.js";

const RECENT_MSG_COUNT = 12;
const REDIS_TTL = 60 * 60 * 24; // 24 hours

/**
 * Get recent messages for a user.
 * Tries Redis first (fast), falls back to Postgres (reliable).
 */
export async function getRecentMessages(userId) {
  const key = `messages:${userId}`;

  try {
    const cached = await redis.get(key);
    if (cached) return cached;
  } catch (err) {
    console.warn("Redis read failed, falling back to Postgres:", err.message);
  }

  // Fallback: fetch from Postgres
  const { data, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(RECENT_MSG_COUNT);

  if (error) throw new Error("Failed to fetch messages: " + error.message);

  const messages = (data || []).reverse();

  // Repopulate Redis cache
  try {
    await redis.set(key, messages, { ex: REDIS_TTL });
  } catch (err) {
    console.warn("Redis write failed:", err.message);
  }

  return messages;
}

/**
 * Save a message to Postgres and update Redis cache.
 */
export async function saveMessage(userId, conversationId, role, content) {
  // Save to Postgres
  const { error } = await supabase
    .from("messages")
    .insert({ user_id: userId, conversation_id: conversationId, role, content });

  if (error) throw new Error("Failed to save message: " + error.message);

  // Update Redis cache
  try {
    const key = `messages:${userId}`;
    const cached = await redis.get(key) || [];
    const updated = [...cached, { role, content }].slice(-RECENT_MSG_COUNT);
    await redis.set(key, updated, { ex: REDIS_TTL });
  } catch (err) {
    console.warn("Redis cache update failed:", err.message);
  }
}

/**
 * Get or create a conversation for today.
 */
export async function getOrCreateConversation(userId) {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", userId)
    .gte("started_at", today)
    .single();

  if (existing) return existing.id;

  const { data: newConv, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (error) throw new Error("Failed to create conversation: " + error.message);
  return newConv.id;
}