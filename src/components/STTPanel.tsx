'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Upload, Copy, Download, ExternalLink,
  Clock, Trash2, AlertCircle, FileAudio, Globe, Languages,
  Check, Volume2
} from 'lucide-react';
import { useSTT } from '@/hooks/useSTT';
import { addHistory } from '@/lib/history';
import { toBanglaNumerals } from '@/lib/utils';
import { showToast } from '@/components/Toast';
import { useAuth } from '@/hooks/useAuth';
import { getSiteConfig } from '@/lib/json-data';

export default function STTPanel() {
  const {
    isListening, isSupported, transcript, setTranscript,
    interimTranscript, language,
    isRecording, recordingTime, mode, setMode,
    sttLanguage, setSttLanguage,
    toggle, clear, copy, download,
  } = useSTT();

  const { user } = useAuth();
  const [fileDragOver, setFileDragOver] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load enrichment tool link from config
  const [enrichmentLink, setEnrichmentLink] = useState('https://amarkantho.revesoft.com/');
  const [enrichmentLabel, setEnrichmentLabel] = useState('সমৃদ্ধ করুন');

  useEffect(() => {
    try {
      const cfg = getSiteConfig();
      if (cfg.externalLinks?.enrichmentTool) setEnrichmentLink(cfg.externalLinks.enrichmentTool);
      if (cfg.externalLinks?.enrichmentLabel) setEnrichmentLabel(cfg.externalLinks.enrichmentLabel);
    } catch {
      // Use defaults
    }
  }, []);

  const handleToggle = useCallback(() => {
    toggle();
  }, [toggle]);

  const handleStop = useCallback(() => {
    if (isListening) {
      toggle();
      // Save to history
      if (transcript) {
        addHistory({
          type: 'stt',
          input: 'ভয়েস রেকর্ডিং',
          output: transcript,
          encoding: 'unicode',
        }, user?.id);
      }
    }
  }, [isListening, toggle, transcript, user?.id]);

  const handleCopy = useCallback(async () => {
    const success = await copy();
    if (success) {
      setCopied(true);
      showToast('success', 'কপি করা হয়েছে!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('error', 'কপি করা যায়নি।');
    }
  }, [copy]);

  const handleDownload = useCallback(() => {
    if (!transcript && !interimTranscript) {
      showToast('info', 'কপি করার মতো কিছু নেই।');
      return;
    }
    download();
    showToast('success', 'ডাউনলোড শুরু হয়েছে!');
  }, [transcript, interimTranscript, download]);

  const handleFile = useCallback((file: File) => {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/webm'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|ogg|webm)$/i)) {
      showToast('error', 'অনুগ্রহ করে বৈধ অডিও ফাইল আপলোড করুন (.mp3, .wav, .m4a, .ogg)');
      return;
    }
    showToast('info', 'অডিও ফাইল ট্রান্সক্রিপশনের জন্য, ফাইলটি প্লে করুন এবং "কথা বলুন" ব্যবহার করুন।');
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setFileDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${toBanglaNumerals(m.toString().padStart(2, '0'))}:${toBanglaNumerals(s.toString().padStart(2, '0'))}`;
  };

  const fullText = transcript + (interimTranscript ? ` ${interimTranscript}` : '');
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;

  if (!isSupported) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-8 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h3
          className="text-lg font-semibold text-slate-800 mb-2"
          style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
        >
          ব্রাউজার সাপোর্ট নেই
        </h3>
        <p
          className="text-sm text-slate-600 max-w-md mx-auto"
          style={{ fontFamily: "'Noto Serif Bengali', serif" }}
        >
          স্পিচ রিকগনিশন ব্যবহারের জন্য অনুগ্রহ করে Google Chrome বা Microsoft Edge ব্রাউজার ব্যবহার করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
      {/* Mode selection + Language selector */}
      <div className="flex flex-col sm:flex-row sm:items-stretch border-b border-slate-200">
        {/* Mode tabs */}
        <div className="flex grid grid-cols-2 flex-1">
          <button
            onClick={() => setMode('voice')}
            className={`flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200 ${
              mode === 'voice'
                ? 'bg-[#006a4e] text-white'
                : 'bg-[#f0fdf4] text-[#006a4e] hover:bg-[#dcfce7]'
            }`}
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            <Mic className="w-5 h-5" />
            কথা বলুন
          </button>
          <button
            onClick={() => setMode('file')}
            className={`flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200 ${
              mode === 'file'
                ? 'bg-[#006a4e] text-white'
                : 'bg-[#f0fdf4] text-[#006a4e] hover:bg-[#dcfce7]'
            }`}
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            <Upload className="w-5 h-5" />
            ফাইল আপলোড
          </button>
        </div>

        {/* Language selector */}
        {mode === 'voice' && (
          <div className="flex items-center gap-1 px-3 sm:border-l border-t sm:border-t-0 border-slate-200 bg-slate-50 py-2 sm:py-0">
            <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <button
              onClick={() => { setSttLanguage('bn-BD'); if (isListening) { toggle(); setTimeout(() => toggle(), 200); } }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                sttLanguage === 'bn-BD'
                  ? 'bg-[#006a4e] text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-200'
              }`}
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              বাংলা
            </button>
            <button
              onClick={() => { setSttLanguage('en-US'); if (isListening) { toggle(); setTimeout(() => toggle(), 200); } }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                sttLanguage === 'en-US'
                  ? 'bg-[#006a4e] text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              English
            </button>
          </div>
        )}
      </div>

      {mode === 'voice' ? (
        <div className="p-6 sm:p-8 flex flex-col items-center">
          {/* Waveform visualization when recording */}
          {isRecording && (
            <div className="mb-4 flex items-center gap-1 h-12">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#006a4e] rounded-full"
                  style={{
                    height: `${Math.random() * 40 + 8}px`,
                    animation: `waveform 0.8s ease-in-out ${i * 0.05}s infinite alternate`,
                    opacity: 0.6 + Math.random() * 0.4,
                  }}
                />
              ))}
            </div>
          )}

          {/* Large mic button */}
          <div className="relative mb-6">
            {/* Pulse rings when recording */}
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-red-400/30 pulse-ring"></div>
                <div className="absolute inset-2 rounded-full border-4 border-red-400/20 pulse-ring" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -inset-3 rounded-full border-2 border-red-400/10 pulse-ring" style={{ animationDelay: '1s' }}></div>
              </>
            )}
            <button
              onClick={handleToggle}
              className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? 'bg-red-50 border-4 border-red-400 shadow-lg shadow-red-100 scale-105'
                  : 'bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border-4 border-[#006a4e] hover:bg-[#dcfce7] hover:scale-105 active:scale-95 shadow-lg shadow-[#006a4e]/10'
              }`}
            >
              {isRecording ? (
                <MicOff className="w-10 h-10 text-red-500" />
              ) : (
                <Mic className="w-10 h-10 text-[#006a4e]" />
              )}
            </button>
          </div>

          {/* Status text */}
          <div className="text-center mb-4">
            <p
              className={`text-lg font-semibold mb-1 transition-colors ${
                isRecording ? 'text-red-500' : 'text-slate-700'
              }`}
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              {isRecording
                ? (interimTranscript ? 'শুনছি...' : 'রেকর্ড করা হচ্ছে... কথা বলুন')
                : 'কথা বলুন...'
              }
            </p>
            <p
              className="text-xs text-slate-400"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              {sttLanguage === 'bn-BD' ? 'ভাষা: বাংলা' : 'Language: English'}
            </p>
            {isRecording && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full border border-red-100">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  <span
                    className="text-sm text-red-600 font-mono font-medium"
                  >
                    {formatTime(recordingTime)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Stop button */}
          {isRecording && (
            <button
              onClick={handleStop}
              className="px-8 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 transition-all active:scale-95 shadow-lg"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              থামান ও সংরক্ষণ করুন
            </button>
          )}

          {/* Interim transcript preview while recording */}
          {isRecording && interimTranscript && (
            <div className="mt-4 w-full max-w-lg p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-400 mb-1" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                শোনা হচ্ছে...
              </p>
              <p
                className="text-sm text-slate-600 italic"
                style={{ fontFamily: "'Noto Serif Bengali', serif", lineHeight: '1.75' }}
                dir="auto"
              >
                {interimTranscript}
              </p>
            </div>
          )}

          {/* Helpful tips when not recording */}
          {!isRecording && !transcript && (
            <div className="mt-4 max-w-sm text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-400" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  টিপস
                </p>
              </div>
              <ul className="text-xs text-slate-400 space-y-1" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                <li>• স্পষ্টভাবে ও ধীরে কথা বলুন</li>
                <li>• শান্ত পরিবেশে রেকর্ড করুন</li>
                <li>• মাইক্রোফোন অনুমতি দিন</li>
                <li>• Chrome/Edge ব্রাউজার ব্যবহার করুন</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 sm:p-8">
          {/* File drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setFileDragOver(true); }}
            onDragLeave={() => setFileDragOver(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              fileDragOver
                ? 'border-[#006a4e] bg-[#f0fdf4] scale-[1.02]'
                : 'border-slate-300 hover:border-[#006a4e] hover:bg-slate-50'
            }`}
          >
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileAudio className="w-7 h-7 text-slate-400" />
            </div>
            <p
              className="text-sm font-medium text-slate-600 mb-1"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              অডিও ফাইল এখানে ড্রপ করুন
            </p>
            <p className="text-xs text-slate-400 mb-4">.mp3, .wav, .m4a, .ogg</p>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#006a4e] text-white text-sm font-medium cursor-pointer hover:bg-[#005540] transition-all shadow-md shadow-[#006a4e]/20">
              <Upload className="w-4 h-4" />
              ফাইল ব্রাউজ করুন
              <input
                type="file"
                accept=".mp3,.wav,.m4a,.ogg,.webm"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          </div>
        </div>
      )}

      {/* Transcript output */}
      {(transcript || interimTranscript) && (
        <div className="border-t border-slate-200 p-4 sm:p-6 bg-gradient-to-b from-white to-slate-50/50">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  language === 'bn'
                    ? 'bg-[#f0fdf4] text-[#006a4e]'
                    : 'bg-blue-50 text-blue-700'
                }`}
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                {language === 'bn' ? 'বাংলা' : 'English'}
              </span>
              <span className="text-xs text-slate-400" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                শব্দ: {toBanglaNumerals(wordCount.toString())}
              </span>
            </div>
            {isRecording && interimTranscript && (
              <span className="flex items-center gap-1 text-xs text-amber-600">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                শুনছি...
              </span>
            )}
          </div>

          {/* Transcript text */}
          <div className="relative">
            <textarea
              value={fullText}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] bg-[#fafcfa] custom-scrollbar transition-colors"
              style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: '16px', lineHeight: '1.75', resize: 'none' }}
              dir="auto"
            />
            {isRecording && (
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center gap-0.5 h-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-[#006a4e] rounded-full"
                      style={{
                        height: `${Math.random() * 12 + 4}px`,
                        animation: `waveform 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
                        opacity: 0.5,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-[#006a4e] bg-[#f0fdf4] hover:bg-[#dcfce7]'
              }`}
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  কপি হয়েছে
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  কপি
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-[#006a4e] bg-[#f0fdf4] hover:bg-[#dcfce7] transition-all"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              <Download className="w-4 h-4" />
              ডাউনলোড
            </button>
            <a
              href={enrichmentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors no-underline"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              <ExternalLink className="w-4 h-4" />
              {enrichmentLabel}
            </a>
            <button
              onClick={clear}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors sm:ml-auto"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              <Trash2 className="w-4 h-4" />
              মুছুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
