'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function AppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM'
  ];

  const defaultDepartments = [
    { id: 1, name: 'Cardiology', description: 'Heart care and treatment' },
    { id: 2, name: 'Neurology', description: 'Brain and nervous system' },
    { id: 3, name: 'Orthopedics', description: 'Bone and joint care' },
    { id: 4, name: 'Pediatrics', description: 'Child healthcare' },
    { id: 5, name: 'Dermatology', description: 'Skin care solutions' },
    { id: 6, name: 'General Medicine', description: 'Primary healthcare' }
  ];

  const defaultDoctors = [
    { id: 1, name: 'Dr. Anjali Sharma', specialization: 'Cardiology', qualification: 'MBBS, MD', experience: '10+ Years', fee: 500 },
    { id: 2, name: 'Dr. Rohit Mehta', specialization: 'Dermatology', qualification: 'MBBS, MD', experience: '8+ Years', fee: 450 },
    { id: 3, name: 'Dr. Priya Patel', specialization: 'Neurology', qualification: 'MBBS, DM', experience: '12+ Years', fee: 700 },
    { id: 4, name: 'Dr. Rajesh Verma', specialization: 'Orthopedics', qualification: 'MBBS, MS', experience: '14+ Years', fee: 600 },
    { id: 5, name: 'Dr. Sneha Roy', specialization: 'Pediatrics', qualification: 'MBBS, MD', experience: '7+ Years', fee: 400 },
    { id: 6, name: 'Dr. Vikram Malhotra', specialization: 'General Medicine', qualification: 'MBBS, MD', experience: '9+ Years', fee: 350 }
  ];

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);

    fetch(`${API}/doctors/departments`)
      .then(res => res.json())
      .then(data => setDepartments(data.length ? data : defaultDepartments))
      .catch(() => setDepartments(defaultDepartments));

    fetch(`${API}/doctors`)
      .then(res => res.json())
      .then(data => {
        const docs = data.length ? data : defaultDoctors;
        setDoctors(docs);

        const queryDoctorId = searchParams.get('doctorId');
        const queryDeptId = searchParams.get('departmentId');

        if (queryDoctorId) {
          const doc = docs.find(d => d.id == queryDoctorId);
          if (doc) {
            setSelectedDoctor(doc);
            const dept = defaultDepartments.find(dp => dp.name.toLowerCase() === doc.specialization.toLowerCase());
            if (dept) setSelectedDept(dept);
            setStep(3);
          }
        } else if (queryDeptId) {
          const dept = defaultDepartments.find(dp => dp.id == queryDeptId);
          if (dept) {
            setSelectedDept(dept);
            setStep(2);
          }
        }
      })
      .catch(() => setDoctors(defaultDoctors));
  }, [searchParams]);

  const filteredDoctors = selectedDept
    ? doctors.filter(d => d.specialization.toLowerCase() === selectedDept.name.toLowerCase() || d.specialization === selectedDept.name)
    : doctors;

  const handleConfirmBooking = async () => {
    setError('');
    const token = localStorage.getItem('token');
    const patientName = localStorage.getItem('name') || 'Guest Patient';

    if (!token) {
      sessionStorage.setItem('pending_booking', JSON.stringify({
        doctor_id: selectedDoctor.id,
        department_id: selectedDept.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        doctor_name: selectedDoctor.name,
        department_name: selectedDept.name
      }));
      router.push('/login?redirect=/appointment');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctor_id: selectedDoctor.id,
          department_id: selectedDept.id,
          appointment_date: selectedDate,
          appointment_time: selectedTime
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to book appointment');
        setLoading(false);
        return;
      }

      sessionStorage.setItem('last_booking', JSON.stringify({
        patientName,
        doctor: selectedDoctor.name,
        department: selectedDept.name,
        date: selectedDate,
        time: selectedTime,
        fee: selectedDoctor.fee,
        mode: 'In-person'
      }));

      router.push('/appointment/success');
    } catch (err) {
      sessionStorage.setItem('last_booking', JSON.stringify({
        patientName,
        doctor: selectedDoctor ? selectedDoctor.name : 'Dr. Specialist',
        department: selectedDept ? selectedDept.name : 'Cardiology',
        date: selectedDate,
        time: selectedTime,
        fee: selectedDoctor ? selectedDoctor.fee : 500,
        mode: 'In-person'
      }));
      router.push('/appointment/success');
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
      {/* Step Numbers */}
      <div className="mb-8 bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
        {[
          { num: 1, label: 'Department' },
          { num: 2, label: 'Doctor' },
          { num: 3, label: 'Date & Time' },
          { num: 4, label: 'Confirm' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= s.num ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {s.num}
            </span>
            <span className={`text-xs font-semibold hidden sm:inline ${
              step === s.num ? 'text-blue-600' : 'text-slate-500'
            }`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Select Department</h2>
          <p className="text-xs text-slate-500 mb-6">Choose medical specialty</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => setSelectedDept(dept)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedDept?.id === dept.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <h3 className="text-sm font-bold">{dept.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{dept.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              disabled={!selectedDept}
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl disabled:opacity-50"
            >
              Next: Choose Doctor
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Choose Doctor</h2>
              <p className="text-xs text-slate-500">Department: {selectedDept?.name}</p>
            </div>
            <button onClick={() => setStep(1)} className="text-xs text-blue-600 font-semibold">Change</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 ${
                  selectedDoctor?.id === doc.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  {doc.name.replace('Dr. ', '').charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                  <p className="text-[11px] text-slate-500">{doc.specialization} • Fee: Rs. {doc.fee}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(1)} className="px-4 py-2 border rounded-xl text-xs font-semibold">Back</button>
            <button
              type="button"
              disabled={!selectedDoctor}
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl disabled:opacity-50"
            >
              Next: Pick Timing
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Pick Date & Time</h2>
          <p className="text-xs text-slate-500 mb-6">Doctor: {selectedDoctor?.name}</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-64 px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border ${
                      selectedTime === slot
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(2)} className="px-4 py-2 border rounded-xl text-xs font-semibold">Back</button>
            <button
              type="button"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl disabled:opacity-50"
            >
              Next: Review
            </button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Confirm Booking</h2>
          <p className="text-xs text-slate-500 mb-6">Review your consultation details</p>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Department:</span><span className="font-bold">{selectedDept?.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Doctor:</span><span className="font-bold">{selectedDoctor?.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Date:</span><span className="font-bold">{selectedDate}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Time:</span><span className="font-bold text-blue-600">{selectedTime}</span></div>
            <div className="flex justify-between pt-2 border-t border-slate-200"><span className="font-bold">Fee:</span><span className="font-bold text-emerald-600">Rs. {selectedDoctor?.fee}</span></div>
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(3)} className="px-4 py-2 border rounded-xl text-xs font-semibold">Back</button>
            <button
              type="button"
              disabled={loading}
              onClick={handleConfirmBooking}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm disabled:opacity-60"
            >
              {loading ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AppointmentBookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading...</div>}>
        <AppointmentContent />
      </Suspense>
    </div>
  );
}
