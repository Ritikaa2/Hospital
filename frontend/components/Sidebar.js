'use client';

// Next.js routing hooks
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SidebarContent({ role = 'patient', userName = '' }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get('tab') : null;

  // Logout Handler: localStorage clear karke login page bhejta hai
  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  // Patient panel ke sidebar links
  const patientLinks = [
    { label: 'Dashboard', href: '/patient' },
    { label: 'Book Appointment', href: '/appointment' },
    { label: 'My Appointments', href: '/patient/appointments' },
    { label: 'Medical Records', href: '/patient/medical-records' },
    { label: 'Prescriptions', href: '/patient/medical-records?tab=prescriptions' },
    { label: 'Lab Reports', href: '/patient/medical-records?tab=lab-reports' },
    { label: 'Profile', href: '/patient' }
  ];

  // Doctor panel ke sidebar links
  const doctorLinks = [
    { label: 'Dashboard', href: '/doctor' },
    { label: 'My Patients', href: '/doctor?tab=patients' },
    { label: 'Appointments', href: '/doctor/appointments' },
    { label: 'Prescriptions', href: '/doctor?tab=prescriptions' },
    { label: 'Reports', href: '/doctor?tab=reports' },
    { label: 'Profile', href: '/doctor?tab=profile' }
  ];

  const links = role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <aside className="w-60 bg-white border-r border-zinc-200 flex flex-col shrink-0 min-h-[calc(100vh-5rem)]">
      
      {/* Sidebar Header */}
      <div className="p-5 border-b border-zinc-100 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
          +
        </div>
        <div>
          <h2 className="text-base font-black text-black leading-none">MediCare+</h2>
          <span className="text-[10px] text-zinc-400 capitalize font-medium">{role} Panel</span>
        </div>
      </div>

      {/* Navigation Links List */}
      <div className="p-3 flex-1 space-y-1">
        {links.map((item) => {
          let isActive = false;
          if (item.href.includes('?tab=')) {
            const tabParam = item.href.split('?tab=')[1];
            isActive = pathname === item.href.split('?')[0] && currentTab === tabParam;
          } else {
            isActive = pathname === item.href && !currentTab;
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-black text-white font-bold shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer: User Info & Logout Button */}
      <div className="p-4 border-t border-zinc-100">
        {userName && (
          <div className="mb-3 px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-200">
            <p className="text-xs font-bold text-black truncate">{userName}</p>
            <p className="text-[10px] text-zinc-400 capitalize font-semibold">{role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function Sidebar(props) {
  return (
    <Suspense fallback={<div className="w-60 bg-white border-r border-zinc-200" />}>
      <SidebarContent {...props} />
    </Suspense>
  );
}
