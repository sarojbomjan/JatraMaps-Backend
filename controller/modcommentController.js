const Event = require("../models/eventmodel");
const { UserModel } = require("../models/usermodel");
const { default: mongoose } = require("mongoose");

// GET /comments/moderation
exports.getAllCommentsForModeration = async (req, res) => {
  try {
    const events = await Event.find()
      .select("title comments")
      .populate("comments.user", "username avatar");

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events or comments found." });
    }

    const allComments = events.flatMap((event) =>
      event.comments.map((comment) => ({
        _commentid: comment._id,
        user: comment.user?.username || "Unknown User",
        userId: comment.user?._id || null,
        text: comment.text,
        status: comment.status || "Pending",
        eventTitle: event.title || "Untitled Event",
        eventId: event._id,
      }))
    );

    res.status(200).json(allComments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching comments",
      error: error.message,
    });
  }
};

//Update the comment
exports.updateCommentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const event = await Event.findOne({ "comments._id": id });
    if (!event) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Find the specific comment inside the comments array
    const comment = event.comments.id(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found in event" });
    }

    // Update the status
    comment.status = status;
    await event.save();

    res.status(200).json({ message: `Comment status updated to ${status}` });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update comment status",
      error: error.message,
    });
  }
};

// PUT /comments/:id/edit
exports.editCommentText = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const event = await Event.findOne({ "comments._id": id });
    if (!event) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = event.comments.id(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found in event" });
    }

    comment.text = text;
    await event.save();

    res.status(200).json({ message: "Comment text updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update comment text",
      error: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findOne({ "comments._id": id });
    if (!event) {
      return res.status(404).json({ message: "Comment not found" });
    }

    event.comments = event.comments.filter(
      (comment) => comment._id.toString() !== id
    );
    await event.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

exports.banUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = true;
    await user.save();

    await Event.updateMany(
      { "comments.user": userId },
      { $set: { "comments.$[elem].status": "Banned" } },
      { arrayFilters: [{ "elem.user": userId }] }
    );

    res.status(200).json({ message: "User banned and comments updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to ban user", error: error.message });
  }
};

exports.unbanUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = !user.isBanned;
    await user.save();

    const newStatus = user.isBanned ? "Banned" : "Pending";

    await Event.updateMany(
      { "comments.user": userId },
      { $set: { "comments.$[elem].status": newStatus } },
      { arrayFilters: [{ "elem.user": userId }] }
    );

    res.status(200).json({
      message: user.isBanned
        ? "User banned and comments updated"
        : "User unbanned and comments updated",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to toggle ban", error: error.message });
  }
};
