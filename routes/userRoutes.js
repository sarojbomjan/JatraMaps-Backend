const express = require("express");
const userRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers
} = require("../controller/userController");

// Routes
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.get("/users", getAllUsers)

module.exports = {
  userRouter
};
