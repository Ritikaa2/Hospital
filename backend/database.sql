-- MediCare+ Hospital Management System Database Schema
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor') DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- 3. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  qualification VARCHAR(100) NOT NULL,
  experience VARCHAR(50) NOT NULL,
  fee DECIMAL(10,2) NOT NULL,
  about TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  department_id INT NOT NULL,
  appointment_date VARCHAR(50) NOT NULL,
  appointment_time VARCHAR(50) NOT NULL,
  status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 5. Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  record_date VARCHAR(50) NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- =======================================================
-- SEED DATA
-- Default password for all demo accounts: password123
-- (Bcrypt hash: $2a$10$tZ8G33yKsm2d36v3fTfEfevBupYyEszV535.fJvG6M8d9w4h1H/uS)
-- =======================================================

-- Departments Seed
INSERT INTO departments (id, name, description) VALUES
(1, 'Cardiology', 'Heart care & comprehensive cardiovascular treatment'),
(2, 'Neurology', 'Brain & advanced nervous system disorders care'),
(3, 'Orthopedics', 'Bone, joint, spine and sports injury care'),
(4, 'Pediatrics', 'Comprehensive child healthcare and wellness'),
(5, 'Dermatology', 'Advanced skincare, cosmetics, and dermatological solutions'),
(6, 'General Medicine', 'Primary healthcare, preventive medicine, and routine wellness')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Demo Users (Patients and Doctors)
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Dr. Anjali Sharma', 'anjali@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
(2, 'Dr. Rohit Mehta', 'rohit@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
(3, 'Dr. Priya Patel', 'priya@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
(4, 'Dr. Rajesh Verma', 'rajesh@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
(5, 'Dr. Sneha Roy', 'sneha@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
(6, 'Dr. Vikram Malhotra', 'vikram@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
(7, 'Ritika Toora', 'ritika@gmail.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'patient'),
(8, 'Aman Verma', 'aman@gmail.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'patient')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- Demo Doctors Details
INSERT INTO doctors (id, user_id, specialization, qualification, experience, fee, about) VALUES
(1, 1, 'Cardiology', 'MBBS, MD (Cardiology)', '10+ Years', 500.00, 'Dr. Anjali Sharma is a highly experienced cardiologist specializing in heart diseases, preventive cardiology, echocardiography, and vascular health management.'),
(2, 2, 'Dermatology', 'MBBS, MD (Dermatology)', '8+ Years', 450.00, 'Dr. Rohit Mehta specializes in clinical dermatology, advanced acne management, cosmetic laser therapies, and allergy treatment.'),
(3, 3, 'Neurology', 'MBBS, DM (Neurology)', '12+ Years', 700.00, 'Dr. Priya Patel is an expert neurologist dedicated to treating headaches, neuropathies, stroke rehabilitation, and central nervous system disorders.'),
(4, 4, 'Orthopedics', 'MBBS, MS (Orthopedics)', '14+ Years', 600.00, 'Dr. Rajesh Verma is a senior orthopedic surgeon specializing in joint replacement, arthroscopy, and complex bone fracture care.'),
(5, 5, 'Pediatrics', 'MBBS, MD (Pediatrics)', '7+ Years', 400.00, 'Dr. Sneha Roy provides compassionate pediatric care, newborn wellness exams, immunizations, and child development counseling.'),
(6, 6, 'General Medicine', 'MBBS, MD (Internal Medicine)', '9+ Years', 350.00, 'Dr. Vikram Malhotra focuses on primary care, chronic disease management, diabetes control, and preventive lifestyle consultations.')
ON DUPLICATE KEY UPDATE specialization=VALUES(specialization);

-- Demo Appointments
INSERT INTO appointments (id, patient_id, doctor_id, department_id, appointment_date, appointment_time, status) VALUES
(1, 7, 1, 1, '2026-10-05', '10:00 AM', 'Confirmed'),
(2, 7, 2, 5, '2026-10-08', '12:00 PM', 'Pending'),
(3, 8, 1, 1, '2026-10-05', '11:00 AM', 'Confirmed'),
(4, 8, 6, 6, '2026-10-06', '04:00 PM', 'Completed')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Demo Medical Records
INSERT INTO medical_records (id, patient_id, doctor_id, title, description, record_date) VALUES
(1, 7, 1, 'Blood Test - Complete Lipid Profile', 'Normal cholesterol levels. HDL: 54 mg/dL, LDL: 98 mg/dL. Advised regular morning walks.', '10 Aug 2026'),
(2, 7, 2, 'Prescription - Vitamin D3 & Skin Serum', 'Tab Vitamin D3 60k once weekly for 8 weeks. Apply hydrating moisturiser twice daily.', '15 Jul 2026'),
(3, 7, 6, 'General Consultation & Health Checkup', 'BP: 120/80 mmHg, Pulse: 72 bpm. Normal BMI. Recommended yearly annual wellness checkup.', '20 Jun 2026'),
(4, 7, 3, 'Prescription - Migraine Relief Routine', 'Prescribed mild analgesic and stress reduction meditation routine for recurring headaches.', '12 May 2026')
ON DUPLICATE KEY UPDATE title=VALUES(title);
