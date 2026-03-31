import supabase from "../db/supabase.js";
import { getYaarResponse } from "./ai.js";

/**
 * Fetch personality profile for a user.
 * Returns null if no profile exists yet (new user).
 */
export async function getPersonalityProfile(userId) {
  const { data, error } = await supabase
    .from("personality_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.warn("Failed to fetch personality profile:", error.message);
  }

  return data || null;
}

/**
 * Analyse recent messages and update the personality profile.
 * Called every 10 messages as a background job.
 */
export async function updatePersonalityProfile(userId, recentMessages) {
  if (!recentMessages || recentMessages.length < 5) return;

  const userMessages = recentMessages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n---\n");

  const extractionPrompt = `Analyse these messages from a user and extract their communication personality.
Return ONLY a valid JSON object with exactly these 4 fields, nothing else:

{
  "language_style": "one sentence describing their language mix and formality (e.g. 'Mostly Hinglish, uses bhai often, informal')",
  "humour_type": "one sentence describing their humour (e.g. 'Self-deprecating, uses dark humour to cope with stress')",
  "emotional_pattern": "one sentence describing how they express emotions (e.g. 'Vents briefly then deflects, needs gentle probing')",
  "response_pref": "one sentence on what kind of responses they prefer (e.g. 'Wants validation first, short replies, not advice unless asked')"
}

User messages to analyse:
${userMessages}`;

  try {
    const raw = await getYaarResponse(extractionPrompt, null, []);

    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const profile = JSON.parse(cleaned);

    // Upsert into Postgres
    const { error } = await supabase
      .from("personality_profiles")
      .upsert(
        {
          user_id: userId,
          language_style: profile.language_style,
          humour_type: profile.humour_type,
          emotional_pattern: profile.emotional_pattern,
          response_pref: profile.response_pref,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) throw error;
    console.log(`Personality profile updated for user ${userId}`);
  } catch (err) {
    console.warn("Personality update failed:", err.message);
    // Non-critical — don't throw, just log
  }
}