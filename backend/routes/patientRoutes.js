const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMedicalRecords } = require('../controllers/patientController');

// Protected patient medical records endpoint
router.get('/medical-records', authMiddleware, getMedicalRecords);

module.exports = router;
