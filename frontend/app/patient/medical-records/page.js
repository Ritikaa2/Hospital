'use client';

// React hooks, Next.js routing, components
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

// Backend server URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function MedicalRecordsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  // 1. State variables
  const [userName, setUserName] = useState('');
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Fallback sample records agar backend se data na mile
  const fallbackRecords = [
    { id: 1, record_date: '10 Aug 2026', type: 'Lab Report', title: 'Complete Lipid Profile', description: 'Blood Test - Normal cholesterol levels. HDL: 54 mg/dL, LDL: 98 mg/dL.', doctor_name: 'Dr. Anjali Sharma' },
    { id: 2, record_date: '15 Jul 2026', type: 'Prescription', title: 'Vitamin D3 & Skin Serum', description: 'Tab Vitamin D3 60k once weekly. Apply hydrating serum twice daily.', doctor_name: 'Dr. Rohit Mehta' },
    { id: 3, record_date: '20 Jun 2026', type: 'Consultation', title: 'General Checkup & Wellness', description: 'BP: 120/80 mmHg, Pulse: 72 bpm. Routine checkup normal.', doctor_name: 'Dr. Vikram Malhotra' }
  ];

  // 3. useEffect: User auth check aur medical records load karna
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    if (!token) {
      router.push('/login');
      return;
    }

    setUserName(name || 'Patient');

    async function loadRecords() {
      try {
        const res = await fetch(`${API}/patients/medical-records`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const formatted = data.map(r => {
              const lowerTitle = (r.title || '').toLowerCase();
              let recordType = 'Consultation';

              if (lowerTitle.includes('prescription')) {
                recordType = 'Prescription';
              } else if (lowerTitle.includes('lab') || lowerTitle.includes('blood')) {
                recordType = 'Lab Report';
              }

              return { ...r, type: recordType };
            });
            setRecords(formatted);
          } else {
            setRecords(fallbackRecords);
          }
        } else {
          setRecords(fallbackRecords);
        }
      } catch (err) {
        setRecords(fallbackRecords);
      } finally {
        setLoading(false);
      }
    }

    loadRecords();
  }, [router]);

  // 4. Active tab ke basis par records filter karna
  const filteredRecords = records.filter(r => {
    if (activeTab === 'prescriptions') return r.type === 'Prescription';
    if (activeTab === 'lab-reports') return r.type === 'Lab Report';
    if (activeTab === 'consultation') return r.type === 'Consultation';
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
        <div className="text-xs font-bold text-black">{userName}</div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex">
        <Sidebar role="patient" userName={userName} />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-black">Medical Records</h1>
            <p className="text-xs text-zinc-500 mt-0.5">View prescriptions, lab reports, and consultation notes</p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
            
            {/* Filter Tabs */}
            <div className="flex border-b border-zinc-200 px-6 pt-3 gap-3 overflow-x-auto">
              {[
                { id: 'all', label: 'All Records' },
                { id: 'prescriptions', label: 'Prescriptions' },
                { id: 'lab-reports', label: 'Lab Reports' },
                { id: 'consultation', label: 'Consultation Notes' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-zinc-400 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Records Table */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12 text-zinc-400 text-xs">Loading records...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase">
                        <th className="pb-3 px-3">Date</th>
                        <th className="pb-3 px-3">Type</th>
                        <th className="pb-3 px-3">Description</th>
                        <th className="pb-3 px-3">Prescribed By</th>
                        <th className="pb-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700">
                      {filteredRecords.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-50">
                          <td className="py-3.5 px-3 font-semibold text-black whitespace-nowrap">{item.record_date}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                              item.type === 'Lab Report'
                                ? 'bg-zinc-100 text-black border-zinc-300'
                                : item.type === 'Prescription'
                                ? 'bg-black text-white border-black'
                                : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 max-w-xs">
                            <span className="font-bold text-black block truncate">{item.title}</span>
                            <span className="text-zinc-500 text-[11px] truncate block">{item.description}</span>
                          </td>
                          <td className="py-3.5 px-3 text-zinc-700 font-bold">{item.doctor_name || 'Dr. Specialist'}</td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedRecord(item)}
                              className="px-3 py-1 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-black text-xs font-bold transition-all"
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

          {/* Modal: Selected Record Details Pop-up */}
          {selectedRecord && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 shadow-2xl space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                  <h3 className="font-bold text-black text-sm">{selectedRecord.title}</h3>
                  <button onClick={() => setSelectedRecord(null)} className="font-black text-zinc-400 hover:text-black">✕</button>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Date:</span>
                  <span className="font-bold text-black">{selectedRecord.record_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Doctor:</span>
                  <span className="font-bold text-black">{selectedRecord.doctor_name}</span>
                </div>
                <div className="pt-2">
                  <span className="text-zinc-500 font-bold block mb-1">Prescription & Notes:</span>
                  <p className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 whitespace-pre-line text-zinc-800 font-medium leading-relaxed">
                    {selectedRecord.description}
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedRecord(null)}
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

export default function PatientMedicalRecordsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading...</div>}>
      <MedicalRecordsContent />
    </Suspense>
  );
}
