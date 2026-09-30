'use client';

// React hooks aur Next.js routing
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

// Backend API URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const router = useRouter();

  // 1. Form state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Form submission handler: Backend API ko login request bhejna
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      // Login successful: Details ko browser ke localStorage me save karo
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.userId);

      // Role check karke sahi dashboard par redirect karo
      if (data.role === 'doctor') {
        router.push('/doctor');
      } else {
        router.push('/patient');
      }
    } catch (err) {
      setError('Server unreachable. Please check if backend is running.');
      setLoading(false);
    }
  };

  // 3. Demo buttons helper: Testing ke liye ek click me email & password bharna
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-xs p-8">
          
          <h2 className="text-2xl font-black text-black text-center">
            Welcome Back
          </h2>
          <p className="text-xs text-zinc-500 text-center mt-1 mb-6">
            Login to your MediCare account
          </p>

          {/* Error Message Box */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-zinc-700 uppercase">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-bold text-black hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Quick Demo Fill Buttons (For testing) */}
          <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <span>Quick Fill:</span>
            <button
              type="button"
              onClick={() => fillDemo('ritika@gmail.com', 'password123')}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-black font-bold hover:bg-zinc-200 transition-colors"
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => fillDemo('anjali@medicare.com', 'password123')}
              className="px-2.5 py-1 rounded-lg bg-black text-white font-bold hover:bg-zinc-800 transition-colors"
            >
              Doctor
            </button>
          </div>

          {/* Link to Signup */}
          <p className="text-center text-xs text-zinc-500 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold text-black hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
