const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Deleted", "Banned", "Unbanned"], default: "Pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Ensure this is correct
});

module.exports = mongoose.model("Comment", commentSchema);