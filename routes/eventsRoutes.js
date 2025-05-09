const express = require("express");
const eventRouter = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const auth = require("../middleware/authMiddleware");
const commentController = require("../controller/commentController");
const {
  createEvent,
  getUpcomingEvents,
  getPastEvents,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  approveEvent,
} = require("../controller/eventController");

const assetsDir = path.join(__dirname, "../assets/events");
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: assetsDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Event routes
eventRouter.post("/", upload.single("image"), createEvent);
eventRouter.get("/upcoming", getUpcomingEvents);
eventRouter.get("/past", getPastEvents);
eventRouter.get("/", getAllEvents);
eventRouter.get("/:id", getEventById);
eventRouter.put("/:id", upload.single("image"), updateEvent);
eventRouter.delete("/:id", deleteEvent);
eventRouter.patch("/:id/approve", approveEvent);

// Comment routes
eventRouter.post("/:id/comments", auth, commentController.addComment);
eventRouter.get("/:id/comments", auth, commentController.getComments);

module.exports = { eventRouter };
