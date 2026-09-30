'use client';

import Link from 'next/link';

export default function DepartmentCard({ department }) {
  if (!department) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm mb-4">
          +
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          {department.name}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {department.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
        <Link
          href={`/doctors?specialization=${encodeURIComponent(department.name)}`}
          className="text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          Find Doctors
        </Link>
        <Link
          href={`/appointment?departmentId=${department.id}`}
          className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg"
        >
          Book
        </Link>
      </div>
    </div>
  );
}
