'use client';

// React hooks aur Next.js components
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorCard from '@/components/DoctorCard';

// Backend server URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function DoctorsContent() {
  const searchParams = useSearchParams();
  const initialSpecialization = searchParams.get('specialization') || 'All';

  // 1. State variables
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState(initialSpecialization);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // 2. Default fallback doctors agar backend connect na ho sake
  const fallbackDoctors = [
    { id: 1, name: 'Dr. Anjali Sharma', specialization: 'Cardiology', qualification: 'MBBS, MD', experience: '10+ Years', fee: 500, about: 'Specializing in heart diseases, preventive cardiology, and vascular health.' },
    { id: 2, name: 'Dr. Rohit Mehta', specialization: 'Dermatology', qualification: 'MBBS, MD', experience: '8+ Years', fee: 450, about: 'Expert in clinical dermatology, acne treatments, and skin allergies.' },
    { id: 3, name: 'Dr. Priya Patel', specialization: 'Neurology', qualification: 'MBBS, DM', experience: '12+ Years', fee: 700, about: 'Neurologist dedicated to migraines, stroke recovery, and brain wellness.' },
    { id: 4, name: 'Dr. Rajesh Verma', specialization: 'Orthopedics', qualification: 'MBBS, MS', experience: '14+ Years', fee: 600, about: 'Senior orthopedic surgeon specializing in joint replacement.' },
    { id: 5, name: 'Dr. Sneha Roy', specialization: 'Pediatrics', qualification: 'MBBS, MD', experience: '7+ Years', fee: 400, about: 'Compassionate pediatric care and child vaccinations.' },
    { id: 6, name: 'Dr. Vikram Malhotra', specialization: 'General Medicine', qualification: 'MBBS, MD', experience: '9+ Years', fee: 350, about: 'Primary healthcare doctor focusing on routine wellness and checkups.' }
  ];

  // 3. Backend se doctors fetch karne ka main function
  const fetchDoctors = async (spec = selectedSpec, query = search) => {
    setLoading(true);
    try {
      let url = `${API}/doctors?`;
      if (spec && spec !== 'All') {
        url += `specialization=${encodeURIComponent(spec)}&`;
      }
      if (query) {
        url += `search=${encodeURIComponent(query)}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setDoctors(data);
        } else {
          setDoctors(fallbackDoctors.filter(d => (spec === 'All' || d.specialization === spec)));
        }
      } else {
        setDoctors(fallbackDoctors);
      }
    } catch (e) {
      setDoctors(fallbackDoctors.filter(d => (spec === 'All' || d.specialization === spec)));
    } finally {
      setLoading(false);
    }
  };

  // 4. Initial load: Departments list lana aur doctors load karna
  useEffect(() => {
    async function loadDepartments() {
      try {
        const res = await fetch(`${API}/doctors/departments`);
        if (res.ok) {
          const data = await res.json();
          setDepartments([{ id: 0, name: 'All' }, ...data]);
        } else {
          throw new Error();
        }
      } catch (err) {
        setDepartments([
          { id: 0, name: 'All' },
          { id: 1, name: 'Cardiology' },
          { id: 2, name: 'Neurology' },
          { id: 3, name: 'Orthopedics' },
          { id: 4, name: 'Pediatrics' },
          { id: 5, name: 'Dermatology' },
          { id: 6, name: 'General Medicine' }
        ]);
      }
    }

    loadDepartments();
    fetchDoctors(initialSpecialization, '');
  }, [initialSpecialization]);

  // 5. Department filter click handler
  const handleFilterChange = (spec) => {
    setSelectedSpec(spec);
    fetchDoctors(spec, search);
  };

  // 6. Search form submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors(selectedSpec, search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
      
      {/* Search Header Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-10 text-center space-y-3 mb-8 shadow-xs">
        <h1 className="text-3xl sm:text-4xl font-black text-black">
          Find A Doctor
        </h1>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Search qualified doctors and book an in-person hospital appointment.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto pt-3 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-black focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Department Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        {departments.map((dept) => {
          const isSelected = selectedSpec === dept.name;
          return (
            <button
              key={dept.id || dept.name}
              onClick={() => handleFilterChange(dept.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-black'
              }`}
            >
              {dept.name}
            </button>
          );
        })}
      </div>

      {/* Doctors Grid List */}
      {loading ? (
        <div className="text-center py-16 text-zinc-400 text-xs">
          Loading doctors...
        </div>
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
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading...</div>}>
        <DoctorsContent />
      </Suspense>
      <Footer />
    </div>
  );
}
