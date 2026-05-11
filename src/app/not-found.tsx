import Link from 'next/link';
import { Mic, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-[#006a4e] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mic className="w-10 h-10 text-white" />
        </div>
        <h1
          className="text-6xl font-bold text-[#006a4e] mb-2"
          style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
        >
          ৪০৪
        </h1>
        <h2
          className="text-xl font-bold text-slate-800 mb-3"
          style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
        >
          পেজটি পাওয়া যায়নি
        </h2>
        <p
          className="text-sm text-slate-500 mb-8"
          style={{ fontFamily: "'Noto Serif Bengali', serif" }}
        >
          আপনি যে পেজটি খুঁজছেন সেটি অস্তিত্বে নেই অথবা সরানো হয়েছে।
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#006a4e] text-white text-sm font-semibold hover:bg-[#005540] transition-colors no-underline"
          style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
        >
          হোম পেজে ফিরুন
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
