const { query } = require('../db');

// GET /doctors (All doctors with optional search or specialization filter)
async function getAllDoctors(req, res) {
  try {
    const { search, specialization } = req.query;

    let sql = `
      SELECT d.id, d.user_id, u.name, u.email, d.specialization, d.qualification, d.experience, d.fee, d.about
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (specialization && specialization !== 'All') {
      sql += ' AND d.specialization = ?';
      params.push(specialization);
    }

    if (search) {
      sql += ' AND (u.name LIKE ? OR d.specialization LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const doctors = await query(sql, params);
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    return res.status(500).json({ message: 'Error fetching doctors' });
  }
}

// GET /doctors/:id (Single doctor details)
async function getDoctorById(req, res) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT d.id, d.user_id, u.name, u.email, d.specialization, d.qualification, d.experience, d.fee, d.about
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `;

    const doctors = await query(sql, [id]);
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    return res.status(200).json(doctors[0]);
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    return res.status(500).json({ message: 'Error fetching doctor details' });
  }
}

// GET /departments (Helper to list hospital departments)
async function getDepartments(req, res) {
  try {
    const departments = await query('SELECT * FROM departments');
    return res.status(200).json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    return res.status(500).json({ message: 'Error fetching departments' });
  }
}

module.exports = { getAllDoctors, getDoctorById, getDepartments };
