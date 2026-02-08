const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/Users");

const router = express.Router();

function signToken(userId, jwtSecret) {
  return jwt.sign({ sub: userId }, jwtSecret, { expiresIn: "7d" });
}

function setAuthCookie(res, token) {
  // For local dev on http://localhost you can keep secure: false.
  // In production (https) set secure: true and sameSite: "none" if cross-site.
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function readUserIdFromCookie(req, jwtSecret) {
  const token = req.cookies?.token;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, jwtSecret);
    return payload.sub;
  } catch {
    return null;
  }
}

// POST api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  if (password.length < 8) return res.status(400).json({ error: "Password must be 8+ chars" });

  const isUCLA =
    email.endsWith("@ucla.edu") ||
    email.endsWith("@g.ucla.edu")

  if (!isUCLA) {
    return res.status(400).json({ message: "Must use a UCLA email address" })
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken(user._id.toString(), process.env.JWT_SECRET);
  setAuthCookie(res, token);

  res.json({ user: { id: user._id, name: user.name, email: user.email } });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user._id.toString(), process.env.JWT_SECRET);
  setAuthCookie(res, token);

  res.json({ user: { id: user._id, name: user.name, email: user.email } });
});

// GET /auth/me
router.get("/me", async (req, res) => {
  const userId = readUserIdFromCookie(req, process.env.JWT_SECRET);
  if (!userId) return res.status(401).json({ user: null });

  const user = await User.findById(userId).select("_id name email");
  if (!user) return res.status(401).json({ user: null });

  res.json({ user: { id: user._id, name: user.name, email: user.email } });
});

module.exports = router;
