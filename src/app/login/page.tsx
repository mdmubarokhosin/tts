'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mic, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/components/Toast';
import { ToastContainer } from '@/components/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('error', 'সব ফিল্ড পূরণ করুন।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        showToast('success', result.message);
        router.push('/');
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

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
          <h2
            className="text-xl font-bold text-slate-800 text-center mb-6"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            প্রবেশ করুন
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="••••••••"
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

            {/* Forgot password link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => showToast('info', 'পাসওয়ার্ড রিসেট সুবিধা শীঘ্রই আসছে। এখন নতুন অ্যাকাউন্ট তৈরি করুন।')}
                className="text-xs text-[#006a4e] hover:underline"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>

            {/* Buttons */}
            <div className="space-y-2.5 pt-2">
              <Link
                href="/register/"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-[#006a4e] text-[#006a4e] text-sm font-semibold hover:bg-[#f0fdf4] transition-colors no-underline"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                রেজিস্টার
              </Link>

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
                    লগইন
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
