const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
      username: String,
      email: { type: String, unique: true },
      password: String,
      isBanned: { type: Boolean, default: false },
        role: { 
            type: String, 
            enum: ['customer', 'admin', 'moderator'], // Allowed roles
            default: 'customer'        // Default role
        }
    },
    {
        versionKey: false,
    }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = {
    UserModel,
};