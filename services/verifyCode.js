const { generateTokens } = require("../controller/userController");
const { UserModel } = require("../models/usermodel");
const { sendVerificationEmail } = require("./emailService");

const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await UserModel.findOneAndUpdate(
      {
        email,
        verificationCode: code,
        verificationCodeExpires: { $gt: Date.now() },
        isVerified: false,
      },
      {
        $set: { isVerified: true },
        $unset: {
          verificationCode: 1,
          verificationCodeExpires: 1,
          verificationToken: 1,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid/expired code or already verified",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    return res.status(200).json({
      success: true,
      message: "Email verified!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Verification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }

    // Generate new code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user.email, verificationCode);

    res.status(200).json({
      success: true,
      message: "Verification code resent successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to resend code",
      error: err.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    // Find the user with the matching verification token
    const user = await UserModel.findOne({ verificationToken });
    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    // Activate the user and remove the verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      message: "Error verifying email",
      error: error.message,
    });
  }
};

module.exports = {
  verifyCode,
  resendVerification,
  verifyEmail,
};
