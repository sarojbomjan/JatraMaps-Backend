// profileController.js
const { UserModel } = require("../models/usermodel");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    // Exclude sensitive fields
    const user = await UserModel.findById(req.user._id).select(
      "-password -verificationCode -verificationCodeExpires -__v"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email", "bio"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: "Invalid updates!",
      });
    }

    const user = await UserModel.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password -verificationCode -verificationCodeExpires -__v");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new password are required",
      });
    }

    const user = await UserModel.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
