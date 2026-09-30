'use client';

// React aur Next.js components
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DepartmentCard from '@/components/DepartmentCard';
import DoctorCard from '@/components/DoctorCard';

// Backend server ka URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function HomePage() {
  // 1. State: Backend se aane wale departments aur doctors store karne ke liye
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // 2. Default fallback data agar backend connect na ho ya data empty ho
  const defaultDepartments = [
    { id: 1, name: 'Cardiology', description: 'Heart care and comprehensive cardiovascular treatment' },
    { id: 2, name: 'Neurology', description: 'Brain and nervous system disorders care' },
    { id: 3, name: 'Orthopedics', description: 'Bone, joint, spine and sports injury care' },
    { id: 4, name: 'Pediatrics', description: 'Child healthcare and routine wellness' },
    { id: 5, name: 'Dermatology', description: 'Skin care and dermatological solutions' },
    { id: 6, name: 'General Medicine', description: 'Primary healthcare and preventive medicine' }
  ];

  const defaultDoctors = [
    { id: 1, name: 'Dr. Anjali Sharma', specialization: 'Cardiology', qualification: 'MBBS, MD', experience: '10+ Years', fee: 500, about: 'Specializing in preventive cardiology and heart therapies.' },
    { id: 2, name: 'Dr. Rohit Mehta', specialization: 'Dermatology', qualification: 'MBBS, MD', experience: '8+ Years', fee: 450, about: 'Clinical dermatologist specializing in skin care and therapies.' },
    { id: 3, name: 'Dr. Priya Patel', specialization: 'Neurology', qualification: 'MBBS, DM', experience: '12+ Years', fee: 700, about: 'Neurologist dedicated to migraines, neuropathy, and brain health.' }
  ];

  // 3. useEffect: Page open hote hi departments aur featured doctors fetch karo
  useEffect(() => {
    async function loadHomeData() {
      // Departments fetch karna
      try {
        const deptRes = await fetch(`${API}/doctors/departments`);
        if (deptRes.ok) {
          const deptData = await deptRes.json();
          setDepartments(deptData.length > 0 ? deptData : defaultDepartments);
        } else {
          setDepartments(defaultDepartments);
        }
      } catch (err) {
        setDepartments(defaultDepartments);
      }

      // Doctors fetch karna
      try {
        const docRes = await fetch(`${API}/doctors`);
        if (docRes.ok) {
          const docData = await docRes.json();
          setDoctors(docData.length > 0 ? docData.slice(0, 3) : defaultDoctors);
        } else {
          setDoctors(defaultDoctors);
        }
      } catch (err) {
        setDoctors(defaultDoctors);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans">
      {/* Top Navbar */}
      <Navbar />

      {/* 1. Hero Section (Full-Width Center-Aligned Modern Minimalist) */}
      <section className="py-20 sm:py-28 bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          
          {/* Tagline Badge */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 text-black border border-zinc-200 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
              Your Health, Our Priority
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-black tracking-tight leading-[1.1]">
            Quality Healthcare <br className="hidden sm:inline" />
            <span className="text-zinc-400">For A Better</span> Tomorrow
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Book appointments, consult expert doctors and manage your health records in one simple, secure place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/appointment"
              className="px-8 py-3.5 bg-black hover:bg-zinc-800 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
            >
              Book Appointment
            </Link>
            <Link
              href="/doctors"
              className="px-8 py-3.5 bg-white border border-zinc-300 hover:bg-zinc-100 text-black font-bold text-sm rounded-xl transition-all"
            >
              Meet Our Doctors
            </Link>
          </div>

          {/* Key Hospital Stats */}
          <div className="pt-10 border-t border-zinc-100 max-w-2xl mx-auto grid grid-cols-3 gap-6 sm:gap-12 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-black">50+</p>
              <p className="text-xs text-zinc-500 font-semibold mt-0.5">Specialist Doctors</p>
            </div>
            <div className="border-x border-zinc-200 px-2 sm:px-4">
              <p className="text-2xl sm:text-3xl font-black text-black">10k+</p>
              <p className="text-xs text-zinc-500 font-semibold mt-0.5">Happy Patients</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-black">24/7</p>
              <p className="text-xs text-zinc-500 font-semibold mt-0.5">Hospital Support</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Feature Highlights (4 Pillars) */}
      <section className="py-12 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h4 className="text-sm font-bold text-black">Expert Doctors</h4>
              <p className="text-xs text-zinc-500 mt-1">Experienced and verified medical professionals</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h4 className="text-sm font-bold text-black">Easy Booking</h4>
              <p className="text-xs text-zinc-500 mt-1">Quick and hassle-free online appointments</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h4 className="text-sm font-bold text-black">24/7 Support</h4>
              <p className="text-xs text-zinc-500 mt-1">Dedicated helpline and patient assistance</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h4 className="text-sm font-bold text-black">Secure Records</h4>
              <p className="text-xs text-zinc-500 mt-1">Private, organized digital health history</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Departments Section */}
      <section id="departments" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-black">Our Departments</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Specialized healthcare for your specific needs</p>
            </div>
            <Link href="/doctors" className="text-xs font-bold text-black hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Doctors Section */}
      <section id="doctors" className="py-16 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-black">Meet Our Doctors</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Qualified doctors ready for consultation</p>
            </div>
            <Link href="/doctors" className="text-xs font-bold text-black hover:underline">
              Explore All Doctors →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
