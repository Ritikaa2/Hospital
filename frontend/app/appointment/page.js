'use client';

// React hooks, Next.js routing, components
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

// Backend server URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function AppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Wizard Step State: 1 = Department, 2 = Doctor, 3 = Date & Time, 4 = Confirm
  const [step, setStep] = useState(1);

  // 2. Data State
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // 3. User Selection State
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');

  // 4. Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Available Time Slots
  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM'
  ];

  // Fallback Departments
  const defaultDepartments = [
    { id: 1, name: 'Cardiology', description: 'Heart care and treatment' },
    { id: 2, name: 'Neurology', description: 'Brain and nervous system' },
    { id: 3, name: 'Orthopedics', description: 'Bone and joint care' },
    { id: 4, name: 'Pediatrics', description: 'Child healthcare' },
    { id: 5, name: 'Dermatology', description: 'Skin care solutions' },
    { id: 6, name: 'General Medicine', description: 'Primary healthcare' }
  ];

  // Fallback Doctors
  const defaultDoctors = [
    { id: 1, name: 'Dr. Anjali Sharma', specialization: 'Cardiology', qualification: 'MBBS, MD', experience: '10+ Years', fee: 500 },
    { id: 2, name: 'Dr. Rohit Mehta', specialization: 'Dermatology', qualification: 'MBBS, MD', experience: '8+ Years', fee: 450 },
    { id: 3, name: 'Dr. Priya Patel', specialization: 'Neurology', qualification: 'MBBS, DM', experience: '12+ Years', fee: 700 },
    { id: 4, name: 'Dr. Rajesh Verma', specialization: 'Orthopedics', qualification: 'MBBS, MS', experience: '14+ Years', fee: 600 },
    { id: 5, name: 'Dr. Sneha Roy', specialization: 'Pediatrics', qualification: 'MBBS, MD', experience: '7+ Years', fee: 400 },
    { id: 6, name: 'Dr. Vikram Malhotra', specialization: 'General Medicine', qualification: 'MBBS, MD', experience: '9+ Years', fee: 350 }
  ];

  // 5. useEffect: Initial setup
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);

    async function loadBookingData() {
      try {
        const dRes = await fetch(`${API}/doctors/departments`);
        if (dRes.ok) {
          const dData = await dRes.json();
          setDepartments(dData.length > 0 ? dData : defaultDepartments);
        } else {
          setDepartments(defaultDepartments);
        }
      } catch (e) {
        setDepartments(defaultDepartments);
      }

      try {
        const docRes = await fetch(`${API}/doctors`);
        const docs = docRes.ok ? await docRes.json() : defaultDoctors;
        const doctorList = docs.length > 0 ? docs : defaultDoctors;
        setDoctors(doctorList);

        const queryDoctorId = searchParams.get('doctorId');
        const queryDeptId = searchParams.get('departmentId');

        if (queryDoctorId) {
          const matchedDoc = doctorList.find(d => d.id == queryDoctorId);
          if (matchedDoc) {
            setSelectedDoctor(matchedDoc);
            const matchedDept = defaultDepartments.find(
              dp => dp.name.toLowerCase() === matchedDoc.specialization.toLowerCase()
            );
            if (matchedDept) setSelectedDept(matchedDept);
            setStep(3);
          }
        } else if (queryDeptId) {
          const matchedDept = defaultDepartments.find(dp => dp.id == queryDeptId);
          if (matchedDept) {
            setSelectedDept(matchedDept);
            setStep(2);
          }
        }
      } catch (e) {
        setDoctors(defaultDoctors);
      }
    }

    loadBookingData();
  }, [searchParams]);

  const filteredDoctors = selectedDept
    ? doctors.filter(d => d.specialization.toLowerCase() === selectedDept.name.toLowerCase() || d.specialization === selectedDept.name)
    : doctors;

  // 6. Booking Confirmation
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
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full flex-1">
      
      {/* Step Indicator Header (1 to 4) */}
      <div className="mb-8 bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs flex items-center justify-between">
        {[
          { num: 1, label: 'Department' },
          { num: 2, label: 'Doctor' },
          { num: 3, label: 'Date & Time' },
          { num: 4, label: 'Confirm' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2.5">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
              step >= s.num ? 'bg-black text-white shadow-xs' : 'bg-zinc-100 text-zinc-400'
            }`}>
              {s.num}
            </span>
            <span className={`text-xs font-bold hidden sm:inline ${
              step === s.num ? 'text-black' : 'text-zinc-400'
            }`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Error Message Box */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* STEP 1: Select Department */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-black text-black mb-1">Select Department</h2>
          <p className="text-xs text-zinc-500 mb-6">Choose medical specialty</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => setSelectedDept(dept)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedDept?.id === dept.id
                    ? 'border-black bg-zinc-50 text-black shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <h3 className="text-sm font-bold text-black">{dept.name}</h3>
                <p className="text-[11px] text-zinc-500 mt-1">{dept.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              disabled={!selectedDept}
              onClick={() => setStep(2)}
              className="px-7 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              Next: Choose Doctor →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Doctor */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-black text-black">Choose Doctor</h2>
              <p className="text-xs text-zinc-500">Department: {selectedDept?.name}</p>
            </div>
            <button onClick={() => setStep(1)} className="text-xs text-black font-bold hover:underline">Change</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  selectedDoctor?.id === doc.id
                    ? 'border-black bg-zinc-50 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-black text-white font-black flex items-center justify-center text-sm shadow-xs">
                  {doc.name.replace('Dr. ', '').charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">{doc.name}</h4>
                  <p className="text-[11px] text-zinc-500">{doc.specialization} • Fee: Rs. {doc.fee}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-zinc-300 rounded-xl text-xs font-bold text-black hover:bg-zinc-50">Back</button>
            <button
              type="button"
              disabled={!selectedDoctor}
              onClick={() => setStep(3)}
              className="px-7 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              Next: Pick Timing →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Pick Date & Time */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-black text-black mb-1">Pick Date & Time</h2>
          <p className="text-xs text-zinc-500 mb-6">Doctor: {selectedDoctor?.name}</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedTime === slot
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(2)} className="px-5 py-2.5 border border-zinc-300 rounded-xl text-xs font-bold text-black hover:bg-zinc-50">Back</button>
            <button
              type="button"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(4)}
              className="px-7 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              Next: Review →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Confirm */}
      {step === 4 && (
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-black text-black mb-1">Confirm Booking</h2>
          <p className="text-xs text-zinc-500 mb-6">Review your consultation details</p>

          <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500 font-medium">Department:</span>
              <span className="font-bold text-black">{selectedDept?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 font-medium">Doctor:</span>
              <span className="font-bold text-black">{selectedDoctor?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 font-medium">Date:</span>
              <span className="font-bold text-black">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 font-medium">Time:</span>
              <span className="font-bold text-black">{selectedTime}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-zinc-200">
              <span className="font-bold text-black">Consultation Fee:</span>
              <span className="font-black text-black">Rs. {selectedDoctor?.fee}</span>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(3)} className="px-5 py-2.5 border border-zinc-300 rounded-xl text-xs font-bold text-black hover:bg-zinc-50">Back</button>
            <button
              type="button"
              disabled={loading}
              onClick={handleConfirmBooking}
              className="px-7 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-60"
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
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading...</div>}>
        <AppointmentContent />
      </Suspense>
    </div>
  );
}
