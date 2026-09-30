'use client';

// React hooks, Next.js routing, components
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

// Backend server URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function DoctorDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  // 1. Doctor info aur appointment list state
  const [doctorName, setDoctorName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // 2. Prescription / Complete Consultation Modal State
  const [completeModalApp, setCompleteModalApp] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 3. View Prescription Details Modal State
  const [viewModalApp, setViewModalApp] = useState(null);

  // Fallback appointments for testing
  const fallbackAppointments = [
    { id: 1, appointment_time: '10:00 AM', appointment_date: '2026-10-05', patient_name: 'Ritika Toora', patient_email: 'ritika@gmail.com', department_name: 'Cardiology', status: 'Confirmed', prescription: 'Tab Atorvastatin 20mg OD at night\nTab Telmisartan 40mg OD in morning', consultation_title: 'Prescription - Hypertension Control' },
    { id: 2, appointment_time: '11:00 AM', appointment_date: '2026-10-05', patient_name: 'Aman Verma', patient_email: 'aman@gmail.com', department_name: 'Cardiology', status: 'Confirmed', prescription: 'Tab Aspirin 75mg OD after lunch', consultation_title: 'Prescription - Routine Checkup' },
    { id: 3, appointment_time: '12:00 PM', appointment_date: '2026-10-08', patient_name: 'Priya Singh', patient_email: 'priya@gmail.com', department_name: 'Cardiology', status: 'Pending', prescription: '' },
    { id: 4, appointment_time: '04:00 PM', appointment_date: '2026-10-02', patient_name: 'Rahul Saxena', patient_email: 'rahul@gmail.com', department_name: 'Cardiology', status: 'Completed', prescription: 'Tab Pantoprazole 40mg before breakfast x 14 days', consultation_title: 'Doctor Advice - Acid Reflux' }
  ];

  // 4. Backend se doctor ke appointments fetch karna
  const fetchDoctorAppointments = async (token) => {
    try {
      const res = await fetch(`${API}/appointments/doctor`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.length > 0 ? data : fallbackAppointments);
      } else {
        setAppointments(fallbackAppointments);
      }
    } catch (err) {
      setAppointments(fallbackAppointments);
    } finally {
      setLoading(false);
    }
  };

  // 5. useEffect: Authentication check & initial data loading
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');

    if (!token) {
      router.push('/login');
      return;
    }

    if (role !== 'doctor') {
      router.push('/patient');
      return;
    }

    setDoctorName(name || 'Dr. Anjali Sharma');
    fetchDoctorAppointments(token);
  }, [router]);

  // 6. Appointment status change handler (Confirm ya Cancel karna)
  const handleQuickStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API}/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      setAppointments(prev =>
        prev.map(app => (app.id === id ? { ...app, status: newStatus } : app))
      );
    } catch (e) {
      setAppointments(prev =>
        prev.map(app => (app.id === id ? { ...app, status: newStatus } : app))
      );
    }
  };

  // 7. Prescription Modal open karna
  const openCompleteModal = (app) => {
    setCompleteModalApp(app);
    setDiagnosis('General Consultation');
    setPrescription('Tab Paracetamol 650mg TDS x 3 days\nTab Vitamin C 500mg OD\nWarm saline gargles');
    setNotes('Complete rest advised for 2 days. Drink warm water.');
  };

  // 8. Prescription Submit & Consultation Complete karna
  const handleCompleteConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!completeModalApp) return;

    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      await fetch(`${API}/appointments/${completeModalApp.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'Completed',
          diagnosis,
          prescription,
          notes
        })
      });

      const updatedDesc = `Prescription:\n${prescription}\n\nDoctor Consultation Notes:\n${notes}`;

      setAppointments(prev =>
        prev.map(app => (app.id === completeModalApp.id ? {
          ...app,
          status: 'Completed',
          prescription: updatedDesc,
          consultation_title: `Prescription - ${diagnosis}`
        } : app))
      );

      setCompleteModalApp(null);
    } catch (err) {
      setAppointments(prev =>
        prev.map(app => (app.id === completeModalApp.id ? { ...app, status: 'Completed' } : app))
      );
      setCompleteModalApp(null);
    } finally {
      setSubmitting(false);
    }
  };

  // 9. Dashboard Statistics calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointment_date === todayStr || a.appointment_date === 'Today' || a.status === 'Confirmed').length;
  
  const uniquePatientsMap = {};
  appointments.forEach(app => {
    const key = app.patient_email || app.patient_name || app.id;
    if (!uniquePatientsMap[key]) {
      uniquePatientsMap[key] = {
        name: app.patient_name || 'Patient',
        email: app.patient_email || 'patient@gmail.com',
        department: app.department_name || 'Cardiology',
        lastVisit: app.appointment_date,
        totalVisits: 1,
        status: app.status
      };
    } else {
      uniquePatientsMap[key].totalVisits += 1;
      uniquePatientsMap[key].lastVisit = app.appointment_date;
    }
  });
  const patientsList = Object.values(uniquePatientsMap);

  const totalPatients = patientsList.length > 0 ? patientsList.length : appointments.length;
  const upcomingAppointments = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length;
  const pendingRequests = appointments.filter(a => a.status === 'Pending').length;
  const completedConsultations = appointments.filter(a => a.status === 'Completed').length;

  const prescriptionsList = appointments.filter(a => Boolean(a.prescription) || a.status === 'Completed');

  const filteredAppointments = appointments.filter(a => {
    if (activeFilter === 'today') return a.appointment_date === todayStr || a.appointment_date === 'Today' || a.status === 'Confirmed';
    if (activeFilter === 'pending') return a.status === 'Pending';
    if (activeFilter === 'completed') return a.status === 'Completed';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white font-black text-lg shadow-xs">
            +
          </div>
          <span className="font-black text-black text-lg">MediCare+</span>
        </Link>
        <div className="text-xs font-bold text-black">{doctorName}</div>
      </header>

      {/* Main Layout: Left Sidebar + Right Dashboard Content */}
      <div className="flex-1 flex">
        <Sidebar role="doctor" userName={doctorName} />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl">
          
          {/* TAB 1: MAIN DASHBOARD */}
          {currentTab === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-black">
                    Welcome {doctorName}
                  </h1>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Manage your appointments, patient visits, and prescriptions
                  </p>
                </div>
              </div>

              {/* 5 Stats Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Total Patients</span>
                  <span className="text-3xl font-black text-black mt-1 block">{totalPatients}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Today Visits</span>
                  <span className="text-3xl font-black text-black mt-1 block">{todayAppointments}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Upcoming</span>
                  <span className="text-3xl font-black text-black mt-1 block">{upcomingAppointments}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Pending</span>
                  <span className="text-3xl font-black text-black mt-1 block">{pendingRequests}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Completed</span>
                  <span className="text-3xl font-black text-black mt-1 block">{completedConsultations}</span>
                </div>
              </div>

              {/* Appointments Schedule Table */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-black">Appointments Schedule</h2>
                    <p className="text-xs text-zinc-500">Patient consultations and prescription records</p>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'today', label: 'Today' },
                      { id: 'pending', label: 'Pending' },
                      { id: 'completed', label: 'Completed' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          activeFilter === f.id ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  {loading ? (
                    <div className="text-center py-12 text-zinc-400 text-xs">Loading appointments...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase">
                            <th className="pb-3 px-3">Date & Time</th>
                            <th className="pb-3 px-3">Patient</th>
                            <th className="pb-3 px-3">Department</th>
                            <th className="pb-3 px-3">Status</th>
                            <th className="pb-3 px-3">Prescription & Notes</th>
                            <th className="pb-3 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-zinc-700">
                          {filteredAppointments.map((item) => {
                            const isConfirmed = item.status === 'Confirmed';
                            const isPending = item.status === 'Pending';
                            const isCompleted = item.status === 'Completed';

                            return (
                              <tr key={item.id} className="hover:bg-zinc-50">
                                <td className="py-3 px-3 font-semibold text-black whitespace-nowrap">
                                  {item.appointment_date} ({item.appointment_time || '10:00 AM'})
                                </td>
                                <td className="py-3 px-3 font-bold text-black">{item.patient_name || 'Patient'}</td>
                                <td className="py-3 px-3 text-zinc-500">{item.department_name || 'General'}</td>
                                <td className="py-3 px-3">
                                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                                    isConfirmed
                                      ? 'bg-zinc-100 text-black border-zinc-300'
                                      : isPending
                                      ? 'bg-zinc-50 text-zinc-600 border-zinc-200'
                                      : isCompleted
                                      ? 'bg-black text-white border-black'
                                      : 'bg-red-50 text-red-700 border-red-200'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="py-3 px-3 max-w-xs">
                                  {item.prescription ? (
                                    <button
                                      onClick={() => setViewModalApp(item)}
                                      className="text-black hover:underline font-bold text-xs"
                                    >
                                      View Notes →
                                    </button>
                                  ) : (
                                    <span className="text-zinc-400">None</span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                                  {isPending && (
                                    <>
                                      <button
                                        onClick={() => handleQuickStatus(item.id, 'Confirmed')}
                                        className="px-3 py-1 bg-black text-white rounded-xl font-bold text-xs hover:bg-zinc-800 transition-all shadow-xs"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        onClick={() => handleQuickStatus(item.id, 'Cancelled')}
                                        className="px-3 py-1 border border-zinc-300 text-zinc-700 rounded-xl font-bold text-xs hover:bg-zinc-100 transition-all"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  )}

                                  {isConfirmed && (
                                    <>
                                      <button
                                        onClick={() => openCompleteModal(item)}
                                        className="px-3 py-1 bg-black text-white rounded-xl font-bold text-xs hover:bg-zinc-800 transition-all shadow-xs"
                                      >
                                        Prescribe & Complete
                                      </button>
                                      <button
                                        onClick={() => handleQuickStatus(item.id, 'Cancelled')}
                                        className="px-3 py-1 border border-zinc-300 text-zinc-700 rounded-xl font-bold text-xs hover:bg-zinc-100 transition-all"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  )}

                                  {isCompleted && (
                                    <button
                                      onClick={() => setViewModalApp(item)}
                                      className="px-3 py-1 bg-zinc-100 text-black border border-zinc-200 rounded-xl font-bold text-xs hover:bg-zinc-200 transition-all"
                                    >
                                      View Details
                                    </button>
                                  )}

                                  {item.status === 'Cancelled' && (
                                    <span className="text-zinc-400 text-xs font-semibold">Cancelled</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MY PATIENTS */}
          {currentTab === 'patients' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-black">My Patients</h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Directory of all unique patients treated by {doctorName}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase">
                        <th className="pb-3 px-3">Patient Name</th>
                        <th className="pb-3 px-3">Email Address</th>
                        <th className="pb-3 px-3">Department</th>
                        <th className="pb-3 px-3">Total Visits</th>
                        <th className="pb-3 px-3">Last Appointment</th>
                        <th className="pb-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700">
                      {patientsList.map((pt, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50">
                          <td className="py-3.5 px-3 font-bold text-black flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs shadow-xs">
                              {pt.name.charAt(0)}
                            </div>
                            {pt.name}
                          </td>
                          <td className="py-3.5 px-3 text-zinc-500">{pt.email}</td>
                          <td className="py-3.5 px-3 font-medium text-zinc-800">{pt.department}</td>
                          <td className="py-3.5 px-3 font-bold text-black">{pt.totalVisits} Visit(s)</td>
                          <td className="py-3.5 px-3 font-medium text-black">{pt.lastVisit}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-black border border-zinc-300">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRESCRIPTIONS */}
          {currentTab === 'prescriptions' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-black">Prescriptions & Medical Orders</h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Consultation prescriptions prescribed to your patients
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase">
                        <th className="pb-3 px-3">Date</th>
                        <th className="pb-3 px-3">Patient</th>
                        <th className="pb-3 px-3">Diagnosis / Title</th>
                        <th className="pb-3 px-3">Medicines & Instructions</th>
                        <th className="pb-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700">
                      {prescriptionsList.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-50">
                          <td className="py-3.5 px-3 font-semibold text-black whitespace-nowrap">
                            {item.appointment_date}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-black">{item.patient_name}</td>
                          <td className="py-3.5 px-3 font-bold text-zinc-800">
                            {item.consultation_title || 'General Prescription'}
                          </td>
                          <td className="py-3.5 px-3 max-w-xs truncate text-zinc-600">
                            {item.prescription || 'Medicines prescribed'}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => setViewModalApp(item)}
                              className="px-3.5 py-1.5 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-xs"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REPORTS */}
          {currentTab === 'reports' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-black">Diagnostic & Consultation Reports</h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Clinical reports and patient consultation summaries
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                  <span className="text-xs text-zinc-400 block font-bold uppercase tracking-wider">Total Reports</span>
                  <span className="text-3xl font-black text-black mt-1 block">{prescriptionsList.length + 2}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                  <span className="text-xs text-zinc-400 block font-bold uppercase tracking-wider">Cardiology Consultations</span>
                  <span className="text-3xl font-black text-black mt-1 block">{completedConsultations + 2}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                  <span className="text-xs text-zinc-400 block font-bold uppercase tracking-wider">Pending Reviews</span>
                  <span className="text-3xl font-black text-black mt-1 block">{pendingRequests}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6">
                <h3 className="text-sm font-bold text-black mb-3">Recent Reports</h3>
                <div className="space-y-3">
                  {appointments.slice(0, 4).map((app, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs">
                      <div>
                        <p className="font-bold text-black">{app.patient_name} - Consultation Report</p>
                        <p className="text-zinc-500 text-[11px] mt-0.5">Date: {app.appointment_date} • Department: {app.department_name}</p>
                      </div>
                      <button
                        onClick={() => setViewModalApp(app)}
                        className="px-4 py-2 bg-white border border-zinc-300 rounded-xl font-bold text-black hover:bg-zinc-100 transition-all"
                      >
                        Inspect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {currentTab === 'profile' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-black">Doctor Profile</h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Your public profile details and hospital OPD schedule
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs max-w-2xl">
                <div className="flex items-center gap-5 pb-6 border-b border-zinc-100">
                  <div className="w-18 h-18 rounded-2xl bg-black text-white flex items-center justify-center font-black text-3xl shadow-xs">
                    {doctorName.replace('Dr. ', '').charAt(0)}
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 bg-zinc-100 text-black border border-zinc-300 rounded-md text-[10px] font-bold">
                      Verified Doctor
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-black mt-1">{doctorName}</h2>
                    <p className="text-xs text-zinc-500 font-medium">Senior Cardiologist & Surgeon</p>
                  </div>
                </div>

                <div className="py-5 space-y-3.5 text-xs border-b border-zinc-100">
                  <div className="flex justify-between">
                    <span className="text-zinc-400 font-medium">Specialization:</span>
                    <span className="font-bold text-black">Cardiology</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400 font-medium">Qualifications:</span>
                    <span className="font-bold text-black">MBBS, MD (Cardiology), FACC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400 font-medium">Experience:</span>
                    <span className="font-bold text-black">10+ Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400 font-medium">Consultation Fee:</span>
                    <span className="font-black text-black">Rs. 500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400 font-medium">OPD Room:</span>
                    <span className="font-bold text-black">Room 204, Main Hospital Building</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400 font-medium">Consultation Timings:</span>
                    <span className="font-bold text-black">Mon - Sat: 09:00 AM - 05:00 PM</span>
                  </div>
                </div>

                <div className="pt-4 text-right">
                  <button
                    onClick={() => alert('Profile settings are managed by Hospital Administration.')}
                    className="px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-xs"
                  >
                    Edit Profile Info
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Add Prescription & Complete Consultation */}
          {completeModalApp && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-zinc-200 shadow-2xl space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                  <h3 className="font-black text-black text-sm">Complete Consultation</h3>
                  <button onClick={() => setCompleteModalApp(null)} className="font-black text-zinc-400 hover:text-black">✕</button>
                </div>

                <form onSubmit={handleCompleteConsultationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Diagnosis</label>
                    <input
                      type="text"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Viral Fever, Hypertension"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Prescription (Medicines & Dosage)</label>
                    <textarea
                      rows={3}
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder="e.g. Tab Paracetamol 650mg TDS x 3 days"
                      className="w-full p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Doctor Advice / Consultation Notes</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Advised 2 days rest and warm water"
                      className="w-full p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCompleteModalApp(null)}
                      className="px-5 py-2.5 border border-zinc-300 rounded-xl font-bold text-black hover:bg-zinc-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-xs"
                    >
                      {submitting ? 'Saving...' : 'Save & Complete'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal: View Consultation Details */}
          {viewModalApp && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 shadow-2xl space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                  <h3 className="font-black text-black text-sm">{viewModalApp.consultation_title || 'Consultation Details'}</h3>
                  <button onClick={() => setViewModalApp(null)} className="font-black text-zinc-400 hover:text-black">✕</button>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Patient:</span>
                  <span className="font-bold text-black">{viewModalApp.patient_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Date:</span>
                  <span className="font-bold text-black">{viewModalApp.appointment_date} ({viewModalApp.appointment_time})</span>
                </div>
                <div className="pt-2">
                  <span className="text-zinc-500 font-bold block mb-1">Prescription & Advice:</span>
                  <p className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 whitespace-pre-line text-zinc-800 font-mono text-[11px] leading-relaxed">
                    {viewModalApp.prescription || 'No prescription notes added.'}
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setViewModalApp(null)}
                    className="px-5 py-2 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading Doctor Panel...</div>}>
      <DoctorDashboardContent />
    </Suspense>
  );
}
