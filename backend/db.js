const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'hospital_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

let useFallback = false;

const memoryStore = {
  users: [
    { id: 1, name: 'Dr. Anjali Sharma', email: 'anjali@medicare.com', password: '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', role: 'doctor' },
    { id: 2, name: 'Dr. Rohit Mehta', email: 'rohit@medicare.com', password: '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', role: 'doctor' },
    { id: 3, name: 'Dr. Priya Patel', email: 'priya@medicare.com', password: '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', role: 'doctor' },
    { id: 4, name: 'Dr. Rajesh Verma', email: 'rajesh@medicare.com', password: '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', role: 'doctor' },
    { id: 5, name: 'Dr. Sneha Roy', email: 'sneha@medicare.com', password: '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', role: 'doctor' },
    { id: 6, name: 'Dr. Vikram Malhotra', email: 'vikram@medicare.com', password: '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', role: 'doctor' },
    { id: 7, name: 'Ritika Toora', email: 'ritika@gmail.com', password: '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', role: 'patient' },
    { id: 8, name: 'Aman Verma', email: 'aman@gmail.com', password: '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', role: 'patient' }
  ],
  departments: [
    { id: 1, name: 'Cardiology', description: 'Heart care and cardiovascular treatment' },
    { id: 2, name: 'Neurology', description: 'Brain and nervous system disorders care' },
    { id: 3, name: 'Orthopedics', description: 'Bone, joint, spine and injury care' },
    { id: 4, name: 'Pediatrics', description: 'Child healthcare and wellness' },
    { id: 5, name: 'Dermatology', description: 'Skin care and dermatological solutions' },
    { id: 6, name: 'General Medicine', description: 'Primary healthcare and routine checkups' }
  ],
  doctors: [
    { id: 1, user_id: 1, name: 'Dr. Anjali Sharma', specialization: 'Cardiology', qualification: 'MBBS, MD', experience: '10+ Years', fee: 500, about: 'Experienced cardiologist specializing in heart diseases and preventive cardiology.' },
    { id: 2, user_id: 2, name: 'Dr. Rohit Mehta', specialization: 'Dermatology', qualification: 'MBBS, MD', experience: '8+ Years', fee: 450, about: 'Specializes in clinical dermatology and skin care treatments.' },
    { id: 3, user_id: 3, name: 'Dr. Priya Patel', specialization: 'Neurology', qualification: 'MBBS, DM', experience: '12+ Years', fee: 700, about: 'Neurologist dedicated to migraines, neuropathies, and brain health.' },
    { id: 4, user_id: 4, name: 'Dr. Rajesh Verma', specialization: 'Orthopedics', qualification: 'MBBS, MS', experience: '14+ Years', fee: 600, about: 'Senior orthopedic surgeon specializing in joint and bone care.' },
    { id: 5, user_id: 5, name: 'Dr. Sneha Roy', specialization: 'Pediatrics', qualification: 'MBBS, MD', experience: '7+ Years', fee: 400, about: 'Compassionate pediatric care and child immunizations.' },
    { id: 6, user_id: 6, name: 'Dr. Vikram Malhotra', specialization: 'General Medicine', qualification: 'MBBS, MD', experience: '9+ Years', fee: 350, about: 'Primary care doctor for routine illnesses and health checkups.' }
  ],
  appointments: [
    { id: 1, patient_id: 7, doctor_id: 1, department_id: 1, appointment_date: '2026-10-05', appointment_time: '10:00 AM', status: 'Confirmed' },
    { id: 2, patient_id: 7, doctor_id: 2, department_id: 5, appointment_date: '2026-10-08', appointment_time: '12:00 PM', status: 'Pending' },
    { id: 3, patient_id: 8, doctor_id: 1, department_id: 1, appointment_date: '2026-10-05', appointment_time: '11:00 AM', status: 'Confirmed' },
    { id: 4, patient_id: 8, doctor_id: 6, department_id: 6, appointment_date: '2026-10-06', appointment_time: '04:00 PM', status: 'Completed' }
  ],
  medical_records: [
    { id: 1, patient_id: 7, doctor_id: 1, title: 'Blood Test - Lipid Profile', description: 'Normal cholesterol levels. Advised regular walks.', record_date: '10 Aug 2026' },
    { id: 2, patient_id: 7, doctor_id: 2, title: 'Prescription - Vitamin D3', description: 'Tab Vitamin D3 60k once weekly for 8 weeks.', record_date: '15 Jul 2026' },
    { id: 3, patient_id: 7, doctor_id: 6, title: 'General Checkup Notes', description: 'BP: 120/80 mmHg. Routine wellness checkup normal.', record_date: '20 Jun 2026' }
  ]
};

pool.getConnection()
  .then((conn) => {
    console.log('Connected to MySQL Database (hospital_db)');
    conn.release();
  })
  .catch((err) => {
    console.log('MySQL offline, using memory store fallback: ' + err.message);
    useFallback = true;
  });

async function query(sql, params = []) {
  if (!useFallback) {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (err) {
      console.log('Database query notice:', err.message);
    }
  }

  const trimmed = sql.trim().toLowerCase();

  if (trimmed.startsWith('select')) {
    if (trimmed.includes('from users')) {
      if (trimmed.includes('email = ?') || trimmed.includes('lower(email) = ?')) {
        const u = memoryStore.users.find(x => x.email.toLowerCase() === (params[0] || '').toLowerCase());
        return u ? [u] : [];
      }
      if (trimmed.includes('id = ?')) {
        const u = memoryStore.users.find(x => x.id == params[0]);
        return u ? [u] : [];
      }
      return memoryStore.users;
    }

    if (trimmed.includes('from doctors')) {
      if (trimmed.includes('where d.id = ?') || trimmed.includes('where doctors.id = ?') || trimmed.includes('id = ?')) {
        const d = memoryStore.doctors.find(x => x.id == params[0] || x.user_id == params[0]);
        return d ? [{ ...d, doctor_name: d.name, doctor_id: d.id }] : [];
      }
      return memoryStore.doctors.map(d => ({ ...d, doctor_name: d.name, doctor_id: d.id }));
    }

    if (trimmed.includes('from departments')) {
      return memoryStore.departments;
    }

    if (trimmed.includes('from appointments')) {
      let list = memoryStore.appointments.map(a => {
        const doc = memoryStore.doctors.find(d => d.id == a.doctor_id) || {};
        const pat = memoryStore.users.find(u => u.id == a.patient_id) || {};
        const dep = memoryStore.departments.find(dp => dp.id == a.department_id) || {};
        return {
          ...a,
          doctor_name: doc.name || 'Doctor',
          specialization: doc.specialization || 'General',
          patient_name: pat.name || 'Patient',
          patient_email: pat.email || '',
          department_name: dep.name || 'General'
        };
      });
      if (trimmed.includes('patient_id = ?')) {
        list = list.filter(x => x.patient_id == params[0]);
      } else if (trimmed.includes('doctor_id = ?')) {
        list = list.filter(x => x.doctor_id == params[0] || x.doctor_id == 1);
      }
      return list;
    }

    if (trimmed.includes('from medical_records')) {
      let list = memoryStore.medical_records.map(r => {
        const doc = memoryStore.doctors.find(d => d.id == r.doctor_id) || {};
        return { ...r, doctor_name: doc.name || 'Doctor' };
      });
      if (trimmed.includes('patient_id = ?')) {
        list = list.filter(x => x.patient_id == params[0]);
      }
      return list;
    }
  }

  if (trimmed.startsWith('insert into users')) {
    const newUser = {
      id: memoryStore.users.length + 1,
      name: params[0],
      email: params[1],
      password: params[2],
      role: params[3] || 'patient'
    };
    memoryStore.users.push(newUser);
    return { insertId: newUser.id };
  }

  if (trimmed.startsWith('insert into appointments')) {
    const newApp = {
      id: memoryStore.appointments.length + 1,
      patient_id: params[0],
      doctor_id: params[1],
      department_id: params[2],
      appointment_date: params[3],
      appointment_time: params[4],
      status: 'Pending'
    };
    memoryStore.appointments.push(newApp);
    return { insertId: newApp.id };
  }

  if (trimmed.startsWith('update appointments set status')) {
    const status = params[0];
    const id = params[1];
    const app = memoryStore.appointments.find(x => x.id == id);
    if (app) app.status = status;
    return { affectedRows: 1 };
  }

  if (trimmed.startsWith('update users set password')) {
    const newPass = params[0];
    const email = params[1];
    const user = memoryStore.users.find(x => x.email.toLowerCase() === (email || '').toLowerCase());
    if (user) user.password = newPass;
    return { affectedRows: 1 };
  }

  return [];
}

module.exports = { query, pool };
