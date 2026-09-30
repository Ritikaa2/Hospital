# MediCare+ - Hospital Management System

A full-stack, production-grade Hospital Management System website built with **Next.js (App Router)**, **Node.js/Express.js**, **MySQL**, **Redis**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 👤 Patient Portal
- **User Authentication**: Secure JWT-based Signup and Login with bcrypt password hashing.
- **Forgot Password**: Real OTP verification cached in Redis with 5-minute expiry and Nodemailer integration.
- **Browse Specialties**: Explore 6 distinct hospital departments with tailored doctors.
- **Doctor Discovery & Profile**: Search, filter by specialty, and view detailed doctor profiles (experience, fees, credentials, reviews).
- **4-Step Booking Wizard**:
  1. Select Department
  2. Choose Doctor
  3. Pick Date & Time Slot
  4. Review & Confirm
- **Appointment Receipt**: Booking confirmation with instant dashboard access.
- **Dashboard & History**: Real-time stats, upcoming consultations, and complete appointment logs.
- **Medical Records**: Tabbed medical records (Prescriptions, Lab Reports, Consultation Notes) with detailed modal viewer.

### 👨‍⚕️ Doctor Portal
- **Doctor Dashboard**: Today's schedule, patient count, and digital prescription counter.
- **Appointment Lifecycle Management**: One-click actions to **Confirm**, **Cancel**, or mark **Completed**.
- **Patient Directory & Schedule**: Complete roster of booked visits with patient details.

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), JavaScript, Tailwind CSS, Native `fetch()` API
- **Backend**: Node.js, Express.js, JavaScript
- **Database**: MySQL (`mysql2` connection pool, Raw Parameterized SQL Queries)
- **Caching**: Redis (for 5-min temporary OTP storage & fast lookups)
- **Security**: JSON Web Tokens (JWT), `bcryptjs` password hashing
- **Email**: Nodemailer (Console OTP fallback for viva/demo testing)

---

## 📁 Project Structure

```
Hospital/
├── backend/
│   ├── .env                      # Backend environment variables
│   ├── database.sql              # MySQL database schema & seed data
│   ├── package.json
│   ├── server.js                 # Express server entry point
│   ├── db.js                     # MySQL connection & SQL query runner
│   ├── redis.js                  # Redis client & OTP management
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── doctorRoutes.js       # Doctor & department routes
│   │   ├── appointmentRoutes.js  # Appointment booking & status routes
│   │   └── patientRoutes.js      # Patient medical record routes
│   ├── controllers/
│   │   ├── authController.js     # Auth logic (signup, login, OTP reset)
│   │   ├── doctorController.js   # Doctors listing & details
│   │   ├── appointmentController.js # Appointment CRUD
│   │   └── patientController.js  # Patient records
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   └── utils/
│       └── sendEmail.js          # Nodemailer email sender
│
├── frontend/
│   ├── .env.local                # Frontend API environment URL
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── next.config.js
│   ├── jsconfig.json
│   ├── app/
│   │   ├── globals.css           # Global Tailwind CSS
│   │   ├── layout.js             # Root layout with Plus Jakarta Sans
│   │   ├── page.js               # Home page
│   │   ├── login/
│   │   │   └── page.js           # Split-screen Login page
│   │   ├── signup/
│   │   │   └── page.js          # Split-screen Signup page
│   │   ├── forgot-password/
│   │   │   └── page.js          # Request OTP page
│   │   ├── reset-password/
│   │   │   └── page.js          # Verify OTP & Reset Password page
│   │   ├── doctors/
│   │   │   ├── page.js          # Doctors directory with search & filter
│   │   │   └── [id]/
│   │   │       └── page.js      # Doctor profile with reviews & booking
│   │   ├── appointment/
│   │   │   ├── page.js          # 4-step appointment booking wizard
│   │   │   └── success/
│   │   │       └── page.js      # Booking confirmation receipt
│   │   ├── patient/
│   │   │   ├── page.js          # Patient Dashboard
│   │   │   ├── appointments/
│   │   │   │   └── page.js      # Patient appointments list
│   │   │   └── medical-records/
│   │   │       └── page.js      # Tabbed medical records
│   │   └── doctor/
│   │       ├── page.js          # Doctor Dashboard
│   │       └── appointments/
│   │           └── page.js      # Doctor appointment schedule & status
│   └── components/
│       ├── Navbar.js             # Navigation bar with dynamic auth status
│       ├── Footer.js             # Hospital footer with emergency hotline
│       ├── Sidebar.js            # Unified sidebar for Patient & Doctor
│       ├── DoctorCard.js         # Doctor summary card
│       └── DepartmentCard.js     # Department card with specialty icon
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
```

#### MySQL Database Setup:
1. Open MySQL Workbench or terminal:
```sql
SOURCE path/to/backend/database.sql;
```
2. Verify `.env` settings in `backend/.env`:
```env
PORT=8000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=hospital_db
DB_PORT=3306
REDIS_URL=redis://localhost:6379
JWT_SECRET=medicare_secret_super_key_2026
```

#### Start Backend:
```bash
npm run dev
# Server runs on http://localhost:8000
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Web application runs on http://localhost:3000
```

---

## 🔑 Demo Login Credentials

All demo accounts have password: `password123`

| Role | Name | Email | Password |
|---|---|---|---|
| **Patient** | Ritika Toora | `ritika@gmail.com` | `password123` |
| **Patient** | Aman Verma | `aman@gmail.com` | `password123` |
| **Doctor (Cardiology)** | Dr. Anjali Sharma | `anjali@medicare.com` | `password123` |
| **Doctor (Dermatology)** | Dr. Rohit Mehta | `rohit@medicare.com` | `password123` |
| **Doctor (Neurology)** | Dr. Priya Patel | `priya@medicare.com` | `password123` |

---

## 📡 API Reference Summary

### Authentication
- `POST /auth/signup` - Register a new patient account
- `POST /auth/login` - Login with email & password (returns JWT)
- `POST /auth/forgot-password` - Request 6-digit OTP stored in Redis
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/reset-password` - Update password in MySQL & invalidate Redis OTP

### Doctors & Departments
- `GET /doctors` - List all doctors (supports `?search=` and `?specialization=`)
- `GET /doctors/:id` - Get specific doctor details
- `GET /doctors/departments` - List all hospital departments

### Appointments
- `POST /appointments` - Book new appointment (JWT protected)
- `GET /appointments/my` - Get logged-in patient's appointments (JWT protected)
- `GET /appointments/doctor` - Get doctor's scheduled appointments (JWT protected)
- `PUT /appointments/:id/status` - Update status (`Confirmed`, `Cancelled`, `Completed`)

### Patient Records
- `GET /patients/medical-records` - Fetch patient medical records (JWT protected)
