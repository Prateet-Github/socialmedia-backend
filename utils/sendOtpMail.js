import nodemailer from "nodemailer";

if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  throw new Error("MAIL_USER or MAIL_PASS is missing");
}

export const sendOtpMail = async ({ to, otp, username }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"GeeksGram" <${process.env.MAIL_USER}>`,
      to,
      subject: "Your GeeksGram OTP",
      html: `
        <h2>Hi ${username},</h2>
        <p>Your GeeksGram OTP is:</p>
        <h1 style="letter-spacing:6px">${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent");

  } catch (err) {
    console.error("Error sending email", err.message);
  }
};