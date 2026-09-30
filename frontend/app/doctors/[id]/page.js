'use client';

// React hooks, Next.js routing, components
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Backend server URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DoctorProfilePage() {
  const params = useParams();
  const doctorId = params.id;

  // 1. State: Doctor details aur loading status
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Default fallback data agar backend API respond na kare
  const fallbackDoctor = {
    id: doctorId,
    name: 'Dr. Anjali Sharma',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD',
    experience: '10+ Years',
    fee: 500,
    about: 'Dr. Anjali Sharma is an experienced cardiologist specializing in cardiovascular treatments and preventive health.'
  };

  // 3. useEffect: Doctor ID ke hisaab se details backend se fetch karna
  useEffect(() => {
    async function loadDoctorDetails() {
      try {
        const res = await fetch(`${API}/doctors/${doctorId}`);
        if (res.ok) {
          const data = await res.json();
          setDoctor(data.name ? data : fallbackDoctor);
        } else {
          setDoctor(fallbackDoctor);
        }
      } catch (err) {
        setDoctor(fallbackDoctor);
      } finally {
        setLoading(false);
      }
    }

    if (doctorId) {
      loadDoctorDetails();
    }
  }, [doctorId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xs text-zinc-400">
          Loading doctor details...
        </div>
      </div>
    );
  }

  const doc = doctor || fallbackDoctor;
  const initialLetter = doc.name ? doc.name.replace('Dr. ', '').charAt(0) : 'D';

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full flex-1">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-5 flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <Link href="/doctors" className="hover:text-black">Doctors</Link>
          <span>/</span>
          <span className="text-black font-bold">{doc.name}</span>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            
            {/* Left: Avatar, Name, Specialization */}
            <div className="flex items-start gap-5">
              <div className="w-18 h-18 rounded-2xl bg-black text-white flex items-center justify-center font-black text-3xl shrink-0 shadow-xs">
                {initialLetter}
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-black border border-zinc-200 mb-1.5">
                  {doc.specialization}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-black">{doc.name}</h1>
                <p className="text-xs text-zinc-500 font-medium">{doc.qualification}</p>
                <p className="text-xs text-zinc-700 mt-2 font-semibold">Experience: {doc.experience}</p>
              </div>
            </div>

            {/* Right: Consultation Fee & Book Button */}
            <div className="text-left sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
              <span className="text-xs text-zinc-400 block font-medium">Consultation Fee</span>
              <span className="text-2xl font-black text-black block mb-3">Rs. {doc.fee}</span>
              <Link
                href={`/appointment?doctorId=${doc.id}&specialization=${encodeURIComponent(doc.specialization)}`}
                className="inline-block px-7 py-3 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                Book Appointment
              </Link>
            </div>
          </div>

          {/* Doctor Bio (About) */}
          <div className="mt-8 pt-6 border-t border-zinc-100 space-y-3">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">About Doctor</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {doc.about}
            </p>
          </div>

          {/* Hospital OPD details */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
              <span className="font-bold text-black block mb-0.5">Hospital Location</span>
              <span className="text-zinc-500">MediCare Main Building, OPD Room 204</span>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
              <span className="font-bold text-black block mb-0.5">Consultation Hours</span>
              <span className="text-zinc-500">Mon - Sat: 09:00 AM - 05:00 PM</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
