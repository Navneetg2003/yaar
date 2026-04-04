import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../db/supabase.js";
import { authRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();
const TOKEN_EXPIRY = "30d";

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

router.post("/register", authRateLimit, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required." });
  if (password.length < 6) return res.status(400).json({ error: "Password must be 6+ characters." });

  try {
    const { data: existing } = await supabase.from("users").select("id").eq("email", email).single();
    if (existing) return res.status(409).json({ error: "An account with this email already exists." });

    const password_hash = await bcrypt.hash(password, 12);
    const { data: user, error } = await supabase
      .from("users").insert({ email, password_hash }).select("id, email").single();

    if (error) throw error;
    res.status(201).json({ token: signToken(user.id), user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Could not create account." });
  }
});

router.post("/login", authRateLimit, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required." });

  try {
    const { data: user, error } = await supabase
      .from("users").select("id, email, password_hash").eq("email", email).single();

    if (error || !user) return res.status(401).json({ error: "Invalid email or password." });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid email or password." });

    await supabase.from("users").update({ last_active: new Date().toISOString() }).eq("id", user.id);
    res.json({ token: signToken(user.id), user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed." });
  }
});

router.post("/anonymous", authRateLimit, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users").insert({ is_anonymous: true }).select("id").single();
    if (error) throw error;
    res.status(201).json({ token: signToken(user.id), user: { id: user.id, isAnonymous: true } });
  } catch (err) {
    console.error("Anonymous error:", err);
    res.status(500).json({ error: "Could not create guest session." });
  }
});

router.post("/convert", async (req, res) => {
  const { email, password } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "No token." });
  if (!email || !password) return res.status(400).json({ error: "Email and password required." });

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    const { data: user } = await supabase.from("users").select("is_anonymous").eq("id", decoded.id).single();
    if (!user?.is_anonymous) return res.status(400).json({ error: "Account already registered." });

    const password_hash = await bcrypt.hash(password, 12);
    const { error } = await supabase
      .from("users").update({ email, password_hash, is_anonymous: false }).eq("id", decoded.id);
    if (error) throw error;
    res.json({ message: "Account created. Chat history preserved." });
  } catch (err) {
    console.error("Convert error:", err);
    res.status(500).json({ error: "Could not convert account." });
  }
});

export default router;