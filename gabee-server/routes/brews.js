const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// All routes here are protected — must be logged in

// ───────────────────────────────
// POST /api/brews
// Log a new home espresso brew
// ───────────────────────────────
router.post("/", auth, (req, res) => {
  const {
    bean_name,
    origin,
    roast_level,
    grind_setting,
    dose_in,
    yield_out,
    brew_time,
    rating,
    notes,
  } = req.body;

  // Auto-calculate caffeine (roughly 60mg per 18g dose, scaled)
  const caffeine_mg = dose_in ? Math.round((dose_in / 18) * 63) : null;

  // Check if ratio is on target (1:2 ratio ± 10% tolerance)
  const ratio = yield_out && dose_in ? yield_out / dose_in : null;
  const ratioStatus =
    ratio === null
      ? "unknown"
      : ratio >= 1.8 && ratio <= 2.2
      ? "on_target"
      : ratio < 1.8
      ? "under_extracted"
      : "over_extracted";

  const result = db
    .prepare(
      `INSERT INTO home_brews 
        (user_id, bean_name, origin, roast_level, grind_setting, dose_in, yield_out, brew_time, rating, notes, caffeine_mg)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.userId,
      bean_name,
      origin,
      roast_level,
      grind_setting,
      dose_in,
      yield_out,
      brew_time,
      rating,
      notes,
      caffeine_mg
    );

  res.status(201).json({
    id: result.lastInsertRowid,
    caffeine_mg,
    ratio: ratio ? ratio.toFixed(2) : null,
    ratioStatus,
    message:
      ratioStatus === "on_target"
        ? "Perfect ratio! ✅"
        : ratioStatus === "under_extracted"
        ? "Under extracted — try a finer grind or longer time ⚠️"
        : "Over extracted — try a coarser grind or shorter time ⚠️",
  });
});

// ───────────────────────────────
// GET /api/brews
// Get all your home brews
// ───────────────────────────────
router.get("/", auth, (req, res) => {
  const brews = db
    .prepare("SELECT * FROM home_brews WHERE user_id = ? ORDER BY brewed_at DESC")
    .all(req.userId);

  res.json(brews);
});

module.exports = router;