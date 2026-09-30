const { query } = require('../db');

// GET /patients/medical-records (Fetch medical records for logged-in patient)
async function getMedicalRecords(req, res) {
  try {
    const patient_id = req.user.userId;

    const sql = `
      SELECT m.id, m.patient_id, m.doctor_id, m.title, m.description, m.record_date,
             u.name AS doctor_name, d.specialization
      FROM medical_records m
      JOIN doctors d ON m.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE m.patient_id = ?
      ORDER BY m.id DESC
    `;

    const records = await query(sql, [patient_id]);
    return res.status(200).json(records);
  } catch (error) {
    console.error('Get medical records error:', error);
    return res.status(500).json({ message: 'Error fetching medical records' });
  }
}

module.exports = { getMedicalRecords };
