const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {UserModel } = require("../models/usermodel");
const userRouter = express.Router();

// Register
userRouter.post("/register", async (req, res) => {
  try {
      const { name, email, password } = req.body;

      // check if user exists
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
      }

      // hash password
      const hashPassword = await bcrypt.hash(password, 10);

      // create new user
      const newUser = new UserModel({
          username: name,
          email,
          password: hashPassword
      });

      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
          { id: newUser._id }, 
          process.env.JWT_SECRET || "fallbacksecret", // Add proper secret in .env
          { expiresIn: "1h" }
      );

      res.status(201).json({ 
          message: "User created successfully",
          token,
          user: {
              id: newUser._id,
              username: newUser.username,
              email: newUser.email
          }
      });
  } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
          message: "Error registering user",
          error: error.message 
      });
  }
});


// login

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
  
          const token = jwt.sign(
            { userId: user._id, user: user.name, role: user.role },
            "secretkey",
            {
              expiresIn: "7d",
            }
          );
          const rToken = jwt.sign(
            { userId: user._id, user: user.name },
            "secretkey",
            {
              expiresIn: "24d",
            }
          );
          if (result) {
            res
              .status(202)
              .json({ msg: "User LogIn Success", token, rToken, user });
          } else {
            res.status(401).json({ msg: "invalid credentials" });
          }
        });
      } else {
        res.status(404).json({ msg: "user does not exit. Signup first!!" });
      }
    } catch (error) {
      res.status(400).json({ err: error.message });
    }
  });
  
  module.exports = {
    userRouter
  };