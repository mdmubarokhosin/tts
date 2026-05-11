'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteConfig } from '@/lib/json-data';
import {
  MessageSquareText, Mic, Globe, FileText, Shield, Smartphone,
  ArrowRight, ExternalLink
} from 'lucide-react';

export default function AboutPage() {
  const config = getSiteConfig();
  const features = [
    {
      icon: <MessageSquareText className="w-6 h-6 text-[#006a4e]" />,
      title: 'টেক্সট টু স্পিচ',
      desc: 'বাংলা লেখা থেকে ব্রাউজারের বিল্ট-ইন কণ্ঠে অডিও তৈরি করুন। ইউনিকোড ও পুরনো বাংলা ফন্ট উভয়ই সাপোর্ট করে।',
    },
    {
      icon: <Mic className="w-6 h-6 text-[#006a4e]" />,
      title: 'স্পিচ টু টেক্সট',
      desc: 'বাংলা কথা বলে সহজেই টেক্সটে রূপান্তর করুন। রিয়েল-টাইম ট্রান্সক্রিপশন সুবিধা।',
    },
    {
      icon: <FileText className="w-6 h-6 text-[#006a4e]" />,
      title: 'ফাইল সাপোর্ট',
      desc: '.txt ফাইল আপলোড করে TTS ব্যবহার করুন। টেক্সট ফাইল সহজেই ডাউনলোড করুন।',
    },
    {
      icon: <Globe className="w-6 h-6 text-[#006a4e]" />,
      title: 'ওয়েব বেসড',
      desc: 'কোনো সফটওয়্যার ইনস্টল করার প্রয়োজন নেই। ব্রাউজারেই সব কাজ করুন।',
    },
    {
      icon: <Shield className="w-6 h-6 text-[#006a4e]" />,
      title: 'নিরাপদ',
      desc: 'আপনার ডেটা সম্পূর্ণ নিরাপদ। সব প্রসেসিং আপনার ব্রাউজারেই হয়। কোনো বাহ্যিক সার্ভারে ডেটা পাঠানো হয় না।',
    },
    {
      icon: <Smartphone className="w-6 h-6 text-[#006a4e]" />,
      title: 'মোবাইল ফ্রেন্ডলি',
      desc: 'মোবাইল, ট্যাবলেট ও ডেস্কটপ — সব ডিভাইসে চমৎকারভাবে কাজ করে।',
    },
  ];

  const partners = [
    { name: 'বাংলা.গভ.বিডি', url: 'https://www.bangla.gov.bd/', desc: 'জাতীয় তথ্য বাতায়ন' },
    { name: 'BCC', url: 'https://bcc.gov.bd/', desc: 'বাংলাদেশ কম্পিউটার কাউন্সিল' },
    { name: 'ICTD', url: 'https://ictd.gov.bd/', desc: 'তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ' },
    { name: 'EBLICT', url: 'https://eblict.gov.bd/', desc: 'A2I প্রোগ্রাম' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#006a4e] to-[#004d3a] py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              আমাদের সম্পর্কে
            </h1>
            <p
              className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              বাংলা ভয়েস প্ল্যাটফর্ম একটি সম্পূর্ণ বাংলা ভাষাভিত্তিক ওয়েব অ্যাপ্লিকেশন,
              যা ব্রাউজারের Web Speech API ব্যবহার করে বাংলা ভাষায় স্পিচ টেকনোলজি সহজলভ্য করছে।
            </p>
          </div>
        </section>

        {/* Platform description */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-xl sm:text-2xl font-bold text-slate-800 mb-4"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              প্ল্যাটফর্ম পরিচিতি
            </h2>
            <p
              className="text-sm sm:text-base text-slate-600 leading-relaxed"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              বাংলা ভয়েস একটি ওয়েব-ভিত্তিক প্ল্যাটফর্ম যা টেক্সট টু স্পিচ (TTS) এবং স্পিচ টু টেক্সট (STT)
              প্রযুক্তি ব্যবহার করে বাংলা ভাষায় যোগাযোগ সহজ করে। এই প্ল্যাটফর্মটি দৃষ্টিপ্রতিবন্ধ,
              শ্রবণপ্রতিবন্ধ এবং প্রযুক্তিতে অপরিচিত মানুষদের জন্য বিশেষভাবে সহায়ক।
              এটি ব্রাউজারের Web Speech API ব্যবহার করে, তাই কোনো বাহ্যিক সার্ভার বা API এর প্রয়োজন নেই।
              যেকোনো ব্রাউজার থেকে সম্পূর্ণ বিনা খরচে এই সেবা ব্যবহার করা যায়।
            </p>
          </div>
        </section>

        {/* Features grid */}
        <section className="bg-[#f0fdf4] py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2
              className="text-xl sm:text-2xl font-bold text-center text-[#006a4e] mb-8 sm:mb-10"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              প্রধান বৈশিষ্ট্যসমূহ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3
                    className="text-sm font-semibold text-slate-800 mb-2"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-xs text-slate-500 leading-relaxed"
                    style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                  >
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2
            className="text-xl sm:text-2xl font-bold text-center text-slate-800 mb-8"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            প্রযুক্তি
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: 'Web Speech API', desc: 'ব্রাউজার ভিত্তিক' },
                { name: 'Next.js', desc: 'রিয়্যাক্ট ফ্রেমওয়ার্ক' },
                { name: 'TypeScript', desc: 'টাইপ-সেফ' },
                { name: 'Tailwind CSS', desc: 'স্টাইলিং' },
                { name: 'Progressive Web', desc: 'অফলাইন সাপোর্ট' },
                { name: 'Cloudflare', desc: 'হোস্টিং' },
              ].map((tech, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-4 border border-slate-100 text-center shadow-sm"
                >
                  <p
                    className="text-sm font-semibold text-slate-800"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    {tech.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="bg-[#f0fdf4] py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2
              className="text-xl sm:text-2xl font-bold text-center text-[#006a4e] mb-8"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              অংশীদার প্রতিষ্ঠান
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {partners.map((partner, i) => (
                <a
                  key={i}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all text-center no-underline group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#006a4e]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#006a4e]/20 transition-colors">
                    <ExternalLink className="w-5 h-5 text-[#006a4e]" />
                  </div>
                  <h3
                    className="text-sm font-semibold text-slate-800 mb-1"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    {partner.name}
                  </h3>
                  <p
                    className="text-[10px] text-slate-500"
                    style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                  >
                    {partner.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2
            className="text-xl sm:text-2xl font-bold text-center text-slate-800 mb-8"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            কিভাবে ব্যবহার করবেন
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              {
                step: '১',
                title: 'টেক্সট টু স্পিচ (TTS)',
                desc: 'হোম পেজে "লেখা থেকে কথা" ট্যাবে ক্লিক করুন। টেক্সট বক্সে বাংলা লিখুন অথবা .txt ফাইল আপলোড করুন। প্লে বাটনে ক্লিক করলে আপনার লেখাটি কণ্ঠে শুনতে পাবেন। ব্রাউজারের বিল্ট-ইন বাংলা কণ্ঠস্বর ব্যবহৃত হয়।',
              },
              {
                step: '২',
                title: 'স্পিচ টু টেক্সট (STT)',
                desc: '"কথা থেকে লেখা" ট্যাবে ক্লিক করুন। মাইক্রোফোন বাটনে ক্লিক করে বাংলায় কথা বলুন। আপনার কথা রিয়েল-টাইমে টেক্সটে রূপান্তর হবে।',
              },
              {
                step: '৩',
                title: 'ডাউনলোড ও শেয়ার',
                desc: 'STT থেকে প্রাপ্ত টেক্সট সহজেই ডাউনলোড করুন। আপনার ইতিহাস ড্যাশবোর্ডে সংরক্ষিত থাকবে।',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#006a4e] text-white flex items-center justify-center text-lg font-bold">
                  {item.step}
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold text-slate-800 mb-1"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs text-slate-500 leading-relaxed"
                    style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#006a4e] text-white text-sm font-semibold hover:bg-[#005540] transition-colors no-underline"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              এখনই ব্যবহার শুরু করুন
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer config={config} />
    </div>
  );
}
