const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  getDepartments
} = require('../controllers/doctorController');

router.get('/departments', getDepartments);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

module.exports = router;
