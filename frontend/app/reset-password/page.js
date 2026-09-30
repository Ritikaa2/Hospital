'use client';

// React hooks aur Next.js routing
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

// Backend server URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Form state variables
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Query parameter ya sessionStorage se email auto-fill karo
  useEffect(() => {
    const queryEmail = searchParams.get('email');
    const savedEmail = sessionStorage.getItem('reset_email');
    if (queryEmail) {
      setEmail(queryEmail);
    } else if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [searchParams]);

  // 3. Submit Handler: OTP verify karke password reset karna
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check all fields
    if (!email || !otp || !newPassword || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Password reset failed');
        setLoading(false);
        return;
      }

      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      setError('Server connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-xs p-8">
      <h2 className="text-2xl font-black text-black text-center">
        Reset Password
      </h2>
      <p className="text-xs text-zinc-500 text-center mt-1 mb-6">
        Enter the 6-digit OTP sent to {email || 'your email'}
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

      {/* Reset Form */}
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
        {/* Agar email query me nahi mila toh email input field dikhao */}
        {!email && (
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-black focus:outline-none"
              required
            />
          </div>
        )}

        {/* OTP Input */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
            6-Digit OTP
          </label>
          <input
            type="text"
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="e.g. 123456"
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-center text-lg font-black tracking-widest text-black focus:ring-2 focus:ring-black focus:outline-none"
            required
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-black focus:outline-none"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
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
          className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-60"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      {/* Back to Login */}
      <div className="text-center mt-6 pt-4 border-t border-zinc-100">
        <Link href="/login" className="text-xs font-bold text-zinc-600 hover:text-black">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
