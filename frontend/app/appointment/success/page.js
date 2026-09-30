'use client';

// React hooks, Next.js routing, components
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AppointmentSuccessPage() {
  // 1. State: Booking details display karne ke liye
  const [details, setDetails] = useState({
    patientName: 'Ritika Toora',
    doctor: 'Dr. Anjali Sharma',
    department: 'Cardiology',
    date: '2026-10-05',
    time: '10:00 AM'
  });

  // 2. useEffect: sessionStorage se confirmed booking info load karna
  useEffect(() => {
    const raw = sessionStorage.getItem('last_booking');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setDetails(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        // Fallback default details
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-xs p-8 text-center">
          
          {/* Success Checkmark Icon (Black Badge) */}
          <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-xs">
            ✓
          </div>

          <h1 className="text-2xl font-black text-black">
            Appointment Confirmed
          </h1>
          <p className="text-xs text-zinc-500 mt-1 mb-6">
            Your appointment was booked successfully
          </p>

          {/* Booking Summary Box */}
          <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200 text-left space-y-2.5 mb-6 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500 font-medium">Patient:</span>
              <span className="font-bold text-black">{details.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 font-medium">Doctor:</span>
              <span className="font-bold text-black">{details.doctor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 font-medium">Department:</span>
              <span className="font-bold text-black">{details.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 font-medium">Date:</span>
              <span className="font-bold text-black">{details.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 font-medium">Time:</span>
              <span className="font-bold text-black">{details.time}</span>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex gap-2.5 justify-center">
            <Link
              href="/patient/appointments"
              className="px-5 py-2.5 border border-zinc-300 rounded-xl text-xs font-bold text-black hover:bg-zinc-100 transition-all"
            >
              My Appointments
            </Link>
            <Link
              href="/patient"
              className="px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-xs"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
