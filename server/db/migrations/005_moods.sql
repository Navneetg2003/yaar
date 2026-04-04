CREATE TABLE IF NOT EXISTS moods (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  score      INTEGER CHECK (score BETWEEN 1 AND 5),
  label      TEXT,
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);