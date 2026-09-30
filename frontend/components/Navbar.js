'use client';

// React aur Next.js ke basic hooks import kar rahe hain
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  // 1. State variables: User data aur mobile menu open/close track karne ke liye
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // 2. useEffect: Page load hote hi check karo user login hai ya nahi (localStorage se)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');

    // Agar token aur name mila, matlab user logged in hai
    if (token && name) {
      setUser({ name, role });
    }
  }, []);

  // 3. Logout function: localStorage clear karo aur login page par redirect karo
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo Section (Minimalist Black & White) */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
            +
          </div>
          <span className="text-2xl font-black text-black tracking-tight">
            Medi<span className="text-zinc-600">Care+</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="/#about" className="hover:text-black transition-colors">About</Link>
          <Link href="/#departments" className="hover:text-black transition-colors">Departments</Link>
          <Link href="/doctors" className="hover:text-black transition-colors">Doctors</Link>
          <Link href="/#services" className="hover:text-black transition-colors">Services</Link>
          <Link href="/#contact" className="hover:text-black transition-colors">Contact</Link>
        </nav>

        {/* Right Side: Auth Buttons (Login / Signup ya Dashboard / Logout) */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            // Agar user login hai toh Dashboard link aur Logout button dikhao
            <div className="flex items-center gap-3">
              <Link
                href={user.role === 'doctor' ? '/doctor' : '/patient'}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-bold border border-zinc-200 transition-all"
              >
                <span>{user.name}</span>
                <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 text-xs font-bold text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-xl transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            // Agar user login nahi hai toh Login aur Sign Up buttons dikhao
            <>
              <Link href="/login" className="px-4 py-2 text-sm font-bold text-zinc-700 hover:text-black transition-colors">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 text-sm font-bold text-white bg-black hover:bg-zinc-800 rounded-xl shadow-xs transition-all">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-zinc-800 hover:bg-zinc-100 rounded-xl"
        >
          Menu
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 p-4 space-y-2 text-sm font-medium">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block py-1 text-zinc-700 hover:text-black">Home</Link>
          <Link href="/#about" onClick={() => setMenuOpen(false)} className="block py-1 text-zinc-700 hover:text-black">About</Link>
          <Link href="/#departments" onClick={() => setMenuOpen(false)} className="block py-1 text-zinc-700 hover:text-black">Departments</Link>
          <Link href="/doctors" onClick={() => setMenuOpen(false)} className="block py-1 text-zinc-700 hover:text-black">Doctors</Link>
          <Link href="/#services" onClick={() => setMenuOpen(false)} className="block py-1 text-zinc-700 hover:text-black">Services</Link>
          <Link href="/#contact" onClick={() => setMenuOpen(false)} className="block py-1 text-zinc-700 hover:text-black">Contact</Link>
          
          {user ? (
            <button onClick={handleLogout} className="block w-full text-left py-1 text-red-600 font-semibold">
              Logout
            </button>
          ) : (
            <div className="pt-2 flex gap-2">
              <Link href="/login" className="px-4 py-2 border border-zinc-300 rounded-xl text-xs font-bold text-black">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
