'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function MedicalRecordsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [userName, setUserName] = useState('');
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const fallbackRecords = [
    { id: 1, record_date: '10 Aug 2026', type: 'Lab Report', title: 'Complete Lipid Profile', description: 'Blood Test - Normal cholesterol levels. HDL: 54 mg/dL, LDL: 98 mg/dL.', doctor_name: 'Dr. Anjali Sharma' },
    { id: 2, record_date: '15 Jul 2026', type: 'Prescription', title: 'Vitamin D3 & Skin Serum', description: 'Tab Vitamin D3 60k once weekly. Apply hydrating serum twice daily.', doctor_name: 'Dr. Rohit Mehta' },
    { id: 3, record_date: '20 Jun 2026', type: 'Consultation', title: 'General Checkup & Wellness', description: 'BP: 120/80 mmHg, Pulse: 72 bpm. Routine checkup normal.', doctor_name: 'Dr. Vikram Malhotra' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    if (!token) {
      router.push('/login');
      return;
    }

    setUserName(name || 'Patient');

    fetch(`${API}/patients/medical-records`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRecords(data.length > 0 ? data.map(r => ({
          ...r,
          type: r.title && r.title.toLowerCase().includes('prescription') ? 'Prescription' : r.title && (r.title.toLowerCase().includes('lab') || r.title.toLowerCase().includes('blood')) ? 'Lab Report' : 'Consultation'
        })) : fallbackRecords);
      })
      .catch(() => setRecords(fallbackRecords))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = records.filter(r => {
    if (activeTab === 'prescriptions') return r.type === 'Prescription';
    if (activeTab === 'lab-reports') return r.type === 'Lab Report';
    if (activeTab === 'consultation') return r.type === 'Consultation';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            +
          </div>
          <span className="font-bold text-slate-900 text-lg">MediCare+</span>
        </Link>
        <div className="text-xs font-bold text-slate-800">{userName}</div>
      </header>

      <div className="flex-1 flex">
        <Sidebar role="patient" userName={userName} />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Medical Records</h1>
            <p className="text-xs text-slate-500 mt-0.5">View prescriptions, lab reports, and consultation notes</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="flex border-b border-slate-100 px-6 pt-3 gap-2 overflow-x-auto">
              {[
                { id: 'all', label: 'All Records' },
                { id: 'prescriptions', label: 'Prescriptions' },
                { id: 'lab-reports', label: 'Lab Reports' },
                { id: 'consultation', label: 'Consultation Notes' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2.5 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12 text-slate-400 text-xs">Loading records...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                        <th className="pb-3 px-3">Date</th>
                        <th className="pb-3 px-3">Type</th>
                        <th className="pb-3 px-3">Description</th>
                        <th className="pb-3 px-3">Prescribed By</th>
                        <th className="pb-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {filtered.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3 font-semibold text-slate-900 whitespace-nowrap">{item.record_date}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.type === 'Lab Report'
                                ? 'bg-purple-50 text-purple-700'
                                : item.type === 'Prescription'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 max-w-xs">
                            <span className="font-bold text-slate-800 block truncate">{item.title}</span>
                            <span className="text-slate-500 text-[11px] truncate block">{item.description}</span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-600 font-medium">{item.doctor_name || 'Dr. Specialist'}</td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedRecord(item)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-xs font-semibold"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {selectedRecord && (
            <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-xl space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="font-bold text-slate-900 text-sm">{selectedRecord.title}</h3>
                  <button onClick={() => setSelectedRecord(null)} className="font-bold text-slate-400">X</button>
                </div>
                <div className="flex justify-between"><span className="text-slate-400">Date:</span><span className="font-bold">{selectedRecord.record_date}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Doctor:</span><span className="font-bold">{selectedRecord.doctor_name}</span></div>
                <div className="pt-2">
                  <span className="text-slate-400 font-semibold block mb-1">Prescription & Notes:</span>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-line text-slate-700">{selectedRecord.description}</p>
                </div>
                <div className="pt-2 flex justify-end">
                  <button onClick={() => setSelectedRecord(null)} className="px-4 py-1.5 bg-blue-600 text-white rounded-xl font-semibold">Close</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function PatientMedicalRecordsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading...</div>}>
      <MedicalRecordsContent />
    </Suspense>
  );
}
