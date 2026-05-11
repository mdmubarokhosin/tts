'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle, FileText, Clock } from 'lucide-react';
import { getPagesContent, updatePageContent, type PagesContent } from '@/lib/json-data';

export default function PagesManager() {
  const [pages, setPages] = useState<PagesContent>({});
  const [activePage, setActivePage] = useState<string>('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = () => {
    try {
      const data = getPagesContent();
      setPages(data);
      const keys = Object.keys(data);
      if (keys.length > 0 && !activePage) {
        setActivePage(keys[0]);
        setEditTitle(data[keys[0]].title);
        setEditContent(data[keys[0]].content);
      }
    } catch (error) {
      console.error('Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  const selectPage = (key: string) => {
    setActivePage(key);
    setEditTitle(pages[key].title);
    setEditContent(pages[key].content);
  };

  const handleSave = () => {
    if (!activePage) return;
    setSaving(true);
    setMessage(null);
    try {
      updatePageContent(activePage, { title: editTitle, content: editContent });
      setMessage({ type: 'success', text: 'পেজ কন্টেন্ট সফলভাবে আপডেট হয়েছে!' });
      fetchPages();
    } catch (error) {
      setMessage({ type: 'error', text: 'সেভ করা যায়নি' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const pageLabels: Record<string, string> = {
    about: 'সম্পর্কে',
    privacy: 'গোপনীয়তা নীতি',
    terms: 'ব্যবহারের শর্তাবলী',
    faq: 'সাধারণ জিজ্ঞাসা',
  };

  const pageIcons: Record<string, string> = {
    about: '📋',
    privacy: '🔒',
    terms: '📜',
    faq: '❓',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#006a4e] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
          message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
          <span className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message.text}</span>
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {Object.keys(pages).map((key) => (
          <button
            key={key}
            onClick={() => selectPage(key)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activePage === key
                ? 'bg-[#006a4e] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            <span>{pageIcons[key] || '📄'}</span>
            {pageLabels[key] || key}
          </button>
        ))}
      </div>

      {/* Editor */}
      {activePage && pages[activePage] && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#006a4e]" />
              <div>
                <h3 className="text-base font-semibold text-slate-800" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  {pageLabels[activePage] || activePage}
                </h3>
                {pages[activePage].lastUpdated && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400">
                      সর্বশেষ আপডেট: {new Date(pages[activePage].lastUpdated).toLocaleString('bn-BD')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">পেজ টাইটেল</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">কন্টেন্ট</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] resize-y custom-scrollbar sm:h-64 h-48"
                style={{ fontFamily: "'Noto Serif Bengali', serif", lineHeight: '1.75' }}
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#006a4e] text-white rounded-lg font-semibold hover:bg-[#005540] transition-colors disabled:opacity-60"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    সেভ হচ্ছে...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    সেভ করুন
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
