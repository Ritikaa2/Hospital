const { query } = require('../db');

// POST /appointments (Book new appointment)
async function createAppointment(req, res) {
  try {
    const patient_id = req.user.userId;
    const { doctor_id, department_id, appointment_date, appointment_time } = req.body;

    if (!doctor_id || !department_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ message: 'Please fill all appointment details' });
    }

    const sql = `
      INSERT INTO appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, status)
      VALUES (?, ?, ?, ?, ?, 'Pending')
    `;

    const result = await query(sql, [
      patient_id,
      doctor_id,
      department_id,
      appointment_date,
      appointment_time
    ]);

    return res.status(201).json({
      message: 'Appointment booked successfully',
      appointmentId: result.insertId || 1
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    return res.status(500).json({ message: 'Failed to book appointment' });
  }
}

// GET /appointments/my (Patient's appointments)
async function getMyAppointments(req, res) {
  try {
    const patient_id = req.user.userId;

    const sql = `
      SELECT a.id, a.patient_id, a.doctor_id, a.department_id, a.appointment_date, a.appointment_time, a.status, a.created_at,
             u.name AS doctor_name, d.specialization, dp.name AS department_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      JOIN departments dp ON a.department_id = dp.id
      WHERE a.patient_id = ?
      ORDER BY a.id DESC
    `;

    const appointments = await query(sql, [patient_id]);
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Get my appointments error:', error);
    return res.status(500).json({ message: 'Error fetching your appointments' });
  }
}

// GET /appointments/doctor (Doctor's appointments with consultation details)
async function getDoctorAppointments(req, res) {
  try {
    const userId = req.user.userId;

    // Find doctor id
    const docRows = await query('SELECT id FROM doctors WHERE user_id = ?', [userId]);
    const doctorId = docRows.length > 0 ? docRows[0].id : 1;

    const sql = `
      SELECT a.id, a.patient_id, a.doctor_id, a.department_id, a.appointment_date, a.appointment_time, a.status, a.created_at,
             u.name AS patient_name, u.email AS patient_email, dp.name AS department_name
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      JOIN departments dp ON a.department_id = dp.id
      WHERE a.doctor_id = ?
      ORDER BY a.id DESC
    `;

    const appointments = await query(sql, [doctorId]);

    // Fetch related medical records for each patient to display prescriptions and notes
    const records = await query('SELECT * FROM medical_records WHERE doctor_id = ? ORDER BY id DESC', [doctorId]);

    const enrichedAppointments = appointments.map(app => {
      const patientRecords = records.filter(r => r.patient_id == app.patient_id);
      const latestRecord = patientRecords[0] || null;
      return {
        ...app,
        prescription: latestRecord ? latestRecord.description : '',
        consultation_title: latestRecord ? latestRecord.title : '',
        record_date: latestRecord ? latestRecord.record_date : ''
      };
    });

    return res.status(200).json(enrichedAppointments);
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    return res.status(500).json({ message: 'Error fetching doctor appointments' });
  }
}

// PUT /appointments/:id/status (Confirm, Cancel, Complete with Prescription & Notes)
async function updateAppointmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, prescription, notes, diagnosis } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update appointment status
    await query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);

    // If completing the consultation with prescription and doctor notes, save to medical_records
    if (status === 'Completed' && (prescription || notes || diagnosis)) {
      const appRows = await query('SELECT patient_id, doctor_id, appointment_date FROM appointments WHERE id = ?', [id]);
      if (appRows.length > 0) {
        const app = appRows[0];
        const title = diagnosis ? `Prescription - ${diagnosis}` : 'Doctor Consultation & Prescription';
        
        let formattedDescription = '';
        if (prescription) formattedDescription += `Prescribed Medication:\n${prescription}\n\n`;
        if (notes) formattedDescription += `Doctor Advice / Notes:\n${notes}`;

        const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        await query(
          'INSERT INTO medical_records (patient_id, doctor_id, title, description, record_date) VALUES (?, ?, ?, ?, ?)',
          [app.patient_id, app.doctor_id, title, formattedDescription.trim(), todayFormatted]
        );
      }
    }

    return res.status(200).json({
      message: `Appointment marked as ${status}${status === 'Completed' ? ' with prescription recorded' : ''}`
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    return res.status(500).json({ message: 'Failed to update appointment status' });
  }
}

module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};
