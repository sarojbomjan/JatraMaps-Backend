const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Deleted", "Banned"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    image: {
      path: { type: String },
      url: { type: String },
    },
    organizer: { type: String, required: true },
    price: { type: String, default: "Free" },
    status: { type: String, default: "draft" },
    attendees: { type: Number, default: 0 },
    comments: [commentSchema],
  },
  {
    timestamps: true, // This will add createdAt and updatedAt to the main event
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual population for comments' user data
eventSchema.virtual("populatedComments", {
  ref: "Comment",
  localField: "comments._id",
  foreignField: "_id",
});

module.exports = mongoose.model("Event", eventSchema);
