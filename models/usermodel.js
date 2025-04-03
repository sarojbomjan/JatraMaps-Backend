const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
      username: String,
      email: String,
      password: String,
      isBanned: { type: Boolean, default: false }
    },
    { versionKey: false }
  );

const UserModel = mongoose.model("user", userSchema);

module.exports = {
    UserModel,
};