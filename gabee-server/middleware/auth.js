const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get the token from the request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's ID to the request so routes can use it
    req.userId = decoded.userId;

    // Move on to the actual route
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};