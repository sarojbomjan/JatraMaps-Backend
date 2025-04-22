const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/usermodel");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../services/emailService");

// Constants
const ACCESS_TOKEN_EXPIRY = "24h";
const REFRESH_TOKEN_EXPIRY = "7d";
const JWT_SECRET = process.env.JWT_SECRET_KEY || "fallbacksecret";

// Helper function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

// POST /register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    if (await UserModel.findOne({ email })) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Create user
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await UserModel.create({
      username,
      email,
      password: await bcrypt.hash(password, 12),
      verificationCode,
      verificationCodeExpires: Date.now() + 30 * 60 * 1000, // 30 mins
    });

    // Send verification email
    await sendVerificationEmail(user.email, verificationCode);

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for verification code.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User with this email doesn't exist",
      });
    }

    // Check if banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "This account has been banned",
      });
    }

    // Check password
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Return responsee
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");

    if (users.length === 0) {
      return res.status(404).json({ message: "No Users Found" });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

// Ban user
const banUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { isBanned: true });
    res.json({ message: `User ${req.params.userId} has been banned` });
  } catch (error) {
    res.status(500).json({ message: "Error banning user" });
  }
};

//UnBan user
const unbanUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { isBanned: false });
    res.json({ message: `User ${req.params.userId} has been unbanned` });
  } catch (error) {
    res.status(500).json({ message: "Error unbanning user" });
  }
};

// change password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  generateTokens,
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  banUser,
  unbanUser,
  changePassword,
};
