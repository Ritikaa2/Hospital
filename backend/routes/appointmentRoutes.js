const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

// All appointment routes are protected by JWT auth
router.post('/', authMiddleware, createAppointment);
router.get('/my', authMiddleware, getMyAppointments);
router.get('/doctor', authMiddleware, getDoctorAppointments);
router.put('/:id/status', authMiddleware, updateAppointmentStatus);

module.exports = router;
