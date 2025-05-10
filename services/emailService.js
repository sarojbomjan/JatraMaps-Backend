const nodemailer = require("nodemailer");
require("dotenv").config();
const axios = require("axios");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.verifyEmailWithService = async (email) => {
  try {
    const response = await axios.get(
      `https://api.zerobounce.net/v2/validate?api_key=${process.env.ZEROBOUNCE_API_KEY}&email=${email}`
    );

    console.log("ZeroBounce Response:", response.data);
    return response.data.status === "valid";
  } catch (error) {
    console.error(
      "Email verification failed:",
      error.response?.data || error.message
    );
    return false;
  }
};

exports.sendVerificationEmail = async (email, verificationToken) => {
  const verificationCode = verificationToken;

  const mailOptions = {
    from: '"JatraMaps" <noreply@jatramaps.com>',
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <p>Your verification code is: <strong>${verificationCode}</strong></p>
      <p>This code will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
