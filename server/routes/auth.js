import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../db/supabase.js";
import { authRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

// ─── Helper: sign a JWT for a user ────────────────────────────
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

// POST /api/auth/register
// Creates a new account with email + password
router.post("/register", authRateLimit, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert({ email, password_hash, is_anonymous: false })
      .select("id, email")
      .single();

    if (error) throw error;

    const token = signToken(user.id);
    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Could not create account. Please try again." });
  }
});

// POST /api/auth/login
// Logs in with email + password
router.post("/login", authRateLimit, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password_hash")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Update last_active
    await supabase
      .from("users")
      .update({ last_active: new Date().toISOString() })
      .eq("id", user.id);

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// POST /api/auth/anonymous
// Creates a temporary anonymous user — no email or password needed
// Used for "try without signing up" flow
router.post("/anonymous", authRateLimit, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .insert({ is_anonymous: true })
      .select("id")
      .single();

    if (error) throw error;

    const token = signToken(user.id);
    res.status(201).json({ token, user: { id: user.id, isAnonymous: true } });
  } catch (err) {
    console.error("Anonymous auth error:", err);
    res.status(500).json({ error: "Could not create session. Please try again." });
  }
});

// GET /api/auth/me
// Returns current user info from token — useful for frontend session restore
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, is_anonymous, created_at")
      .eq("id", decoded.id)
      .single();

    if (error || !user) return res.status(404).json({ error: "User not found." });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

export default router;