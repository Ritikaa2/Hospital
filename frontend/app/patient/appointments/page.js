'use client';

// React hooks, Next.js routing, components
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

// Backend server URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function PatientAppointmentsPage() {
  const router = useRouter();

  // 1. State variables
  const [userName, setUserName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fallback sample appointments agar backend se connect na ho sake
  const fallbackAppointments = [
    { id: 1, appointment_date: '2026-10-05', appointment_time: '10:00 AM', doctor_name: 'Dr. Anjali Sharma', department_name: 'Cardiology', status: 'Confirmed' },
    { id: 2, appointment_date: '2026-10-08', appointment_time: '12:00 PM', doctor_name: 'Dr. Rohit Mehta', department_name: 'Dermatology', status: 'Pending' }
  ];

  // 3. useEffect: User auth check karo aur patient ke saare appointments load karo
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    if (!token) {
      router.push('/login');
      return;
    }

    setUserName(name || 'Patient');

    async function loadAppointments() {
      try {
        const res = await fetch(`${API}/appointments/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setAppointments(data.length > 0 ? data : fallbackAppointments);
        } else {
          setAppointments(fallbackAppointments);
        }
      } catch (err) {
        setAppointments(fallbackAppointments);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, [router]);

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

      {/* Main Layout */}
      <div className="flex-1 flex">
        <Sidebar role="patient" userName={userName} />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl">
          
          {/* Header & Book Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-black text-black">My Appointments</h1>
              <p className="text-xs text-zinc-500 mt-0.5">History of all your hospital consultations</p>
            </div>
            <Link
              href="/appointment"
              className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              + Book New
            </Link>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6">
            {loading ? (
              <div className="text-center py-12 text-zinc-400 text-xs">Loading appointments...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase">
                      <th className="pb-3 px-3">Date</th>
                      <th className="pb-3 px-3">Time</th>
                      <th className="pb-3 px-3">Doctor</th>
                      <th className="pb-3 px-3">Department</th>
                      <th className="pb-3 px-3">Mode</th>
                      <th className="pb-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {appointments.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50">
                        <td className="py-3.5 px-3 font-semibold text-black">{item.appointment_date}</td>
                        <td className="py-3.5 px-3 text-black font-bold">{item.appointment_time || '10:00 AM'}</td>
                        <td className="py-3.5 px-3 font-bold text-black">{item.doctor_name || 'Dr. Specialist'}</td>
                        <td className="py-3.5 px-3 text-zinc-500">{item.department_name || item.specialization || 'General'}</td>
                        <td className="py-3.5 px-3 text-zinc-600">In-person</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === 'Confirmed'
                              ? 'bg-zinc-100 text-black border-zinc-300'
                              : item.status === 'Pending'
                              ? 'bg-zinc-50 text-zinc-600 border-zinc-200'
                              : item.status === 'Completed'
                              ? 'bg-black text-white border-black'
                              : 'bg-red-50 text-red-700 border-red-200'
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
