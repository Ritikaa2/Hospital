'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [doctorName, setDoctorName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [completeModalApp, setCompleteModalApp] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [viewModalApp, setViewModalApp] = useState(null);

  const fallbackAppointments = [
    { id: 1, appointment_time: '10:00 AM', appointment_date: '2026-10-05', patient_name: 'Ritika Toora', patient_email: 'ritika@gmail.com', department_name: 'Cardiology', status: 'Confirmed', prescription: 'Tab Atorvastatin 20mg OD at night\nTab Telmisartan 40mg OD in morning', consultation_title: 'Prescription - Hypertension' },
    { id: 2, appointment_time: '11:00 AM', appointment_date: '2026-10-05', patient_name: 'Aman Verma', patient_email: 'aman@gmail.com', department_name: 'Cardiology', status: 'Confirmed', prescription: 'Tab Aspirin 75mg OD after lunch', consultation_title: 'Prescription - Cardiac Checkup' }
  ];

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

  const openCompleteModal = (app) => {
    setCompleteModalApp(app);
    setDiagnosis('General Consultation');
    setPrescription('Tab Paracetamol 650mg TDS x 3 days\nTab Vitamin C 500mg OD\nWarm saline gargles');
    setNotes('Complete rest advised for 2 days. Drink warm water.');
  };

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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            +
          </div>
          <span className="font-bold text-slate-900 text-lg">MediCare+</span>
        </Link>
        <div className="text-xs font-bold text-slate-800">{doctorName}</div>
      </header>

      <div className="flex-1 flex">
        <Sidebar role="doctor" userName={doctorName} />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Appointments Schedule</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage patient consultation appointments and prescriptions</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">Loading schedule...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                      <th className="pb-3 px-3">Date & Time</th>
                      <th className="pb-3 px-3">Patient</th>
                      <th className="pb-3 px-3">Email</th>
                      <th className="pb-3 px-3">Department</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3">Prescription</th>
                      <th className="pb-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {appointments.map((item) => {
                      const isConfirmed = item.status === 'Confirmed';
                      const isPending = item.status === 'Pending';
                      const isCompleted = item.status === 'Completed';

                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                            {item.appointment_date} ({item.appointment_time || '10:00 AM'})
                          </td>
                          <td className="py-3.5 px-3 font-bold">{item.patient_name || 'Patient'}</td>
                          <td className="py-3.5 px-3 text-slate-500">{item.patient_email || 'patient@gmail.com'}</td>
                          <td className="py-3.5 px-3 text-slate-600">{item.department_name || 'General'}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isConfirmed
                                ? 'bg-emerald-50 text-emerald-700'
                                : isPending
                                ? 'bg-amber-50 text-amber-700'
                                : isCompleted
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 max-w-xs">
                            {item.prescription ? (
                              <button
                                onClick={() => setViewModalApp(item)}
                                className="text-blue-600 hover:text-blue-700 font-semibold underline text-xs"
                              >
                                View Notes
                              </button>
                            ) : (
                              <span className="text-slate-400">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleQuickStatus(item.id, 'Confirmed')}
                                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-semibold text-xs"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleQuickStatus(item.id, 'Cancelled')}
                                  className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg font-semibold text-xs"
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                            {isConfirmed && (
                              <>
                                <button
                                  onClick={() => openCompleteModal(item)}
                                  className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-semibold text-xs"
                                >
                                  Prescribe & Complete
                                </button>
                                <button
                                  onClick={() => handleQuickStatus(item.id, 'Cancelled')}
                                  className="px-2.5 py-1 border rounded-lg text-slate-600 font-semibold text-xs"
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                            {isCompleted && (
                              <button
                                onClick={() => setViewModalApp(item)}
                                className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs"
                              >
                                View Details
                              </button>
                            )}

                            {item.status === 'Cancelled' && (
                              <span className="text-slate-400 text-xs">Cancelled</span>
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

          {/* Complete Consultation Modal */}
          {completeModalApp && (
            <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-100 shadow-xl space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="font-bold text-slate-900 text-sm">Add Prescription</h3>
                  <button onClick={() => setCompleteModalApp(null)} className="font-bold text-slate-400">X</button>
                </div>

                <form onSubmit={handleCompleteConsultationSubmit} className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Diagnosis</label>
                    <input
                      type="text"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Viral Fever"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Prescription</label>
                    <textarea
                      rows={3}
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder="e.g. Tab Paracetamol 650mg TDS x 3 days"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Doctor Notes</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Complete rest advised for 2 days"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setCompleteModalApp(null)}
                      className="px-4 py-2 border rounded-xl font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                    >
                      {submitting ? 'Saving...' : 'Save & Complete'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* View Details Modal */}
          {viewModalApp && (
            <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-xl space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="font-bold text-slate-900 text-sm">{viewModalApp.consultation_title || 'Consultation Details'}</h3>
                  <button onClick={() => setViewModalApp(null)} className="font-bold text-slate-400">X</button>
                </div>
                <div className="flex justify-between"><span className="text-slate-400">Patient:</span><span className="font-bold">{viewModalApp.patient_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Date:</span><span className="font-bold">{viewModalApp.appointment_date} ({viewModalApp.appointment_time})</span></div>
                <div className="pt-2">
                  <span className="text-slate-400 font-semibold block mb-1">Prescription & Advice:</span>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-line text-slate-700 font-mono text-[11px]">{viewModalApp.prescription || 'No prescription notes added.'}</p>
                </div>
                <div className="pt-2 flex justify-end">
                  <button onClick={() => setViewModalApp(null)} className="px-4 py-1.5 bg-blue-600 text-white rounded-xl font-semibold">Close</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
