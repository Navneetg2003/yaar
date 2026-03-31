import { rateLimit, MemoryStore, ipKeyGenerator } from "express-rate-limit";

/**
 * Stricter rate limiter for the chat endpoint specifically.
 * Limits each user to 30 messages per 10 minutes.
 * This is on top of the global 100 req/15min limiter in index.js.
 */
export const chatRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30,
  // Rate limit per user ID if authenticated, fallback to IP with proper IPv6 handling
  keyGenerator: (req) => {
    if (req.user?.id) return req.user.id;
    return ipKeyGenerator(req);
  },
  store: new MemoryStore(),
  message: { error: "You're sending messages too fast. Take a breath and try again in a bit." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for auth endpoints (login / register).
 * Limits to 10 attempts per 15 minutes per IP.
 * Prevents brute-force attacks.
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  store: new MemoryStore(),
  message: { error: "Too many attempts. Please wait 15 minutes before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});