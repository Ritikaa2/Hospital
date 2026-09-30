'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorCard from '@/components/DoctorCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function DoctorsContent() {
  const searchParams = useSearchParams();
  const initialSpecialization = searchParams.get('specialization') || 'All';

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState(initialSpecialization);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fallbackDoctors = [
    { id: 1, name: 'Dr. Anjali Sharma', specialization: 'Cardiology', qualification: 'MBBS, MD', experience: '10+ Years', fee: 500, about: 'Specializing in heart diseases, preventive cardiology, and vascular health.' },
    { id: 2, name: 'Dr. Rohit Mehta', specialization: 'Dermatology', qualification: 'MBBS, MD', experience: '8+ Years', fee: 450, about: 'Expert in clinical dermatology, acne treatments, and skin allergies.' },
    { id: 3, name: 'Dr. Priya Patel', specialization: 'Neurology', qualification: 'MBBS, DM', experience: '12+ Years', fee: 700, about: 'Neurologist dedicated to migraines, stroke recovery, and brain wellness.' },
    { id: 4, name: 'Dr. Rajesh Verma', specialization: 'Orthopedics', qualification: 'MBBS, MS', experience: '14+ Years', fee: 600, about: 'Senior orthopedic surgeon specializing in joint replacement.' },
    { id: 5, name: 'Dr. Sneha Roy', specialization: 'Pediatrics', qualification: 'MBBS, MD', experience: '7+ Years', fee: 400, about: 'Compassionate pediatric care and child vaccinations.' },
    { id: 6, name: 'Dr. Vikram Malhotra', specialization: 'General Medicine', qualification: 'MBBS, MD', experience: '9+ Years', fee: 350, about: 'Primary healthcare doctor focusing on routine wellness and checkups.' }
  ];

  const fetchDoctors = async (spec = selectedSpec, query = search) => {
    setLoading(true);
    try {
      let url = `${API}/doctors?`;
      if (spec && spec !== 'All') url += `specialization=${encodeURIComponent(spec)}&`;
      if (query) url += `search=${encodeURIComponent(query)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDoctors(data.length > 0 ? data : fallbackDoctors.filter(d => (spec === 'All' || d.specialization === spec)));
      } else {
        setDoctors(fallbackDoctors);
      }
    } catch (e) {
      setDoctors(fallbackDoctors.filter(d => (spec === 'All' || d.specialization === spec)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(`${API}/doctors/departments`)
      .then(res => res.json())
      .then(data => setDepartments([{ id: 0, name: 'All' }, ...data]))
      .catch(() => setDepartments([
        { id: 0, name: 'All' },
        { id: 1, name: 'Cardiology' },
        { id: 2, name: 'Neurology' },
        { id: 3, name: 'Orthopedics' },
        { id: 4, name: 'Pediatrics' },
        { id: 5, name: 'Dermatology' },
        { id: 6, name: 'General Medicine' }
      ]));

    fetchDoctors(initialSpecialization, '');
  }, [initialSpecialization]);

  const handleFilterChange = (spec) => {
    setSelectedSpec(spec);
    fetchDoctors(spec, search);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors(selectedSpec, search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center space-y-3 mb-8 shadow-xs">
        <h1 className="text-3xl font-bold text-slate-900">
          Find A Doctor
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Search qualified doctors and book an in-person hospital appointment.
        </p>

        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto pt-2 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        {departments.map((dept) => {
          const isSelected = selectedSpec === dept.name;
          return (
            <button
              key={dept.id || dept.name}
              onClick={() => handleFilterChange(dept.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {dept.name}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading doctors...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading...</div>}>
        <DoctorsContent />
      </Suspense>
      <Footer />
    </div>
  );
}
