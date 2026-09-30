const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
const { setOTP, getOTP, delOTP } = require('../utils/redisClient');
const { sendOTPEmail } = require('../utils/sendEmail');

const JWT_SECRET = process.env.JWT_SECRET || 'medicare_secret_super_key_2026';

// 1. User Signup
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'User already exists, please login' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'doctor' ? 'doctor' : 'patient';

    // Insert user into database
    const result = await query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, cleanEmail, hashedPassword, userRole]
    );

    const userId = result.insertId;

    // Generate JWT token
    const token = jwt.sign(
      { userId, email: cleanEmail, name, role: userRole },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      userId,
      name,
      role: userRole
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // Find user by email
    const users = await query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user.id,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Forgot Password (Generate and store OTP)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // Verify user exists
    const users = await query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save in Redis (5 min expiry)
    await setOTP(cleanEmail, otp, 300);

    // Send email using custom HTML template from sendEmail.js
    await sendOTPEmail(cleanEmail, otp);

    console.log(`[MediCare OTP for ${cleanEmail}]: ${otp}`);

    res.status(200).json({
      message: 'OTP sent successfully',
      otp: otp,
      userName: users[0].name
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const redisOtp = await getOTP(cleanEmail);
    if (redisOtp && String(redisOtp).trim() === String(otp).trim()) {
      return res.status(200).json({ message: 'OTP verified successfully' });
    }

    res.status(400).json({ message: 'Invalid or expired OTP' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, newPassword } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const finalPassword = newPassword || password;

    // Verify OTP first
    const redisOtp = await getOTP(cleanEmail);
    if (!redisOtp || String(redisOtp).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    // Update in database
    await query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, cleanEmail]);

    // Clear OTP from Redis
    await delOTP(cleanEmail);

    res.status(200).json({ message: 'Password reset successfully! You can now login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword
};
