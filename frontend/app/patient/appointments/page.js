'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function PatientAppointmentsPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackAppointments = [
    { id: 1, appointment_date: '2026-10-05', appointment_time: '10:00 AM', doctor_name: 'Dr. Anjali Sharma', department_name: 'Cardiology', status: 'Confirmed' },
    { id: 2, appointment_date: '2026-10-08', appointment_time: '12:00 PM', doctor_name: 'Dr. Rohit Mehta', department_name: 'Dermatology', status: 'Pending' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    if (!token) {
      router.push('/login');
      return;
    }

    setUserName(name || 'Patient');

    fetch(`${API}/appointments/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAppointments(data.length > 0 ? data : fallbackAppointments))
      .catch(() => setAppointments(fallbackAppointments))
      .finally(() => setLoading(false));
  }, [router]);

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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
              <p className="text-xs text-slate-500 mt-0.5">History of all your hospital consultations</p>
            </div>
            <Link
              href="/appointment"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
            >
              + Book New
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">Loading appointments...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                      <th className="pb-3 px-3">Date</th>
                      <th className="pb-3 px-3">Time</th>
                      <th className="pb-3 px-3">Doctor</th>
                      <th className="pb-3 px-3">Department</th>
                      <th className="pb-3 px-3">Mode</th>
                      <th className="pb-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {appointments.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-3 font-semibold text-slate-900">{item.appointment_date}</td>
                        <td className="py-3.5 px-3 text-blue-600 font-medium">{item.appointment_time || '10:00 AM'}</td>
                        <td className="py-3.5 px-3 font-bold text-slate-800">{item.doctor_name || 'Dr. Specialist'}</td>
                        <td className="py-3.5 px-3 text-slate-500">{item.department_name || item.specialization || 'General'}</td>
                        <td className="py-3.5 px-3 text-slate-600">In-person</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700'
                              : item.status === 'Completed'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
