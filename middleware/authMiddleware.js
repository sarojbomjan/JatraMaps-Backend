const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/usermodel");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "fallbacksecret"
    );

    // Check if user exists and isn't banned
    const user = await UserModel.findById(decoded.userId);
    if (!user || user.isBanned) {
      return res.status(401).json({
        success: false,
        message: user ? "Account suspended" : "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

module.exports = verifyToken;
