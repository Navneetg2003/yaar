import supabase from "../db/supabase.js";
import { getYaarResponse } from "./ai.js";

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

export async function updatePersonalityProfile(userId, recentMessages) {
  if (!recentMessages || recentMessages.length < 5) return;

  const userMessages = recentMessages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n---\n");

  const prompt = `Analyse these messages from a user and extract their communication personality.
Return ONLY a valid JSON object with exactly these 4 fields, nothing else:

{
  "language_style": "one sentence describing their language mix and formality",
  "humour_type": "one sentence describing their humour style",
  "emotional_pattern": "one sentence describing how they express emotions",
  "response_pref": "one sentence on what kind of responses they prefer"
}

User messages:
${userMessages}`;

  try {
    const raw = await getYaarResponse(prompt, null, []);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const profile = JSON.parse(cleaned);

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
    console.log(`Personality updated for user ${userId}`);
  } catch (err) {
    console.warn("Personality update failed:", err.message);
  }
}