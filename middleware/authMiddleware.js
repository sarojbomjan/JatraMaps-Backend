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

    // Check if user exists
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Allow access to /profile even if banned
    if (user.isBanned && req.originalUrl !== "/profile") {
      return res.status(403).json({
        success: false,
        message: "Your account has been banned from commenting",
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
