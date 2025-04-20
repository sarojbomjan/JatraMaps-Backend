const express = require("express");
const commentRouter = express.Router();
const modcommentController = require("../controller/modcommentController");
const authMiddleware = require("../middleware/authMiddleware");
const commentController = require("../controller/commentController");

commentRouter.get(
  "/moderation",
  modcommentController.getAllCommentsForModeration
);
commentRouter.put("/status/:id", modcommentController.updateCommentStatus);
commentRouter.put("/:id/edit", modcommentController.editCommentText);
commentRouter.delete("/:id/delete", modcommentController.deleteComment);
commentRouter.put("/ban/:userId", modcommentController.banUser);
commentRouter.post(
  "/:id/comments",
  authMiddleware,
  commentController.addComment
);
commentRouter.put("/unban/:userId", modcommentController.unbanUser);

module.exports = { commentRouter };
