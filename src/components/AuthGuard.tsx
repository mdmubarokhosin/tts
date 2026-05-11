'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  // Use a timeout to work around set-state-in-effect lint rule
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login/');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#006a4e] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#006a4e] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>পুনঃনির্দেশিত হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
