'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TTSPanel from '@/components/TTSPanel';
import STTPanel from '@/components/STTPanel';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminPanel from '@/components/admin/AdminPanel';
import { ToastContainer } from '@/components/Toast';
import { MessageSquareText, Mic, Shield, Volume2, Globe, Sparkles } from 'lucide-react';
import { getSiteConfig } from '@/lib/json-data';
import type { SiteConfig } from '@/lib/json-data';

interface SiteConfigView {
  siteName: string;
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  ttsTabName: string;
  sttTabName: string;
  themeColor: string;
  headerNav: { label: string; href: string }[];
  footer: { copyright: string; partners: { name: string; url: string; short: string }[] };
  features: { icon: string; title: string; desc: string }[];
  externalLinks: { enrichmentTool: string; enrichmentLabel: string };
}

const defaultConfig: SiteConfigView = {
  siteName: 'বাংলা ভয়েস',
  siteTitle: 'বাংলা ভয়েস — লেখা থেকে কথা, কথা থেকে লেখা',
  heroTitle: 'বাংলা ভয়েস প্ল্যাটফর্ম',
  heroSubtitle: 'লেখা থেকে কথা এবং কথা থেকে লেখা — বাংলা ভাষায় স্পিচ সলিউশন',
  ttsTabName: 'লেখা থেকে কথা',
  sttTabName: 'কথা থেকে লেখা',
  themeColor: '#006a4e',
  headerNav: [
    { label: 'লেখা থেকে কথা', href: '?tab=tts' },
    { label: 'কথা থেকে লেখা', href: '?tab=stt' },
    { label: 'সম্পর্কে', href: '/about' },
  ],
  footer: {
    copyright: '© ২০২৫ সর্বস্বত্ব সংরক্ষিত | বাংলা ভয়েস প্ল্যাটফর্ম',
    partners: [
      { name: 'বাংলা.গভ.বিডি', url: 'https://www.bangla.gov.bd/', short: 'Bangla.gov.bd' },
      { name: 'BCC', url: 'https://bcc.gov.bd/', short: 'BCC' },
      { name: 'ICTD', url: 'https://ictd.gov.bd/', short: 'ICTD' },
      { name: 'EBLICT', url: 'https://eblict.gov.bd/', short: 'EBLICT' },
    ],
  },
  features: [
    { icon: '🎙️', title: 'টেক্সট টু স্পিচ', desc: 'বাংলা লেখা থেকে স্বাভাবিক কণ্ঠে অডিও তৈরি করুন' },
    { icon: '🎤', title: 'স্পিচ টু টেক্সট', desc: 'কথা বলে সহজেই বাংলা লেখায় রূপান্তর করুন' },
    { icon: '🔄', title: 'ইউনিকোড সাপোর্ট', desc: 'ইউনিকোড এবং পুরনো বাংলা উভয় ফন্ট সাপোর্ট' },
    { icon: '💾', title: 'ডাউনলোড', desc: 'টেক্সট ফাইল সহজেই ডাউনলোড করুন' },
  ],
  externalLinks: {
    enrichmentTool: 'https://amarkantho.revesoft.com/',
    enrichmentLabel: 'সমৃদ্ধ করুন',
  },
};

function toViewConfig(cfg: SiteConfig): SiteConfigView {
  return {
    siteName: cfg.siteName,
    siteTitle: cfg.siteTitle,
    heroTitle: cfg.heroTitle,
    heroSubtitle: cfg.heroSubtitle,
    ttsTabName: cfg.ttsTabName,
    sttTabName: cfg.sttTabName,
    themeColor: cfg.themeColor,
    headerNav: cfg.headerNav,
    footer: cfg.footer,
    features: cfg.features,
    externalLinks: cfg.externalLinks,
  };
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'tts' | 'stt'>('tts');
  const [config, setConfig] = useState<SiteConfigView>(defaultConfig);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; token: string } | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch site config on mount
  useEffect(() => {
    try {
      const cfg = getSiteConfig();
      setConfig(toViewConfig(cfg));
    } catch {
      console.error('Failed to load config, using defaults');
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  // Handle ?tab=stt URL param to switch to STT tab
  useEffect(() => {
    if (tabParam === 'stt') {
      setActiveTab('stt');
    }
  }, [tabParam]);

  // Refresh config when admin panel closes
  const handleAdminClose = useCallback(() => {
    setAdminUser(null);
    try {
      const cfg = getSiteConfig();
      setConfig(toViewConfig(cfg));
    } catch {
      // Use defaults
    }
  }, []);

  // Show admin panel if admin is logged in
  if (adminUser) {
    return <AdminPanel admin={adminUser} onClose={handleAdminClose} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onAdminClick={() => setShowAdminLogin(true)} />

      <ToastContainer />

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onLogin={(admin) => {
            setAdminUser(admin);
            setShowAdminLogin(false);
          }}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      <main className="flex-1">
        {/* Hero section */}
        <section
          className="relative py-10 sm:py-14 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${config.themeColor}, ${config.themeColor}dd)` }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/3 rounded-full"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
            {/* Logo badge */}
            <div className={`flex items-center justify-center mb-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <Volume2 className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1
              className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              {loadingConfig ? defaultConfig.heroTitle : config.heroTitle}
            </h1>
            <p
              className={`text-base sm:text-lg text-white/80 max-w-2xl mx-auto transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              {loadingConfig ? defaultConfig.heroSubtitle : config.heroSubtitle}
            </p>

            {/* Quick stats */}
            <div className={`flex items-center justify-center gap-6 mt-6 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-1.5 text-white/60">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-medium" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  বিনা খরচে
                </span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full"></div>
              <div className="flex items-center gap-1.5 text-white/60">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  ব্রাউজার ভিত্তিক
                </span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full"></div>
              <div className="flex items-center gap-1.5 text-white/60">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-medium" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  গোপনীয়
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab selector */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6">
          <div className={`bg-white rounded-2xl shadow-lg border border-slate-200/80 p-1.5 flex gap-1.5 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={() => setActiveTab('tts')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'tts'
                  ? 'text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              style={{
                fontFamily: "'Noto Sans Bengali', sans-serif",
                backgroundColor: activeTab === 'tts' ? config.themeColor : undefined,
              }}
            >
              <MessageSquareText className="w-5 h-5" />
              {loadingConfig ? defaultConfig.ttsTabName : config.ttsTabName}
            </button>
            <button
              onClick={() => setActiveTab('stt')}
              id="stt"
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'stt'
                  ? 'text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              style={{
                fontFamily: "'Noto Sans Bengali', sans-serif",
                backgroundColor: activeTab === 'stt' ? config.themeColor : undefined,
              }}
            >
              <Mic className="w-5 h-5" />
              {loadingConfig ? defaultConfig.sttTabName : config.sttTabName}
            </button>
          </div>
        </section>

        {/* Main content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {activeTab === 'tts' ? <TTSPanel /> : <STTPanel />}
          </div>
        </section>

        {/* Features section */}
        <section className="bg-gradient-to-b from-[#f0fdf4] to-white py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2
                className="text-xl sm:text-2xl font-bold mb-2"
                style={{
                  fontFamily: "'Noto Sans Bengali', sans-serif",
                  color: config.themeColor,
                }}
              >
                বৈশিষ্ট্যসমূহ
              </h2>
              <p className="text-sm text-slate-500" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                আপনার বাংলা ভাষা অভিজ্ঞতা আরও সমৃদ্ধ করুন
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {(loadingConfig ? defaultConfig.features : config.features).map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-[#dcfce7] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3
                    className="text-sm font-semibold text-slate-800 mb-1.5"
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
      </main>

      {/* Admin button - small floating button */}
      <button
        onClick={() => setShowAdminLogin(true)}
        className="fixed bottom-4 left-4 z-30 w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm text-white flex items-center justify-center shadow-lg hover:bg-slate-700 hover:scale-105 transition-all"
        title="এডমিন প্যানেল"
      >
        <Shield className="w-5 h-5" />
      </button>

      <Footer config={loadingConfig ? defaultConfig : config} />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#006a4e] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>লোড হচ্ছে...</p>
          </div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
