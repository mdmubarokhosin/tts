'use client';

import { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { getSiteConfig } from '@/lib/json-data';

interface AdminLoginProps {
  onLogin: (admin: { email: string; name: string; token: string }) => void;
  onClose: () => void;
}

export default function AdminLogin({ onLogin, onClose }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        const config = getSiteConfig();
        if (email === config.adminCredentials.email && password === config.adminCredentials.password) {
          const token = btoa(`${email}:${Date.now()}`);
          onLogin({
            email: config.adminCredentials.email,
            name: 'এডমিন',
            token,
          });
        } else {
          setError('ইমেইল বা পাসওয়ার্ড ভুল');
        }
      } catch {
        setError('সার্ভারে সমস্যা হয়েছে');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#004d3a] px-5 py-4 sm:px-6 sm:py-5 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            এডমিন লগইন
          </h2>
          <p className="text-sm text-white/60 mt-1">
            এডমিন প্যানেলে প্রবেশ করতে লগইন করুন
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                {error}
              </span>
            </div>
          )}

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
              placeholder="admin@bangla.gov.bd"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] bg-slate-50 text-sm"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            />
          </div>

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
                placeholder="পাসওয়ার্ড দিন"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] bg-slate-50 text-sm pr-10"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#006a4e] text-white rounded-lg font-semibold hover:bg-[#005540] transition-colors disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                যাচাই করা হচ্ছে...
              </>
            ) : (
              'লগইন করুন'
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            বাতিল
          </button>
        </form>
      </div>
    </div>
  );
}
