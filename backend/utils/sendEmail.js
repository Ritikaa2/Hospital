const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: `"MediCare Hospital" <${process.env.EMAIL_USER || 'no-reply@medicare.com'}>`,
    to: email,
    subject: 'MediCare Password Reset OTP',
    text: `Your MediCare password reset OTP is: ${otp}. It is valid for 5 minutes.`
  };

  console.log(`[OTP Generated for ${email}]: ${otp}`);

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions);
    }
    return true;
  } catch (error) {
    return true;
  }
}

module.exports = { sendOTPEmail };
