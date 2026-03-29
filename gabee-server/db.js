const Database = require("better-sqlite3");

// This creates a file called gabee.db in your server folder
// Think of it like an Excel file that lives on your computer
const db = new Database("gabee.db");

// This makes queries faster by enabling WAL mode
// (Write-Ahead Logging — just a SQLite performance setting)
db.pragma("journal_mode = WAL");

// Create all our tables if they don't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS home_brews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    bean_name TEXT,
    origin TEXT,
    roast_level TEXT,
    grind_setting REAL,
    dose_in REAL,
    yield_out REAL,
    brew_time INTEGER,
    rating INTEGER,
    notes TEXT,
    caffeine_mg REAL,
    brewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS outside_drinks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    place_name TEXT,
    drink_type TEXT,
    drink_size TEXT,
    caffeine_mg REAL,
    notes TEXT,
    drank_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

module.exports = db;