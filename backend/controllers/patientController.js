const { query } = require('../db');

// Get medical records for logged-in patient
const getMedicalRecords = async (req, res) => {
  try {
    const patient_id = req.user.userId;

    const sql = `
      SELECT m.*, u.name AS doctor_name, d.specialization
      FROM medical_records m
      JOIN doctors d ON m.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE m.patient_id = ?
      ORDER BY m.id DESC
    `;

    const records = await query(sql, [patient_id]);
    res.status(200).json(records);
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMedicalRecords };
