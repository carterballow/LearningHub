const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/Users");

// ✅ add this
const { seedDefaultsAndAssignToUser } = require("../seed/seedForNewUsers");

const router = express.Router();

function mustHaveJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing. Check your backend .env and dotenv config.");
  }
  return process.env.JWT_SECRET;
}

function signToken(userId, jwtSecret) {
  return jwt.sign({ sub: userId }, jwtSecret, { expiresIn: "7d" });
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // localhost
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/", // good practice
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

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
    if (password.length < 8) return res.status(400).json({ error: "Password must be 8+ chars" });

    const emailLower = email.toLowerCase();

    const isUCLA = emailLower.endsWith("@ucla.edu") || emailLower.endsWith("@g.ucla.edu");
    if (!isUCLA) return res.status(400).json({ message: "Must use a UCLA email address" });

    const existing = await User.findOne({ email: emailLower });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);

    // ✅ create the user
    const user = await User.create({ name, email: emailLower, passwordHash });

    // ✅ seed defaults + assign 4 courses + 12-per-course templates + userAssignments
    // This is the whole “give them 4 courses and 48 assignments” behavior.
    await seedDefaultsAndAssignToUser(user);

    // ✅ login them immediately
    const jwtSecret = mustHaveJwtSecret();
    const token = signToken(user._id.toString(), jwtSecret);
    setAuthCookie(res, token);

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // (Optional) If you want “legacy users” to get seeded when they first log in:
    // await seedDefaultsAndAssignToUser(user);

    const jwtSecret = mustHaveJwtSecret();
    const token = signToken(user._id.toString(), jwtSecret);
    setAuthCookie(res, token);

    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    const jwtSecret = mustHaveJwtSecret();
    const userId = readUserIdFromCookie(req, jwtSecret);
    if (!userId) return res.status(401).json({ user: null });

    const user = await User.findById(userId).select("_id name email");
    if (!user) return res.status(401).json({ user: null });

    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ user: null });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production with HTTPS
  });
  res.json({ message: "Logged out" });
});


module.exports = router;
