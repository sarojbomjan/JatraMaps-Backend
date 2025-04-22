const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `http://localhost:5000/verify-email/${verificationToken}`;

  const mailOptions = {
    from: '"Your App Name" <noreply@yourapp.com>',
    to: email,
    subject: "Verify Your Email Address",
    html: `
       
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
  };

  await transporter.sendMail(mailOptions);
};
