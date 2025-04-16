const Event = require("../models/eventmodel");

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

    // Save the parent event document
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

    comment.text = text; // ✅ Update comment text
    await event.save(); // ✅ Save to DB

    res.status(200).json({ message: "Comment text updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update comment text",
      error: error.message,
    });
  }
};
