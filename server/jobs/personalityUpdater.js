import supabase from "../db/supabase.js";
import { updatePersonalityProfile } from "../services/personality.js";

export async function runForUser(userId) {
  try {
    const { data: messages, error } = await supabase
      .from("messages")
      .select("role, content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    if (!messages || messages.length < 5) return;

    await updatePersonalityProfile(userId, messages.reverse());
  } catch (err) {
    console.warn(`Personality update failed for user ${userId}:`, err.message);
  }
}

export async function runPersonalityUpdateJob() {
  console.log("[PersonalityUpdater] Starting batch job...");

  try {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

    const { data: recentlyUpdated } = await supabase
      .from("personality_profiles")
      .select("user_id")
      .gte("updated_at", sixHoursAgo);

    const skipIds = (recentlyUpdated || []).map((r) => r.user_id);

    let query = supabase.from("users").select("id");
    if (skipIds.length > 0) query = query.not("id", "in", `(${skipIds.join(",")})`);

    const { data: users, error } = await query;
    if (error) throw error;
    if (!users?.length) return console.log("[PersonalityUpdater] Nothing to update.");

    for (const user of users) {
      await runForUser(user.id);
      await new Promise((r) => setTimeout(r, 500));
    }

    console.log(`[PersonalityUpdater] Updated ${users.length} profiles.`);
  } catch (err) {
    console.error("[PersonalityUpdater] Batch job failed:", err.message);
  }
}