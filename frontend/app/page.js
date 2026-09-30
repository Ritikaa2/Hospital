'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DepartmentCard from '@/components/DepartmentCard';
import DoctorCard from '@/components/DoctorCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function HomePage() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

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

  useEffect(() => {
    fetch(`${API}/doctors/departments`)
      .then(res => res.json())
      .then(data => setDepartments(data.length ? data : defaultDepartments))
      .catch(() => setDepartments(defaultDepartments));

    fetch(`${API}/doctors`)
      .then(res => res.json())
      .then(data => setDoctors(data.length ? data.slice(0, 3) : defaultDoctors))
      .catch(() => setDoctors(defaultDoctors));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                Your Health, Our Priority
              </span>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Quality Healthcare <br />
                <span className="text-blue-600">For A Better</span> Tomorrow
              </h1>

              <p className="text-base text-slate-600 max-w-lg leading-relaxed">
                Book appointments, consult expert doctors and manage your health records in one simple, secure place.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/appointment"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm"
                >
                  Book Appointment
                </Link>
                <Link
                  href="/doctors"
                  className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl"
                >
                  Meet Our Doctors
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center gap-8 text-xs">
                <div>
                  <p className="text-xl font-bold text-slate-900">50+</p>
                  <p className="text-slate-500">Specialist Doctors</p>
                </div>
                <div className="w-px h-6 bg-slate-200"></div>
                <div>
                  <p className="text-xl font-bold text-slate-900">10k+</p>
                  <p className="text-slate-500">Happy Patients</p>
                </div>
                <div className="w-px h-6 bg-slate-200"></div>
                <div>
                  <p className="text-xl font-bold text-slate-900">24/7</p>
                  <p className="text-slate-500">Hospital Support</p>
                </div>
              </div>
            </div>

            {/* Doctor Card Banner */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Featured Specialist</span>
                <h3 className="text-2xl font-bold">Dr. Anjali Sharma</h3>
                <p className="text-xs text-blue-100">Senior Cardiologist & Surgeon</p>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Dedicated to clinical excellence, cardiology consultations, and personalized patient recovery.
                </p>
                <div className="pt-4 border-t border-blue-500/50 flex justify-between text-xs">
                  <div>
                    <span className="font-bold block">10+ Years</span>
                    <span className="text-blue-200">Experience</span>
                  </div>
                  <div>
                    <span className="font-bold block">Rs. 500</span>
                    <span className="text-blue-200">Consultation</span>
                  </div>
                  <div>
                    <span className="font-bold block">Verified</span>
                    <span className="text-blue-200">Licence</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Feature Highlights */}
      <section className="py-10 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900">Expert Doctors</h4>
              <p className="text-xs text-slate-500 mt-1">Experienced and verified medical professionals</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900">Easy Booking</h4>
              <p className="text-xs text-slate-500 mt-1">Quick and hassle-free online appointments</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900">24/7 Support</h4>
              <p className="text-xs text-slate-500 mt-1">Dedicated helpline and patient assistance</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900">Secure Records</h4>
              <p className="text-xs text-slate-500 mt-1">Private, organized digital health history</p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Our Departments</h2>
              <p className="text-xs text-slate-500 mt-0.5">Specialized healthcare for your specific needs</p>
            </div>
            <Link href="/doctors" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section id="doctors" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Meet Our Doctors</h2>
              <p className="text-xs text-slate-500 mt-0.5">Qualified doctors ready for consultation</p>
            </div>
            <Link href="/doctors" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              Explore All Doctors
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
