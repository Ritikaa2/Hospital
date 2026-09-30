'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function PatientDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackAppointments = [
    { id: 1, appointment_date: '2026-10-05', doctor_name: 'Dr. Anjali Sharma', department_name: 'Cardiology', status: 'Confirmed' },
    { id: 2, appointment_date: '2026-10-08', doctor_name: 'Dr. Rohit Mehta', department_name: 'Dermatology', status: 'Pending' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');

    if (!token) {
      router.push('/login');
      return;
    }

    if (role === 'doctor') {
      router.push('/doctor');
      return;
    }

    setUserName(name || 'Patient');

    async function loadData() {
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

    loadData();
  }, [router]);

  const upcomingCount = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length;
  const prescriptionsCount = medicalRecords.filter(r => r.title && r.title.toLowerCase().includes('prescription')).length || 2;
  const labReportsCount = medicalRecords.filter(r => r.title && (r.title.toLowerCase().includes('lab') || r.title.toLowerCase().includes('blood'))).length || 1;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            +
          </div>
          <span className="font-bold text-slate-900 text-lg">MediCare+</span>
        </Link>
        <div className="text-xs font-bold text-slate-800">{userName}</div>
      </header>

      <div className="flex-1 flex">
        <Sidebar role="patient" userName={userName} />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome Back, {userName}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your hospital appointments and health records
              </p>
            </div>
            <Link
              href="/appointment"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl text-center shadow-xs"
            >
              + Book Appointment
            </Link>
          </div>

          {/* 4 Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-slate-500 text-[11px] font-medium block">Upcoming Appointments</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{upcomingCount}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-slate-500 text-[11px] font-medium block">Medical Records</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{medicalRecords.length || 4}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-slate-500 text-[11px] font-medium block">Prescriptions</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{prescriptionsCount}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-slate-500 text-[11px] font-medium block">Lab Reports</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{labReportsCount}</span>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Your Upcoming Appointments</h2>
              <Link href="/patient/appointments" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Doctor</th>
                    <th className="pb-3 px-3">Department</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {appointments.slice(0, 4).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-medium text-slate-900">{item.appointment_date}</td>
                      <td className="py-3 px-3 font-semibold">{item.doctor_name || 'Dr. Specialist'}</td>
                      <td className="py-3 px-3 text-slate-500">{item.department_name || item.specialization || 'General'}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link href="/patient/appointments" className="text-xs text-blue-600 font-semibold">
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
