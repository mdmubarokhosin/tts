'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { getAllHistory, deleteHistoryItem, clearAllHistory, getHistoryStats, type HistoryItem } from '@/lib/history';
import { toBanglaNumerals, formatBanglaDate, truncateText } from '@/lib/utils';
import { showToast, ToastContainer } from '@/components/Toast';
import { MessageSquareText, Mic, Trash2, Calendar, AlertTriangle, Volume2, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const history = useMemo<HistoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    return user ? getAllHistory(user.id) : [];
  }, [user, refreshKey]);

  const stats = useMemo(() => {
    if (typeof window === 'undefined') return { totalTTS: 0, totalSTT: 0, thisMonth: 0 };
    return user ? getHistoryStats(user.id) : { totalTTS: 0, totalSTT: 0, thisMonth: 0 };
  }, [user, refreshKey]);

  const handleDelete = (id: string) => {
    if (user) {
      deleteHistoryItem(id, user.id);
      setRefreshKey(k => k + 1);
      showToast('success', 'ইতিহাস মুছে ফেলা হয়েছে।');
    }
  };

  const handleClearAll = () => {
    if (user) {
      const confirmed = window.confirm('আপনি কি সত্যিই সব ইতিহাস মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।');
      if (!confirmed) return;
      clearAllHistory(user.id);
      setRefreshKey(k => k + 1);
      showToast('success', 'সব ইতিহাস মুছে ফেলা হয়েছে।');
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[#f8faf8]">
        <ToastContainer />

        {/* Simple header for dashboard */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
            <Link
              href="/"
              className="text-sm text-[#006a4e] hover:underline no-underline"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              ← হোম এ ফিরুন
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
          {/* Heading */}
          <h1
            className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            ড্যাশবোর্ড
          </h1>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-[#006a4e]" />
                </div>
                <div>
                  <p
                    className="text-xs text-slate-500"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    মোট TTS
                  </p>
                  <p
                    className="text-2xl font-bold text-[#006a4e]"
                  >
                    {toBanglaNumerals(stats.totalTTS)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p
                    className="text-xs text-slate-500"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    মোট STT
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {toBanglaNumerals(stats.totalSTT)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p
                    className="text-xs text-slate-500"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    এই মাসে
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {toBanglaNumerals(stats.thisMonth)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* History section */}
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-semibold text-slate-800"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              ইতিহাস
            </h2>
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                সব ইতিহাস মুছুন
              </button>
            )}
          </div>

          {/* History list */}
          {history.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p
                className="text-lg font-medium text-slate-400"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                এখনো কোনো ইতিহাস নেই
              </p>
              <p
                className="text-sm text-slate-400 mt-1"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              >
                TTS বা STT ব্যবহার করলে এখানে দেখাবে
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-lg bg-[#006a4e] text-white text-sm font-medium hover:bg-[#005540] transition-colors no-underline"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                শুরু করুন
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            item.type === 'tts'
                              ? 'bg-[#f0fdf4] text-[#006a4e]'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {item.type === 'tts' ? 'TTS' : 'STT'}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatBanglaDate(new Date(item.createdAt))}
                        </span>
                      </div>
                      <p
                        className="text-sm text-slate-600 mb-1"
                        style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                      >
                        <span className="font-medium text-slate-700">ইনপুট:</span>{' '}
                        {truncateText(item.input, 80)}
                      </p>
                      {item.output && (
                        <p
                          className="text-xs text-slate-400"
                          style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                        >
                          <span className="font-medium">আউটপুট:</span>{' '}
                          {truncateText(item.output, 60)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
