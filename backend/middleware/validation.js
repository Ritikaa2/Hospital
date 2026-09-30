// Email validation ke liye standard Regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 1. Signup Validation Middleware
const signupValidation = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // A. Sabhi fields required hain
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'All fields (name, email, password) are required',
      success: false
    });
  }

  // B. Name Validation (Kam se kam 3 characters, max 50, aur sirf alphabets/spaces)
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (trimmedName.length < 3) {
    return res.status(400).json({
      message: 'Name must be at least 3 characters long',
      success: false
    });
  }
  if (trimmedName.length > 50) {
    return res.status(400).json({
      message: 'Name cannot exceed 50 characters',
      success: false
    });
  }
  const nameRegex = /^[a-zA-Z\s.'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return res.status(400).json({
      message: 'Name can only contain letters and spaces',
      success: false
    });
  }

  // C. Email Format Validation
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return res.status(400).json({
      message: 'Please provide a valid email address (e.g. name@example.com)',
      success: false
    });
  }

  // D. Password Length Validation (Min 6, Max 50 characters)
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long',
      success: false
    });
  }
  if (password.length > 50) {
    return res.status(400).json({
      message: 'Password cannot exceed 50 characters',
      success: false
    });
  }

  // E. Confirm Password check (agar frontend se confirmPassword bheja gaya hai)
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match',
      success: false
    });
  }

  next();
};

// 2. Login Validation Middleware
const loginValidation = (req, res, next) => {
  const { email, password } = req.body;

  // Required fields check
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
      success: false
    });
  }

  // Email format check
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return res.status(400).json({
      message: 'Please provide a valid email address',
      success: false
    });
  }

  // Password min length
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters',
      success: false
    });
  }

  next();
};

// 3. Forgot Password Validation Middleware
const forgotPasswordValidation = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'Email address is required',
      success: false
    });
  }

  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return res.status(400).json({
      message: 'Please enter a valid email address (e.g. user@gmail.com)',
      success: false
    });
  }

  next();
};

// 4. Verify OTP Validation Middleware
const verifyOtpValidation = (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: 'Email and OTP are required',
      success: false
    });
  }

  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
      success: false
    });
  }

  // OTP must be exactly 6 digits
  const trimmedOtp = String(otp).trim();
  if (!/^\d{6}$/.test(trimmedOtp)) {
    return res.status(400).json({
      message: 'OTP must be a valid 6-digit number',
      success: false
    });
  }

  next();
};

// 5. Reset Password Validation Middleware
const resetPasswordValidation = (req, res, next) => {
  const { email, otp, password, newPassword, confirmPassword } = req.body;
  const targetPassword = newPassword || password;

  // A. Required fields check
  if (!email || !otp || !targetPassword) {
    return res.status(400).json({
      message: 'Email, OTP, and new password are required',
      success: false
    });
  }

  // B. Email format check
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
      success: false
    });
  }

  // C. OTP check (6 digits)
  const trimmedOtp = String(otp).trim();
  if (!/^\d{6}$/.test(trimmedOtp)) {
    return res.status(400).json({
      message: 'OTP must be a valid 6-digit number',
      success: false
    });
  }

  // D. New Password Length Check (Min 6, Max 50)
  if (typeof targetPassword !== 'string' || targetPassword.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long',
      success: false
    });
  }
  if (targetPassword.length > 50) {
    return res.status(400).json({
      message: 'Password cannot exceed 50 characters',
      success: false
    });
  }

  // E. Confirm Password check (if passed)
  if (confirmPassword !== undefined && targetPassword !== confirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match',
      success: false
    });
  }

  next();
};

module.exports = {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyOtpValidation,
  resetPasswordValidation
};
