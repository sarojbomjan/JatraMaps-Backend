const express = require("express");
const userRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  banUser,
  unbanUser,
  changePassword,
} = require("../controller/userController");

// Routes
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.get("/users", getAllUsers);
userRouter.get("/banUser", banUser);
userRouter.get("/unbanUser", unbanUser);
userRouter.put("/changePassword", authMiddleware, changePassword);

module.exports = {
  userRouter,
};
