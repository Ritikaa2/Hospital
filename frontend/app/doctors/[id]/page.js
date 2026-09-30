'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DoctorProfilePage() {
  const params = useParams();
  const doctorId = params.id;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fallbackDoctor = {
    id: doctorId,
    name: 'Dr. Anjali Sharma',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD',
    experience: '10+ Years',
    fee: 500,
    about: 'Dr. Anjali Sharma is an experienced cardiologist specializing in cardiovascular treatments and preventive health.'
  };

  useEffect(() => {
    fetch(`${API}/doctors/${doctorId}`)
      .then(res => res.json())
      .then(data => setDoctor(data.name ? data : fallbackDoctor))
      .catch(() => setDoctor(fallbackDoctor))
      .finally(() => setLoading(false));
  }, [doctorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">Loading...</div>
      </div>
    );
  }

  const doc = doctor || fallbackDoctor;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/doctors" className="hover:text-blue-600">Doctors</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{doc.name}</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shrink-0">
                {doc.name.replace('Dr. ', '').charAt(0)}
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 mb-1">
                  {doc.specialization}
                </span>
                <h1 className="text-2xl font-bold text-slate-900">{doc.name}</h1>
                <p className="text-xs text-slate-500">{doc.qualification}</p>
                <p className="text-xs text-slate-700 mt-2 font-semibold">Experience: {doc.experience}</p>
              </div>
            </div>

            <div className="text-left sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <span className="text-xs text-slate-400 block">Consultation Fee</span>
              <span className="text-xl font-bold text-emerald-600 block mb-3">Rs. {doc.fee}</span>
              <Link
                href={`/appointment?doctorId=${doc.id}&specialization=${encodeURIComponent(doc.specialization)}`}
                className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                Book Appointment
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">About Doctor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {doc.about}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800 block">Hospital Location</span>
              <span className="text-slate-500">MediCare Main Building, OPD Room 204</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800 block">Consultation Hours</span>
              <span className="text-slate-500">Mon - Sat: 09:00 AM - 05:00 PM</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
