'use client';

import { useState } from 'react';
import {
  Settings, FileText, Download, Upload, LogOut,
  X, ChevronRight, Shield, RefreshCw
} from 'lucide-react';
import SiteConfigEditor from './SiteConfigEditor';
import PagesManager from './PagesManager';
import { exportAllData, importAllData } from '@/lib/json-data';

interface AdminUser {
  email: string;
  name: string;
  token: string;
}

interface AdminPanelProps {
  admin: AdminUser;
  onClose: () => void;
}

type AdminTab = 'config' | 'pages' | 'data';

const adminTabs: { id: AdminTab; label: string; shortLabel: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'config', label: 'সাইট কনফিগ', shortLabel: 'কনফিগ', icon: <Settings className="w-5 h-5" />, desc: 'সাইটের সকল সেটিংস পরিবর্তন করুন' },
  { id: 'pages', label: 'পেজ কন্টেন্ট', shortLabel: 'পেজ', icon: <FileText className="w-5 h-5" />, desc: 'পেজের কন্টেন্ট সম্পাদনা করুন' },
  { id: 'data', label: 'ডাটা ইমপোর্ট/এক্সপোর্ট', shortLabel: 'ডাটা', icon: <Download className="w-5 h-5" />, desc: 'সকল ডাটা ব্যাকআপ ও রিস্টোর' },
];

export default function AdminPanel({ admin, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('config');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const handleExportData = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bangla-voice-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        importAllData(data);
        setRefreshKey((k) => k + 1);
        alert('ডাটা সফলভাবে ইমপোর্ট হয়েছে!');
      } catch {
        alert('ফাইল পড়তে সমস্যা হয়েছে');
      }
    };
    input.click();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'config':
        return <SiteConfigEditor key={`config-${refreshKey}`} />;
      case 'pages':
        return <PagesManager key={`pages-${refreshKey}`} />;
      case 'data':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                ডাটা এক্সপোর্ট
              </h3>
              <p className="text-sm text-slate-500 mb-4" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                সকল JSON ডাটা একটি ফাইলে ডাউনলোড করুন। ব্যাকআপ হিসেবে রাখতে পারবেন।
              </p>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#006a4e] text-white rounded-lg hover:bg-[#005540] transition-colors"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                <Download className="w-4 h-4" />
                ডাটা এক্সপোর্ট (JSON)
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                ডাটা ইমপোর্ট
              </h3>
              <p className="text-sm text-slate-500 mb-4" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                আগের ব্যাকআপ ফাইল থেকে সকল ডাটা রিস্টোর করুন। সতর্কতা: এটি বর্তমান ডাটা প্রতিস্থাপন করবে।
              </p>
              <button
                onClick={handleImportData}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                <Upload className="w-4 h-4" />
                ডাটা ইমপোর্ট (JSON)
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-[#004d3a] text-white flex-col">
        {/* Sidebar Header */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                এডমিন প্যানেল
              </h2>
              <p className="text-xs text-white/60">{admin.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              {tab.icon}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{tab.label}</div>
                <div className="text-[11px] opacity-60 truncate">{tab.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <button
            onClick={handleExportData}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            <Download className="w-4 h-4" />
            এক্সপোর্ট
          </button>
          <button
            onClick={handleImportData}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            <Upload className="w-4 h-4" />
            ইমপোর্ট
          </button>
          <button
            onClick={onClose}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            <LogOut className="w-4 h-4" />
            এডমিন প্যানেল বন্ধ করুন
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-[#004d3a] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <span className="font-bold text-sm" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            এডমিন প্যানেল
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setRefreshKey((k) => k + 1)} className="p-2 rounded-lg hover:bg-white/10">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-slate-200 px-1 pb-[env(safe-area-inset-bottom)] pt-1 flex gap-0.5 overflow-x-auto scrollbar-hide">
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] transition-colors min-w-[56px] ${
              activeTab === tab.id
                ? 'bg-[#006a4e] text-white'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span className="truncate max-w-[52px]">{tab.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-14 lg:pt-0 overflow-y-auto" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
        {/* Top bar - Desktop */}
        <div className="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              {adminTabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-slate-500" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
              {adminTabs.find((t) => t.id === activeTab)?.desc}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              রিফ্রেশ
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
