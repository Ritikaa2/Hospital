'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar({ role = 'patient', userName = '' }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const patientLinks = [
    { label: 'Dashboard', href: '/patient' },
    { label: 'Book Appointment', href: '/appointment' },
    { label: 'My Appointments', href: '/patient/appointments' },
    { label: 'Medical Records', href: '/patient/medical-records' },
    { label: 'Prescriptions', href: '/patient/medical-records?tab=prescriptions' },
    { label: 'Lab Reports', href: '/patient/medical-records?tab=lab-reports' },
    { label: 'Profile', href: '/patient' }
  ];

  const doctorLinks = [
    { label: 'Dashboard', href: '/doctor' },
    { label: 'My Patients', href: '/doctor' },
    { label: 'Appointments', href: '/doctor/appointments' },
    { label: 'Prescriptions', href: '/doctor' },
    { label: 'Reports', href: '/doctor' },
    { label: 'Profile', href: '/doctor' }
  ];

  const links = role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <aside className="w-60 bg-white border-r border-slate-100 flex flex-col shrink-0 min-h-[calc(100vh-5rem)]">
      <div className="p-5 border-b border-slate-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          +
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-none">MediCare+</h2>
          <span className="text-[10px] text-slate-400 capitalize">{role} Panel</span>
        </div>
      </div>

      <div className="p-3 flex-1 space-y-1">
        {links.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100">
        {userName && (
          <div className="mb-3 px-2 py-1.5 bg-slate-50 rounded-lg">
            <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
            <p className="text-[10px] text-slate-400 capitalize">{role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
