const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const brewRoutes = require("./routes/brews");

// Loads your .env file so process.env.PORT etc work
dotenv.config();

const app = express();

// Lets your React app (running on port 5173) talk to this server
app.use(cors({ origin: "http://localhost:5173" }));

// Lets the server understand JSON request bodies
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/brews", brewRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "GABEE server is running ☕" });
});

// Start listening for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`GABEE server running on port ${PORT}`);
});