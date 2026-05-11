'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mic, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/components/Toast';
import { ToastContainer } from '@/components/Toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showToast('error', 'সব ফিল্ড পূরণ করুন।');
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', 'পাসওয়ার্ড মিলছে না।');
      return;
    }
    if (password.length < 6) {
      showToast('error', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = register(name, email, password);
      if (result.success) {
        showToast('success', result.message);
        router.push('/login/');
      } else {
        showToast('error', result.message);
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] px-4">
      <ToastContainer />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-[#006a4e] rounded-2xl flex items-center justify-center mb-3">
            <Mic className="w-7 h-7 text-white" />
          </div>
          <h1
            className="text-2xl font-bold text-[#006a4e]"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            বাংলা ভয়েস
          </h1>
        </div>

        {/* Register card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
          <h2
            className="text-xl font-bold text-slate-800 text-center mb-6"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            নিবন্ধন করুন
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1.5"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                আপনার নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1.5"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                ইমেইল
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1.5"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] pr-10 transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1.5"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Register button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#006a4e] text-white text-sm font-semibold hover:bg-[#005540] transition-colors disabled:opacity-60 disabled:cursor-wait"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    রেজিস্টার
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Login link */}
            <div className="text-center pt-1">
              <Link
                href="/login/"
                className="text-sm text-[#006a4e] hover:underline no-underline"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
