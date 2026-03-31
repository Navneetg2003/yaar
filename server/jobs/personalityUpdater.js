import supabase from "../db/supabase.js";
import { updatePersonalityProfile } from "../services/personality.js";

/**
 * Background job: scans users who have messages since their last
 * personality update and re-runs extraction for each one.
 *
 * Decoupled from the chat route — can be run on a cron schedule (e.g. hourly).
 * Usage: import and call runPersonalityUpdater() from index.js or a cron.
 */
export async function runPersonalityUpdater() {
  console.log("[PersonalityUpdater] Starting run...");

  try {
    // Find non-anonymous users whose personality profile is stale (24h+) or missing
    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id,
        personality_profiles (updated_at)
      `)
      .eq("is_anonymous", false);

    if (error) throw error;

    const staleUsers = users.filter((user) => {
      const profile = user.personality_profiles?.[0];
      if (!profile) return true; // No profile yet
      const updatedAt = new Date(profile.updated_at);
      const hoursSince = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60);
      return hoursSince >= 24;
    });

    console.log(`[PersonalityUpdater] Found ${staleUsers.length} users to update.`);

    for (const user of staleUsers) {
      try {
        const { data: messages, error: msgError } = await supabase
          .from("messages")
          .select("role, content")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);

        if (msgError || !messages || messages.length < 5) continue;

        await updatePersonalityProfile(user.id, messages.reverse());
        console.log(`[PersonalityUpdater] Updated profile for user ${user.id}`);

        // Small delay between users to avoid hammering the Groq API
        await sleep(500);
      } catch (err) {
        console.warn(`[PersonalityUpdater] Failed for user ${user.id}:`, err.message);
      }
    }

    console.log("[PersonalityUpdater] Run complete.");
  } catch (err) {
    console.error("[PersonalityUpdater] Job failed:", err.message);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}