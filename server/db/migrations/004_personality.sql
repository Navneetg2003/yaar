-- 004_personality.sql
CREATE TABLE IF NOT EXISTS personality_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  language_style TEXT,
  humour_type TEXT,
  emotional_pattern TEXT,
  response_pref TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);