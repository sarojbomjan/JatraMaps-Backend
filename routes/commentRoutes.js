const express = require("express");
const router = express.Router();
const modcommentController = require("../controller/modcommentController");

router.get("/moderation", modcommentController.getAllCommentsForModeration);
router.put("/status/:id", modcommentController.updateCommentStatus);
router.put("/:id/edit", modcommentController.editCommentText);

module.exports = router;
