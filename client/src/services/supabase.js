import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for frontend
 * Currently used mainly for reference, most operations go through the backend API
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase env vars missing — check client/.env");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export default supabase;
