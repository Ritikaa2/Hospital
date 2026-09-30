-- Create Database
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- 1. Users Table (Doctors & Patients)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments Table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

-- 3. Doctors Table
CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    specialization VARCHAR(100),
    qualification VARCHAR(100),
    experience VARCHAR(50),
    fee INT,
    about TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. Appointments Table
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    department_id INT NOT NULL,
    appointment_date VARCHAR(50),
    appointment_time VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- 5. Medical Records Table
CREATE TABLE medical_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    title VARCHAR(150),
    description TEXT,
    record_date VARCHAR(50),
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);


-- ========================================================
-- Sample Data
-- Note: Default password for all users is: password123
-- ========================================================

-- Insert Departments
INSERT INTO departments (name, description) VALUES
('Cardiology', 'Heart and blood pressure care'),
('Neurology', 'Brain and nervous system treatment'),
('Orthopedics', 'Bones and joint care'),
('Pediatrics', 'Child healthcare and vaccinations'),
('Dermatology', 'Skin and hair care solutions'),
('General Medicine', 'Fever, cough and routine checkup');

-- Insert Users
INSERT INTO users (name, email, password, role) VALUES
('Dr. Anjali Sharma', 'anjali@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
('Dr. Rohit Mehta', 'rohit@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
('Dr. Priya Patel', 'priya@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
('Dr. Rajesh Verma', 'rajesh@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
('Dr. Sneha Roy', 'sneha@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
('Dr. Vikram Malhotra', 'vikram@medicare.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'doctor'),
('Ritika Toora', 'ritika@gmail.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'patient'),
('Aman Verma', 'aman@gmail.com', '$2a$10$WBy2Cxsmg6n6S1tH.nFvWOXCsDmk5wfRsrzGssHr5H/piD7WFn9aO', 'patient');

-- Insert Doctors details
INSERT INTO doctors (user_id, specialization, qualification, experience, fee, about) VALUES
(1, 'Cardiology', 'MBBS, MD', '10 Years', 500, 'Experienced heart specialist for ECG and cardiac health.'),
(2, 'Dermatology', 'MBBS, MD', '8 Years', 450, 'Skin specialist for acne, eczema and routine skin problems.'),
(3, 'Neurology', 'MBBS, DM', '12 Years', 700, 'Neurologist for migraines, nerve pain and sleep disorders.'),
(4, 'Orthopedics', 'MBBS, MS', '14 Years', 600, 'Orthopedic surgeon for joints, spine and fracture recovery.'),
(5, 'Pediatrics', 'MBBS, MD', '7 Years', 400, 'Pediatrician for newborn checkups, vaccines and wellness.'),
(6, 'General Medicine', 'MBBS, MD', '9 Years', 350, 'General physician for seasonal illnesses and health consultation.');

-- Insert Appointments
INSERT INTO appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, status) VALUES
(7, 1, 1, '2026-10-05', '10:00 AM', 'Confirmed'),
(7, 2, 5, '2026-10-08', '12:00 PM', 'Pending'),
(8, 1, 1, '2026-10-05', '11:00 AM', 'Confirmed'),
(8, 6, 6, '2026-10-06', '04:00 PM', 'Completed');

-- Insert Medical Records
INSERT INTO medical_records (patient_id, doctor_id, title, description, record_date) VALUES
(7, 1, 'Lipid Profile Test', 'Cholesterol levels are normal. Continue morning walks.', '10 Aug 2026'),
(7, 2, 'Skin Care Prescription', 'Take tablet once daily after dinner for 5 days.', '15 Jul 2026'),
(7, 6, 'Annual Health Checkup', 'Blood pressure is 120/80. Normal health report.', '20 Jun 2026');


-- ========================================================
-- Useful Queries for Testing
-- ========================================================

-- 1. View all doctors with user names
-- SELECT d.id, u.name, d.specialization, d.fee FROM doctors d JOIN users u ON d.user_id = u.id;

-- 2. View patient appointments
-- SELECT a.id, u.name AS patient, a.appointment_date, a.appointment_time, a.status FROM appointments a JOIN users u ON a.patient_id = u.id;

-- 3. Check login credentials
-- SELECT * FROM users WHERE email = 'ritika@gmail.com';
