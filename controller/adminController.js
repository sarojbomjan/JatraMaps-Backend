const { UserModel } = require("../models/usermodel");

exports.banUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { isBanned: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User banned successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error banning user",
      error: error.message,
    });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { isBanned: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User unbanned successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error unbanning user",
      error: error.message,
    });
  }
};
