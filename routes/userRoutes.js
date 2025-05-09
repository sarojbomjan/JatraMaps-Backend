const express = require("express");
const userRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { verifyCode, resendVerification } = require("../services/verifyCode");
const {
  register,
  login,
  getAllUsers,
} = require("../controller/userController");
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controller/profileController");

// Routes
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/verify", verifyCode);
userRouter.post("/resend-verification", resendVerification);

userRouter.get("/profile", authMiddleware, getProfile);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.get("/users", getAllUsers);
userRouter.put("/changePassword", authMiddleware, changePassword);
userRouter.delete("/deleteAccount", authMiddleware, deleteAccount);

module.exports = {
  userRouter,
};
