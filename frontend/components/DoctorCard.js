'use client';

import Link from 'next/link';

// DoctorCard Component: Har doctor ki profile info card me display karne ke liye
export default function DoctorCard({ doctor }) {
  if (!doctor) return null;

  // Doctor ke naam ka first letter avatar me show karne ke liye
  const doctorInitial = doctor.name ? doctor.name.replace('Dr. ', '').charAt(0) : 'D';

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs hover:shadow-md hover:border-zinc-400 transition-all flex flex-col justify-between">
      <div>
        
        {/* Top: Avatar, Specialization, Name, Qualification */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
            {doctorInitial}
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-black border border-zinc-200 mb-1">
              {doctor.specialization}
            </span>
            <h3 className="text-base font-bold text-black truncate">
              {doctor.name}
            </h3>
            <p className="text-xs text-zinc-500 truncate">
              {doctor.qualification || 'MBBS, MD'}
            </p>
          </div>
        </div>

        {/* Middle: Experience aur Consultation Fee */}
        <div className="mt-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
            <span className="text-zinc-400 block text-[10px] font-semibold uppercase">Experience</span>
            <span className="font-bold text-zinc-900">{doctor.experience || '8+ Years'}</span>
          </div>
          <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
            <span className="text-zinc-400 block text-[10px] font-semibold uppercase">Fee</span>
            <span className="font-extrabold text-black">Rs. {doctor.fee || '500'}</span>
          </div>
        </div>

        {/* Doctor Bio (About) */}
        {doctor.about && (
          <p className="mt-3 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {doctor.about}
          </p>
        )}
      </div>

      {/* Bottom: View Profile and Book Now Buttons */}
      <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center gap-2">
        <Link
          href={`/doctors/${doctor.id}`}
          className="flex-1 text-center py-2 px-3 border border-zinc-300 hover:bg-zinc-100 text-black text-xs font-bold rounded-xl transition-all"
        >
          View Profile
        </Link>
        <Link
          href={`/appointment?doctorId=${doctor.id}&specialization=${encodeURIComponent(doctor.specialization || '')}`}
          className="flex-1 text-center py-2 px-3 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
