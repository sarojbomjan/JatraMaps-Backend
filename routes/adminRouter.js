const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const { banUser, unbanUser } = require("../controller/adminController");

router.get("/dashboard", authMiddleware, adminOnly, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard", user: req.user });
});

router.put("/ban/:userId", authMiddleware, adminOnly, banUser);
router.put("/unban/:userId", authMiddleware, adminOnly, unbanUser);

module.exports = router;
