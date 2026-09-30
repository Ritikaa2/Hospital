'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AppointmentSuccessPage() {
  const [details, setDetails] = useState({
    patientName: 'Ritika Toora',
    doctor: 'Dr. Anjali Sharma',
    department: 'Cardiology',
    date: '2026-10-05',
    time: '10:00 AM'
  });

  useEffect(() => {
    const raw = sessionStorage.getItem('last_booking');
    if (raw) {
      try {
        setDetails(prev => ({ ...prev, ...JSON.parse(raw) }));
      } catch (e) {}
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl mx-auto mb-4">
            +
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Appointment Confirmed
          </h1>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Your appointment was booked successfully
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-2.5 mb-6 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Patient:</span><span className="font-bold">{details.patientName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Doctor:</span><span className="font-bold">{details.doctor}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Department:</span><span className="font-bold">{details.department}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Date:</span><span className="font-bold">{details.date}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Time:</span><span className="font-bold text-blue-600">{details.time}</span></div>
          </div>

          <div className="flex gap-2 justify-center">
            <Link
              href="/patient/appointments"
              className="px-4 py-2.5 border rounded-xl text-xs font-semibold hover:border-blue-600"
            >
              My Appointments
            </Link>
            <Link
              href="/patient"
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
