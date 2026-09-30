const { query } = require('../db');

// Book a new appointment
const createAppointment = async (req, res) => {
  try {
    const patient_id = req.user.userId;
    const { doctor_id, department_id, appointment_date, appointment_time } = req.body;

    if (!doctor_id || !department_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = `
      INSERT INTO appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, status)
      VALUES (?, ?, ?, ?, ?, 'Pending')
    `;

    const result = await query(sql, [patient_id, doctor_id, department_id, appointment_date, appointment_time]);

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointmentId: result.insertId || 1
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get logged-in patient's appointments
const getMyAppointments = async (req, res) => {
  try {
    const patient_id = req.user.userId;

    const sql = `
      SELECT a.*, u.name AS doctor_name, d.specialization, dp.name AS department_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      JOIN departments dp ON a.department_id = dp.id
      WHERE a.patient_id = ?
      ORDER BY a.id DESC
    `;

    const appointments = await query(sql, [patient_id]);
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Get my appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get doctor ID for this user
    const doc = await query('SELECT id FROM doctors WHERE user_id = ?', [userId]);
    const doctorId = doc.length > 0 ? doc[0].id : 1;

    const sql = `
      SELECT a.*, u.name AS patient_name, u.email AS patient_email, dp.name AS department_name
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      JOIN departments dp ON a.department_id = dp.id
      WHERE a.doctor_id = ?
      ORDER BY a.id DESC
    `;

    const appointments = await query(sql, [doctorId]);
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update appointment status (Pending, Confirmed, Completed, Cancelled)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, prescription, notes } = req.body;

    await query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);

    // If appointment is completed and prescription/notes provided, add to medical records
    if (status === 'Completed' && (prescription || notes)) {
      const app = await query('SELECT patient_id, doctor_id FROM appointments WHERE id = ?', [id]);
      if (app.length > 0) {
        const details = (prescription ? 'Prescription: ' + prescription + '\n' : '') + (notes ? 'Notes: ' + notes : '');
        const today = new Date().toISOString().split('T')[0];

        await query(
          'INSERT INTO medical_records (patient_id, doctor_id, title, description, record_date) VALUES (?, ?, ?, ?, ?)',
          [app[0].patient_id, app[0].doctor_id, 'Doctor Consultation', details.trim(), today]
        );
      }
    }

    res.status(200).json({ message: `Appointment updated to ${status}` });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};
