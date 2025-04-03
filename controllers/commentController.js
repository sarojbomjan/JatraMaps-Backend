const Comment = require("../models/commentmodel")

// Get all comments
exports.getComments = async (req, res) => {
    try {
      const comments = await Comment.find();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  // Approve comment
  exports.approveComment = async (req, res) => {
    try {
      await Comment.findByIdAndUpdate(req.params.id, { status: "Approved" });
      res.json({ message: "Comment approved" });
    } catch (error) {
      res.status(500).json({ message: "Error approving comment" });
    }
  };
  
  // Edit comment
  exports.editComment = async (req, res) => {
    try {
      await Comment.findByIdAndUpdate(req.params.id, { text: req.body.text });
      res.json({ message: "Comment updated" });
    } catch (error) {
      res.status(500).json({ message: "Error updating comment" });
    }
  };
  
  // Delete comment
  exports.deleteComment = async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      res.json({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting comment" });
    }
  };