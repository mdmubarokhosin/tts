'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, CheckCircle, AlertCircle } from 'lucide-react';
import { getSiteConfig, updateSiteConfig, type SiteConfig } from '@/lib/json-data';

export default function SiteConfigEditor() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = () => {
    try {
      const cfg = getSiteConfig();
      setConfig(cfg);
    } catch (error) {
      console.error('Failed to load config');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!config) return;
    setSaving(true);
    setMessage(null);
    try {
      updateSiteConfig(config);
      setMessage({ type: 'success', text: 'কনফিগারেশন সফলভাবে আপডেট হয়েছে!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'সেভ করা যায়নি' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateField = (field: keyof SiteConfig, value: string | number) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  const addNavItem = () => {
    if (!config) return;
    setConfig({
      ...config,
      headerNav: [...config.headerNav, { label: 'নতুন লিংক', href: '#' }],
    });
  };

  const removeNavItem = (index: number) => {
    if (!config) return;
    const nav = [...config.headerNav];
    nav.splice(index, 1);
    setConfig({ ...config, headerNav: nav });
  };

  const updateNavItem = (index: number, field: 'label' | 'href', value: string) => {
    if (!config) return;
    const nav = [...config.headerNav];
    nav[index] = { ...nav[index], [field]: value };
    setConfig({ ...config, headerNav: nav });
  };

  const addPartner = () => {
    if (!config) return;
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        partners: [...config.footer.partners, { name: 'নতুন পার্টনার', url: 'https://', short: 'NEW' }],
      },
    });
  };

  const removePartner = (index: number) => {
    if (!config) return;
    const partners = [...config.footer.partners];
    partners.splice(index, 1);
    setConfig({ ...config, footer: { ...config.footer, partners } });
  };

  const updatePartner = (index: number, field: 'name' | 'url' | 'short', value: string) => {
    if (!config) return;
    const partners = [...config.footer.partners];
    partners[index] = { ...partners[index], [field]: value };
    setConfig({ ...config, footer: { ...config.footer, partners } });
  };

  const addFeature = () => {
    if (!config) return;
    setConfig({
      ...config,
      features: [...config.features, { icon: '⭐', title: 'নতুন ফিচার', desc: 'ফিচারের বিবরণ' }],
    });
  };

  const removeFeature = (index: number) => {
    if (!config) return;
    const features = [...config.features];
    features.splice(index, 1);
    setConfig({ ...config, features });
  };

  const updateFeature = (index: number, field: 'icon' | 'title' | 'desc', value: string) => {
    if (!config) return;
    const features = [...config.features];
    features[index] = { ...features[index], [field]: value };
    setConfig({ ...config, features });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#006a4e] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-sm text-slate-500">লোড হচ্ছে...</span>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
          message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {message.text}
          </span>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          সাইটের মৌলিক তথ্য
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">সাইটের নাম</label>
            <input value={config.siteName} onChange={(e) => updateField('siteName', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">থিম রঙ</label>
            <div className="flex items-center gap-2">
              <input type="color" value={config.themeColor} onChange={(e) => updateField('themeColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
              <input value={config.themeColor} onChange={(e) => updateField('themeColor', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">সাইট টাইটেল</label>
            <input value={config.siteTitle} onChange={(e) => updateField('siteTitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">সাইট বিবরণ</label>
            <textarea value={config.siteDescription} onChange={(e) => updateField('siteDescription', e.target.value)} rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] resize-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">কীওয়ার্ড (কমা দিয়ে আলাদা)</label>
            <input value={config.siteKeywords} onChange={(e) => updateField('siteKeywords', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          হিরো সেকশন
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">হিরো টাইটেল</label>
            <input value={config.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">হিরো সাবটাইটেল</label>
            <input value={config.heroSubtitle} onChange={(e) => updateField('heroSubtitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
          </div>
        </div>
      </div>

      {/* TTS/STT Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          TTS/STT সেটিংস
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">TTS ট্যাব নাম</label>
            <input value={config.ttsTabName} onChange={(e) => updateField('ttsTabName', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">STT ট্যাব নাম</label>
            <input value={config.sttTabName} onChange={(e) => updateField('sttTabName', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">TTS প্লেসহোল্ডার</label>
            <input value={config.ttsPlaceholder} onChange={(e) => updateField('ttsPlaceholder', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">সর্বোচ্চ ক্যারেক্টার (0 = আনলিমিটেড)</label>
            <input type="number" value={config.maxChars} onChange={(e) => updateField('maxChars', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
            <p className="text-[10px] text-slate-400 mt-1">0 সেট করলে কোনো ক্যারেক্টার লিমিট থাকবে না</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">সমৃদ্ধ করুন লিংক</label>
            <input value={config.externalLinks.enrichmentTool} onChange={(e) => setConfig({ ...config, externalLinks: { ...config.externalLinks, enrichmentTool: e.target.value } })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">সমৃদ্ধ করুন লেবেল</label>
            <input value={config.externalLinks.enrichmentLabel} onChange={(e) => setConfig({ ...config, externalLinks: { ...config.externalLinks, enrichmentLabel: e.target.value } })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            হেডার নেভিগেশন
          </h3>
          <button onClick={addNavItem} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#006a4e] text-white hover:bg-[#005540] transition-colors">
            <Plus className="w-3.5 h-3.5" /> যোগ করুন
          </button>
        </div>
        <div className="space-y-2">
          {config.headerNav.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                <input value={item.label} onChange={(e) => updateNavItem(index, 'label', e.target.value)} placeholder="লেবেল"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20" />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1">
                <input value={item.href} onChange={(e) => updateNavItem(index, 'href', e.target.value)} placeholder="href"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20" />
                <button onClick={() => removeNavItem(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          ফুটার
        </h3>
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">কপিরাইট টেক্সট</label>
          <input value={config.footer.copyright} onChange={(e) => setConfig({ ...config, footer: { ...config.footer, copyright: e.target.value } })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]" />
        </div>

        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-slate-600">পার্টনার লোগো/লিংক</label>
          <button onClick={addPartner} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#006a4e] text-white hover:bg-[#005540] transition-colors">
            <Plus className="w-3.5 h-3.5" /> পার্টনার যোগ করুন
          </button>
        </div>
        <div className="space-y-2">
          {config.footer.partners.map((partner, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center bg-slate-50 p-3 rounded-lg">
              <input value={partner.name} onChange={(e) => updatePartner(index, 'name', e.target.value)} placeholder="নাম"
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 bg-white" />
              <input value={partner.url} onChange={(e) => updatePartner(index, 'url', e.target.value)} placeholder="URL"
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 bg-white" />
              <div className="flex items-center gap-2">
                <input value={partner.short} onChange={(e) => updatePartner(index, 'short', e.target.value)} placeholder="শর্ট নাম"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 bg-white" />
                <button onClick={() => removePartner(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            ফিচার তালিকা
          </h3>
          <button onClick={addFeature} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#006a4e] text-white hover:bg-[#005540] transition-colors">
            <Plus className="w-3.5 h-3.5" /> ফিচার যোগ করুন
          </button>
        </div>
        <div className="space-y-3">
          {config.features.map((feature, index) => (
            <div key={index} className="grid grid-cols-[60px_1fr] sm:grid-cols-[60px_1fr_1fr_auto] gap-2 items-center bg-slate-50 p-3 rounded-lg">
              <input value={feature.icon} onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                className="w-full px-2 py-2 rounded-lg border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 bg-white" />
              <input value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} placeholder="টাইটেল"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 bg-white" />
              <input value={feature.desc} onChange={(e) => updateFeature(index, 'desc', e.target.value)} placeholder="বিবরণ"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 bg-white" />
              <button onClick={() => removeFeature(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-4 rounded-b-xl flex justify-end">
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
  );
}
