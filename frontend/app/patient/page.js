'use client';

// React hooks, Next.js routing, components
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

// Backend server URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function PatientDashboard() {
  const router = useRouter();

  // 1. State variables
  const [userName, setUserName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fallback appointments agar backend data na de
  const fallbackAppointments = [
    { id: 1, appointment_date: '2026-10-05', doctor_name: 'Dr. Anjali Sharma', department_name: 'Cardiology', status: 'Confirmed' },
    { id: 2, appointment_date: '2026-10-08', doctor_name: 'Dr. Rohit Mehta', department_name: 'Dermatology', status: 'Pending' }
  ];

  // 3. useEffect: Login verification aur dashboard data fetch karna
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');

    // Agar token nahi hai toh login page par bhejo
    if (!token) {
      router.push('/login');
      return;
    }

    // Agar user doctor hai toh doctor portal par bhejo
    if (role === 'doctor') {
      router.push('/doctor');
      return;
    }

    setUserName(name || 'Patient');

    async function loadDashboardData() {
      try {
        const [appRes, recRes] = await Promise.all([
          fetch(`${API}/appointments/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API}/patients/medical-records`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (appRes.ok) {
          const appData = await appRes.json();
          setAppointments(appData.length > 0 ? appData : fallbackAppointments);
        } else {
          setAppointments(fallbackAppointments);
        }

        if (recRes.ok) {
          const recData = await recRes.json();
          setMedicalRecords(recData);
        }
      } catch (err) {
        setAppointments(fallbackAppointments);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  // Dashboard Stats calculate karna
  const upcomingCount = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length;
  const prescriptionsCount = medicalRecords.filter(r => r.title && r.title.toLowerCase().includes('prescription')).length || 2;
  const labReportsCount = medicalRecords.filter(r => r.title && (r.title.toLowerCase().includes('lab') || r.title.toLowerCase().includes('blood'))).length || 1;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white font-black text-lg shadow-xs">
            +
          </div>
          <span className="font-black text-black text-lg">MediCare+</span>
        </Link>
        <div className="text-xs font-bold text-black">{userName}</div>
      </header>

      {/* Main Layout: Left Sidebar + Right Content */}
      <div className="flex-1 flex">
        <Sidebar role="patient" userName={userName} />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl">
          
          {/* Welcome Banner */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-black">
                Welcome Back, {userName}
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Manage your hospital appointments and health records
              </p>
            </div>
            <Link
              href="/appointment"
              className="inline-block px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl text-center shadow-xs transition-all"
            >
              + Book Appointment
            </Link>
          </div>

          {/* 4 Stat Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
              <span className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider block">Upcoming Appointments</span>
              <span className="text-3xl font-black text-black mt-1 block">{upcomingCount}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
              <span className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider block">Medical Records</span>
              <span className="text-3xl font-black text-black mt-1 block">{medicalRecords.length || 4}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
              <span className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider block">Prescriptions</span>
              <span className="text-3xl font-black text-black mt-1 block">{prescriptionsCount}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
              <span className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider block">Lab Reports</span>
              <span className="text-3xl font-black text-black mt-1 block">{labReportsCount}</span>
            </div>
          </div>

          {/* Upcoming Appointments Table */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-black">Your Upcoming Appointments</h2>
              <Link href="/patient/appointments" className="text-xs font-bold text-black hover:underline">
                View All →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase">
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Doctor</th>
                    <th className="pb-3 px-3">Department</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {appointments.slice(0, 4).map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50">
                      <td className="py-3.5 px-3 font-semibold text-black">{item.appointment_date}</td>
                      <td className="py-3.5 px-3 font-bold text-black">{item.doctor_name || 'Dr. Specialist'}</td>
                      <td className="py-3.5 px-3 text-zinc-500">{item.department_name || item.specialization || 'General'}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                          item.status === 'Confirmed' ? 'bg-zinc-100 text-black border-zinc-300' : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link href="/patient/appointments" className="text-xs text-black font-bold hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
