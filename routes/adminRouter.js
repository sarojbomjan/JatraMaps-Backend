const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.get("/dashboard", authMiddleware, adminOnly, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard", user: req.user });
});

module.exports = router;
