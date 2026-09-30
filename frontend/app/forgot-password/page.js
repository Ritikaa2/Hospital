'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import Navbar from '@/components/Navbar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      // 1. Call backend to verify email and generate OTP
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to generate OTP');
        setLoading(false);
        return;
      }

      // 2. Send OTP via EmailJS
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_medicare';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_otp';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        to_email: email,
        to_name: data.userName || email.split('@')[0],
        otp: data.otp,
        message: `Your MediCare password reset OTP is ${data.otp}. It is valid for 5 minutes.`
      };

      if (publicKey && serviceId && templateId) {
        try {
          await emailjs.send(serviceId, templateId, templateParams, publicKey);
        } catch (emailErr) {
          console.warn('EmailJS dispatch notice:', emailErr);
        }
      } else {
        console.log('EmailJS OTP generated:', data.otp);
      }

      sessionStorage.setItem('reset_email', email);
      setSuccess('OTP sent successfully! Redirecting to reset page...');

      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (err) {
      setError('Server unreachable. Please check backend connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Forgot Password
          </h2>
          <p className="text-xs text-slate-500 text-center mt-1 mb-6">
            Enter your registered email to receive an OTP code via EmailJS
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm disabled:opacity-60"
            >
              {loading ? 'Sending OTP...' : 'Send OTP via EmailJS'}
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-slate-100">
            <Link href="/login" className="text-xs font-semibold text-slate-600 hover:text-blue-600">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
