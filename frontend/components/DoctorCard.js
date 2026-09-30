'use client';

import Link from 'next/link';

export default function DoctorCard({ doctor }) {
  if (!doctor) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {doctor.name ? doctor.name.replace('Dr. ', '').charAt(0) : 'D'}
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 mb-1">
              {doctor.specialization}
            </span>
            <h3 className="text-base font-bold text-slate-900 truncate">
              {doctor.name}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {doctor.qualification || 'MBBS, MD'}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-50 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="text-slate-400 block text-[10px]">Experience</span>
            <span className="font-bold text-slate-700">{doctor.experience || '8+ Years'}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="text-slate-400 block text-[10px]">Fee</span>
            <span className="font-bold text-emerald-600">Rs. {doctor.fee || '500'}</span>
          </div>
        </div>

        {doctor.about && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {doctor.about}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        <Link
          href={`/doctors/${doctor.id}`}
          className="flex-1 text-center py-2 px-3 border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 text-xs font-semibold rounded-xl"
        >
          View Profile
        </Link>
        <Link
          href={`/appointment?doctorId=${doctor.id}&specialization=${encodeURIComponent(doctor.specialization)}`}
          className="flex-1 text-center py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
