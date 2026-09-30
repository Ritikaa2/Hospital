'use client';

// React hooks aur Next.js routing
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

// Backend server ka URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function SignupPage() {
  const router = useRouter();

  // 1. Form state variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('patient'); // Default role 'patient' hai

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Form submission: Naya account create karne ke liye
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check empty fields
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword, role })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Signup failed');
        setLoading(false);
        return;
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      setError('Unable to connect to server. Please check backend.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-xs p-8">
          
          <h2 className="text-2xl font-black text-black text-center">
            Create Account
          </h2>
          <p className="text-xs text-zinc-500 text-center mt-1 mb-6">
            Register as a patient to book appointments
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-zinc-100 border border-zinc-300 text-black text-xs font-bold">
              {success}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Role Selection: Patient ya Doctor */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                Account Type / Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                    role === 'patient'
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  👤 Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                    role === 'doctor'
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  🩺 Doctor
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            {/* Email Input */}
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

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>

          {/* Link to Login */}
          <p className="text-center text-xs text-zinc-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-black hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
