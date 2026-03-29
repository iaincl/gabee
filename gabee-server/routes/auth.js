const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// ───────────────────────────────
// POST /api/auth/register
// Creates a new user account
// ───────────────────────────────
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters" });

  // Check if email already exists
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing)
    return res.status(400).json({ error: "Email already registered" });

  // Hash the password before saving — NEVER store plain text passwords
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert new user into database
  const result = db
    .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
    .run(email, hashedPassword);

  // Create a JWT token so they're logged in immediately after registering
  const token = jwt.sign(
    { userId: result.lastInsertRowid },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({ token });
});

// ───────────────────────────────
// POST /api/auth/login
// Logs in an existing user
// ───────────────────────────────
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  // Find user by email
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user)
    return res.status(401).json({ error: "Invalid email or password" });

  // Compare entered password against the stored hash
  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword)
    return res.status(401).json({ error: "Invalid email or password" });

  // Create a JWT token valid for 7 days
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

module.exports = router;