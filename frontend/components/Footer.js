import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                +
              </div>
              <span className="text-xl font-bold text-white">MediCare+</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quality healthcare for a better tomorrow. Accessible, reliable medical management.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link href="/doctors" className="hover:text-blue-400">Doctors</Link></li>
              <li><Link href="/appointment" className="hover:text-blue-400">Book Appointment</Link></li>
              <li><Link href="/login" className="hover:text-blue-400">Login Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Departments</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/doctors?specialization=Cardiology" className="hover:text-blue-400">Cardiology</Link></li>
              <li><Link href="/doctors?specialization=Neurology" className="hover:text-blue-400">Neurology</Link></li>
              <li><Link href="/doctors?specialization=Orthopedics" className="hover:text-blue-400">Orthopedics</Link></li>
              <li><Link href="/doctors?specialization=General Medicine" className="hover:text-blue-400">General Medicine</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>124 Health Avenue, NY 10001</p>
              <p className="text-white font-medium">+1 (800) 123-4567</p>
              <p>support@medicare-health.com</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 pt-6">
          © {new Date().getFullYear()} MediCare+ Hospital Management System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
