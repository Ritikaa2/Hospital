const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// .env me EMAIL / EMAIL_USER aur EMAIL_PASSWORD / EMAIL_PASS dono support karna
const emailUser = process.env.EMAIL || process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: `"MediCare Hospital" <${emailUser || 'no-reply@medicare.com'}>`,
    to: email,
    subject: 'MediCare Password Reset OTP',
    html: `
  <div style="font-family:Arial; max-width:500px; margin:auto; padding:25px;
              text-align:center; border:1px solid #ddd; border-radius:10px;">

    <h2 style="color:#0f766e;">MediCare Hospital</h2>

    <p>Your password reset OTP is:</p>

    <h1 style="color:#0f766e; letter-spacing:6px;">
      ${otp}
    </h1>

    <p>This OTP is valid for <b>5 minutes</b>.</p>

    <hr>

    <p style="font-size:12px; color:#888;">
      If you did not request this, please ignore this email.
    </p>

  </div>
`
  };

  console.log(`[OTP Generated for ${email}]: ${otp}`);

  try {
    if (emailUser && emailPass && emailUser !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions);
      console.log('OTP Email successfully sent with HTML template!');
    }
    return true;
  } catch (error) {
    console.log("Email sending error:", error);
    return true;
  }
}

module.exports = { sendOTPEmail };
