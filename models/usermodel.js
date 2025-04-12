const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
      username: String,
      email: { type: String, unique: true },
      password: String,
      isBanned: { type: Boolean, default: false },
        role: { 
            type: String, 
            enum: ['customer', 'admin', 'moderator'],
            default: 'customer'       
        }
    },
    {
        versionKey: false,
    }
);

const UserModel = mongoose.model("users", userSchema);

module.exports = {
    UserModel,
};