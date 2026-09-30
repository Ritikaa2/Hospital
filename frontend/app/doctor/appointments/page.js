'use client';

// React hooks, Next.js routing, components
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

// Backend server URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DoctorAppointmentsPage() {
  const router = useRouter();

  // 1. State variables
  const [doctorName, setDoctorName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Prescription Modal State
  const [completeModalApp, setCompleteModalApp] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 3. View Prescription Details Modal State
  const [viewModalApp, setViewModalApp] = useState(null);

  // Fallback appointments for testing
  const fallbackAppointments = [
    { id: 1, appointment_time: '10:00 AM', appointment_date: '2026-10-05', patient_name: 'Ritika Toora', patient_email: 'ritika@gmail.com', department_name: 'Cardiology', status: 'Confirmed', prescription: 'Tab Atorvastatin 20mg OD at night\nTab Telmisartan 40mg OD in morning', consultation_title: 'Prescription - Hypertension' },
    { id: 2, appointment_time: '11:00 AM', appointment_date: '2026-10-05', patient_name: 'Aman Verma', patient_email: 'aman@gmail.com', department_name: 'Cardiology', status: 'Confirmed', prescription: 'Tab Aspirin 75mg OD after lunch', consultation_title: 'Prescription - Cardiac Checkup' }
  ];

  // 4. Backend se doctor appointments fetch karna
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

  // 5. useEffect: User authentication check
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

    setDoctorName(name || 'Dr. Specialist');
    fetchDoctorAppointments(token);
  }, [router]);

  // 6. Quick Status update handler (Confirm ya Cancel)
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

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white font-black text-lg shadow-sm">
            +
          </div>
          <span className="font-extrabold text-black text-lg tracking-tight">MediCare+</span>
        </Link>
        <div className="text-xs font-bold text-zinc-800 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200">
          {doctorName}
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex">
        <Sidebar role="doctor" userName={doctorName} />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-black tracking-tight">Appointments Schedule</h1>
            <p className="text-xs text-zinc-500 mt-1">Manage patient consultation appointments and prescriptions</p>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 shadow-sm p-6">
            {loading ? (
              <div className="text-center py-12 text-zinc-400 text-xs">Loading schedule...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                      <th className="pb-3 px-3">Date & Time</th>
                      <th className="pb-3 px-3">Patient</th>
                      <th className="pb-3 px-3">Email</th>
                      <th className="pb-3 px-3">Department</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3">Prescription</th>
                      <th className="pb-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {appointments.map((item) => {
                      const isConfirmed = item.status === 'Confirmed';
                      const isPending = item.status === 'Pending';
                      const isCompleted = item.status === 'Completed';

                      return (
                        <tr key={item.id} className="hover:bg-zinc-50/70 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-black whitespace-nowrap">
                            {item.appointment_date} ({item.appointment_time || '10:00 AM'})
                          </td>
                          <td className="py-3.5 px-3 font-extrabold text-black">{item.patient_name || 'Patient'}</td>
                          <td className="py-3.5 px-3 text-zinc-500">{item.patient_email || 'patient@gmail.com'}</td>
                          <td className="py-3.5 px-3 text-zinc-700 font-medium">{item.department_name || 'General'}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              isConfirmed
                                ? 'bg-black text-white border-black'
                                : isPending
                                ? 'bg-zinc-100 text-zinc-700 border-zinc-300'
                                : isCompleted
                                ? 'bg-zinc-100 text-black border-zinc-200'
                                : 'bg-zinc-50 text-zinc-400 border-zinc-200 line-through'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 max-w-xs">
                            {item.prescription ? (
                              <button
                                onClick={() => setViewModalApp(item)}
                                className="text-black hover:text-zinc-600 font-bold underline text-xs"
                              >
                                View Notes
                              </button>
                            ) : (
                              <span className="text-zinc-400">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleQuickStatus(item.id, 'Confirmed')}
                                  className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white rounded-xl font-bold text-xs transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleQuickStatus(item.id, 'Cancelled')}
                                  className="px-3 py-1.5 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 rounded-xl font-bold text-xs transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                            {isConfirmed && (
                              <>
                                <button
                                  onClick={() => openCompleteModal(item)}
                                  className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white rounded-xl font-bold text-xs transition-colors"
                                >
                                  Prescribe & Complete
                                </button>
                                <button
                                  onClick={() => handleQuickStatus(item.id, 'Cancelled')}
                                  className="px-3 py-1.5 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 rounded-xl font-bold text-xs transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                            {isCompleted && (
                              <button
                                onClick={() => setViewModalApp(item)}
                                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-200 rounded-xl font-bold text-xs transition-colors"
                              >
                                View Details
                              </button>
                            )}

                            {item.status === 'Cancelled' && (
                              <span className="text-zinc-400 text-xs">Cancelled</span>
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

          {/* Modal: Add Prescription */}
          {completeModalApp && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-zinc-200 shadow-2xl space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                  <h3 className="font-extrabold text-black text-sm">Add Prescription</h3>
                  <button onClick={() => setCompleteModalApp(null)} className="font-bold text-zinc-400 hover:text-black">✕</button>
                </div>

                <form onSubmit={handleCompleteConsultationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-zinc-800 font-bold mb-1.5">Diagnosis</label>
                    <input
                      type="text"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Viral Fever"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-800 font-bold mb-1.5">Prescription</label>
                    <textarea
                      rows={3}
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder="e.g. Tab Paracetamol 650mg TDS x 3 days"
                      className="w-full p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-800 font-bold mb-1.5">Doctor Notes</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Complete rest advised for 2 days"
                      className="w-full p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCompleteModalApp(null)}
                      className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save & Complete'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal: View Details */}
          {viewModalApp && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 shadow-2xl space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                  <h3 className="font-extrabold text-black text-sm">{viewModalApp.consultation_title || 'Consultation Details'}</h3>
                  <button onClick={() => setViewModalApp(null)} className="font-bold text-zinc-400 hover:text-black">✕</button>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500 font-medium">Patient:</span>
                  <span className="font-bold text-black">{viewModalApp.patient_name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500 font-medium">Date:</span>
                  <span className="font-bold text-black">{viewModalApp.appointment_date} ({viewModalApp.appointment_time})</span>
                </div>
                <div className="pt-2">
                  <span className="text-zinc-500 font-bold block mb-1.5">Prescription & Advice:</span>
                  <p className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 whitespace-pre-line text-zinc-800 font-mono text-[11px] leading-relaxed">
                    {viewModalApp.prescription || 'No prescription notes added.'}
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setViewModalApp(null)}
                    className="px-5 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl font-bold transition-colors"
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
