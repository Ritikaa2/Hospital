const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword
} = require('../controllers/authController');

// Validation middlewares import karna
const {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyOtpValidation,
  resetPasswordValidation
} = require('../middleware/validation');

// Auth Routes with respective validation middleware
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/verify-otp', verifyOtpValidation, verifyOTP);
router.post('/reset-password', resetPasswordValidation, resetPassword);

module.exports = router;
