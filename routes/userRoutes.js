const express = require("express");
const userRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  verifyCode,
  resendVerification,
  verifyEmail,
} = require("../services/verifyCode");
const {
  register,
  login,
  getAllUsers,
  banUser,
  unbanUser,
} = require("../controller/userController");
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controller/profileController");

// Routes
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/verify", verifyCode);
userRouter.post("/resend-verification", resendVerification);

userRouter.get("/profile", authMiddleware, getProfile);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.get("/users", getAllUsers);
userRouter.get("/banUser", banUser);
userRouter.get("/unbanUser", unbanUser);
userRouter.put("/changePassword", authMiddleware, changePassword);

module.exports = {
  userRouter,
};
