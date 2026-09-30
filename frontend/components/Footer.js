import Link from 'next/link';

// Footer Component: Website ke bottom footer links aur hospital contact details
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-black text-zinc-400 pt-14 pb-8 mt-auto border-t border-zinc-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-800/80">
          
          {/* Column 1: Hospital Info (About Anchor) */}
          <div id="about" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black text-lg">
                +
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">MediCare+</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Quality healthcare for a better tomorrow. Accessible, reliable medical management system.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold mb-3 tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/doctors" className="hover:text-white transition-colors">Doctors Directory</Link></li>
              <li><Link href="/appointment" className="hover:text-white transition-colors">Book Appointment</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Login Portal</Link></li>
            </ul>
          </div>

          {/* Column 3: Services & Departments (Services Anchor) */}
          <div id="services" className="scroll-mt-28">
            <h4 className="text-white text-sm font-bold mb-3 tracking-wide">Services & Specialties</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/doctors?specialization=Cardiology" className="hover:text-white transition-colors">Cardiology & Heart Care</Link></li>
              <li><Link href="/doctors?specialization=Neurology" className="hover:text-white transition-colors">Neurology & Brain Health</Link></li>
              <li><Link href="/doctors?specialization=Orthopedics" className="hover:text-white transition-colors">Orthopedics & Joint Care</Link></li>
              <li><Link href="/doctors?specialization=General Medicine" className="hover:text-white transition-colors">General Medicine & 24/7 OPD</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info (Contact Anchor) */}
          <div id="contact" className="scroll-mt-28">
            <h4 className="text-white text-sm font-bold mb-3 tracking-wide">Contact Us</h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <p className="flex items-center gap-2 text-zinc-300">
                <span className="text-white">📍</span> 124 Health Avenue, NY 10001
              </p>
              <p className="text-white font-bold flex items-center gap-2">
                <span>📞</span> +1 (800) 123-4567
              </p>
              <p className="flex items-center gap-2 text-zinc-300">
                <span className="text-white">✉️</span> support@medicare-health.com
              </p>
              <p className="text-zinc-500 text-[11px] pt-1">
                Emergency 24/7 Helpline & Ambulance Available
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <p className="text-center text-xs text-zinc-500 pt-6">
          © {currentYear} MediCare+ Hospital Management System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
