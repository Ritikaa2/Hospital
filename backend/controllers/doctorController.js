const { query } = require('../db');

// Get all doctors with optional search or specialization filter
const getAllDoctors = async (req, res) => {
  try {
    const { search, specialization } = req.query;

    let sql = `
      SELECT d.*, u.name, u.email
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
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single doctor details by ID
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT d.*, u.name, u.email
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `;

    const doctors = await query(sql, [id]);
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctors[0]);
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get list of departments
const getDepartments = async (req, res) => {
  try {
    const departments = await query('SELECT * FROM departments');
    res.status(200).json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDepartments
};
