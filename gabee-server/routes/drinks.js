const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// Caffeine estimates in mg by drink type and size
const CAFFEINE_MAP = {
  espresso:       { small: 63,  medium: 63,  large: 126 },
  flat_white:     { small: 130, medium: 130, large: 180 },
  latte:          { small: 63,  medium: 126, large: 189 },
  cappuccino:     { small: 63,  medium: 126, large: 189 },
  long_black:     { small: 126, medium: 126, large: 189 },
  americano:      { small: 63, medium: 126, large: 189 },
  drip_coffee:    { small: 95,  medium: 165, large: 240 },
  cold_brew:      { small: 100, medium: 200, large: 300 },
  matcha_latte:   { small: 35,  medium: 70,  large: 105 },
  energy_drink:   { small: 80,  medium: 160, large: 240 },
  green_tea:      { small: 28,  medium: 45,  large: 60  },
  black_tea:      { small: 47,  medium: 75,  large: 100 },
};

// ───────────────────────────────
// POST /api/drinks
// Log an outside drink
// ───────────────────────────────
router.post("/", auth, (req, res) => {
  const { place_name, drink_type, drink_size, caffeine_mg, notes } = req.body;

  // Auto-estimate caffeine if not provided manually
  let caffeine = caffeine_mg;
  if (!caffeine && drink_type && drink_size) {
    const drinkData = CAFFEINE_MAP[drink_type];
    caffeine = drinkData ? drinkData[drink_size] : null;
  }

  const result = db
    .prepare(
      `INSERT INTO outside_drinks 
        (user_id, place_name, drink_type, drink_size, caffeine_mg, notes)
        VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(req.userId, place_name, drink_type, drink_size, caffeine, notes);

  res.status(201).json({
    id: result.lastInsertRowid,
    caffeine_mg: caffeine,
    message: caffeine
      ? `Logged! ~${caffeine}mg of caffeine added ☕`
      : "Logged! Add caffeine manually if you know it.",
  });
});

// ───────────────────────────────
// GET /api/drinks
// Get all your outside drinks
// ───────────────────────────────
router.get("/", auth, (req, res) => {
  const drinks = db
    .prepare(
      "SELECT * FROM outside_drinks WHERE user_id = ? ORDER BY drank_at DESC"
    )
    .all(req.userId);

  res.json(drinks);
});

module.exports = router;