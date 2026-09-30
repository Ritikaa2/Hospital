'use client';

// React hooks, Next.js routing, aur EmailJS
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import Navbar from '@/components/Navbar';

// Backend server ka URL
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // 1. State variables
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Submit Handler: OTP generate karwana aur email bhejna
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
      // Step A: Backend API ko request bhejo OTP generate karne ke liye
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

      // Step B: EmailJS service ke through OTP bhejna (agar configured ho)
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
          console.warn('EmailJS notice:', emailErr);
        }
      } else {
        console.log('Generated OTP:', data.otp);
      }

      // Email ko session storage me save karo
      sessionStorage.setItem('reset_email', email);
      setSuccess('OTP sent successfully! Redirecting to reset page...');

      // 1 second baad Reset Password page par redirect karo
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1000);

    } catch (err) {
      setError('Server unreachable. Please check backend connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-xs p-8">
          
          <h2 className="text-2xl font-black text-black text-center">
            Forgot Password
          </h2>
          <p className="text-xs text-zinc-500 text-center mt-1 mb-6">
            Enter your registered email to receive an OTP code
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-60"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          {/* Back to Login link */}
          <div className="text-center mt-6 pt-4 border-t border-zinc-100">
            <Link href="/login" className="text-xs font-bold text-zinc-600 hover:text-black">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
