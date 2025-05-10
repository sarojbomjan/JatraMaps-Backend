const mongoose = require("mongoose");
const Event = require("../models/eventmodel");
const { UserModel } = require("../models/usermodel");

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    //  Checks if the user is banned from commenting
    if (user.commentStatus === "Banned") {
      return res
        .status(403)
        .json({ message: "You are banned from commenting." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { $push: { comments: { user: userId, text } } },
      { new: true }
    ).populate("comments.user", "name avatar");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const newComment = event.comments[event.comments.length - 1];
    return res.status(201).json(newComment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id)
      .select("comments")
      .populate("comments.user", "username");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
      comments: event.comments || [],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};
