import jwt from "jsonwebtoken";

/**
 * Authentication middleware — verifies JWT bearer token
 * Expects: Authorization: Bearer <token>
 * Attaches: req.user = { id: userId }
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided. Please include Authorization: Bearer <token> header." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid or malformed token." });
  }
}
