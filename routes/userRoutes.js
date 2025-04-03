const express = require("express")
const router = express.Router()
const { banUser, unbanUser } = require("../controllers/userController");

router.put("/:userId/ban", banUser);
router.put("/:userId/unban", unbanUser);

module.exports = router;