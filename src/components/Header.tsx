'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Mic, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onAdminClick?: () => void;
}

export default function Header({ onAdminClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-9 h-9 bg-[#006a4e] rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-bold text-[#006a4e]"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              বাংলা ভয়েস
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/?tab=tts"
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#006a4e] hover:bg-[#f0fdf4] transition-colors no-underline"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              লেখা থেকে কথা
            </Link>
            <Link
              href="/?tab=stt"
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#006a4e] hover:bg-[#f0fdf4] transition-colors no-underline"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              কথা থেকে লেখা
            </Link>
            <Link
              href="/about/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#006a4e] hover:bg-[#f0fdf4] transition-colors no-underline"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              সম্পর্কে
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors"
                title="এডমিন প্যানেল"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                <Shield className="w-3.5 h-3.5" />
                এডমিন
              </button>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard/"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors no-underline"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  ড্যাশবোর্ড
                </Link>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-7 h-7 rounded-full bg-[#dcfce7] flex items-center justify-center">
                    <User className="w-4 h-4 text-[#006a4e]" />
                  </div>
                  <span
                    className="text-sm font-medium text-slate-700"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  <LogOut className="w-4 h-4" />
                  লগআউট
                </button>
              </>
            ) : (
              <Link
                href="/login/"
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#006a4e] text-white hover:bg-[#005540] transition-colors no-underline"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                লগইন
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-1">
            <Link
              href="/?tab=tts"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-[#006a4e] hover:bg-[#f0fdf4] no-underline"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              লেখা থেকে কথা (TTS)
            </Link>
            <Link
              href="/?tab=stt"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-[#006a4e] hover:bg-[#f0fdf4] no-underline"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              কথা থেকে লেখা (STT)
            </Link>
            <Link
              href="/about/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-[#006a4e] hover:bg-[#f0fdf4] no-underline"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              সম্পর্কে
            </Link>
            {onAdminClick && (
              <button
                onClick={() => {
                  onAdminClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 flex items-center gap-2"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                <Shield className="w-4 h-4" />
                এডমিন প্যানেল
              </button>
            )}
            <div className="border-t border-slate-200 my-2"></div>
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 no-underline"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  ড্যাশবোর্ড
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  লগআউট
                </button>
              </>
            ) : (
              <Link
                href="/login/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-semibold text-center bg-[#006a4e] text-white no-underline"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                লগইন / রেজিস্টার
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
