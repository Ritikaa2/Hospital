'use client';

import Link from 'next/link';

// DepartmentCard Component: Har hospital department ka ek card dikhane ke liye
export default function DepartmentCard({ department }) {
  if (!department) return null;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs hover:shadow-md hover:border-zinc-400 transition-all flex flex-col justify-between">
      
      {/* Top Section: Icon, Department Name aur Description */}
      <div>
        <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-black text-black text-sm mb-4">
          +
        </div>
        <h3 className="text-base font-bold text-black mb-1">
          {department.name}
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          {department.description}
        </p>
      </div>

      {/* Bottom Section: Action Links (Find Doctors aur Book) */}
      <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between">
        <Link
          href={`/doctors?specialization=${encodeURIComponent(department.name)}`}
          className="text-xs font-bold text-black hover:underline"
        >
          Find Doctors →
        </Link>
        <Link
          href={`/appointment?departmentId=${department.id}`}
          className="text-[11px] font-bold text-white bg-black hover:bg-zinc-800 px-3 py-1 rounded-lg transition-all"
        >
          Book
        </Link>
      </div>
    </div>
  );
}
