const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
const { setOTP, getOTP, delOTP } = require('../redis');
const { sendOTPEmail } = require('../utils/sendEmail');

// POST /auth/signup
async function signup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUsers = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into MySQL
    await query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'patient']
    );

    return res.status(201).json({ message: 'Account created successfully. Please login.' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Something went wrong during signup' });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'medicare_secret_super_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      name: user.name,
      role: user.role,
      userId: user.id
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Something went wrong during login' });
  }
}

// POST /auth/forgot-password
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please enter your email' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const user = users[0];

    // Generate 6 digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis (Key: otp:email, TTL: 300s)
    await setOTP(email, otp);

    console.log(`[EmailJS OTP for ${email}]: ${otp}`);

    return res.status(200).json({
      message: 'OTP generated successfully',
      otp,
      email: user.email,
      userName: user.name
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Failed to generate OTP' });
  }
}

// POST /auth/verify-otp
async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const savedOTP = await getOTP(email);
    if (!savedOTP || savedOTP !== otp.toString().trim()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ message: 'OTP verification failed' });
  }
}

// POST /auth/reset-password
async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Verify OTP from Redis
    const savedOTP = await getOTP(email);
    if (!savedOTP || savedOTP !== otp.toString().trim()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in MySQL
    await query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    // Delete OTP from Redis
    await delOTP(email);

    return res.status(200).json({ message: 'Password reset successfully. Please login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Password reset failed' });
  }
}

module.exports = { signup, login, forgotPassword, verifyOTP, resetPassword };
