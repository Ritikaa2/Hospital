'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    if (token && name) {
      setUser({ name, role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
            +
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            Medi<span className="text-blue-600">Care+</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/#about" className="hover:text-blue-600">About</Link>
          <Link href="/#departments" className="hover:text-blue-600">Departments</Link>
          <Link href="/doctors" className="hover:text-blue-600">Doctors</Link>
          <Link href="/#services" className="hover:text-blue-600">Services</Link>
          <Link href="/#contact" className="hover:text-blue-600">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={user.role === 'doctor' ? '/doctor' : '/patient'}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold"
              >
                <span>{user.name}</span>
                <span className="bg-blue-200 px-1.5 py-0.5 rounded text-[10px] uppercase">{user.role}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-slate-600"
        >
          Menu
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-2 text-sm">
          <Link href="/" className="block py-1 text-slate-700">Home</Link>
          <Link href="/#about" className="block py-1 text-slate-700">About</Link>
          <Link href="/#departments" className="block py-1 text-slate-700">Departments</Link>
          <Link href="/doctors" className="block py-1 text-slate-700">Doctors</Link>
          <Link href="/#services" className="block py-1 text-slate-700">Services</Link>
          <Link href="/#contact" className="block py-1 text-slate-700">Contact</Link>
          {user ? (
            <button onClick={handleLogout} className="block w-full text-left py-1 text-red-600">Logout</button>
          ) : (
            <div className="pt-2 flex gap-2">
              <Link href="/login" className="px-4 py-2 border rounded-xl text-xs font-bold">Login</Link>
              <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
