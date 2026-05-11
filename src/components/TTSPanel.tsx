'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Play, Pause, Square, RotateCcw, Download, Upload, Settings,
  Volume2, ChevronDown, AlertTriangle, Waves, Type, Gauge
} from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { addHistory } from '@/lib/history';
import { toBanglaNumerals } from '@/lib/utils';
import { ansiToUnicode, unicodeToAnsi } from '@/lib/converter';
import { showToast } from '@/components/Toast';
import { useAuth } from '@/hooks/useAuth';
import { getSiteConfig } from '@/lib/json-data';

export default function TTSPanel() {
  const {
    text, setText,
    isPlaying, isPaused, isLoading, currentWordIndex,
    rate, setRate, pitch, setPitch, volume, setVolume,
    voiceURI, setVoiceURI,
    bengaliVoices, hasBengaliVoice,
    encoding, setEncoding,
    play, pause: pauseSpeech, stop: stopSpeech,
    downloadNormalSpeed,
  } = useTTS();

  const { user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const voiceSelectorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load config values (placeholder, maxChars) on mount
  const [placeholder, setPlaceholder] = useState('এখানে লিখুন অথবা পেস্ট করুন ...');
  const [maxChars, setMaxChars] = useState(0);

  useEffect(() => {
    try {
      const cfg = getSiteConfig();
      if (cfg.ttsPlaceholder) setPlaceholder(cfg.ttsPlaceholder);
      if (typeof cfg.maxChars === 'number') setMaxChars(cfg.maxChars);
    } catch {
      // Use defaults
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (voiceSelectorRef.current && !voiceSelectorRef.current.contains(event.target as Node)) {
        setShowVoiceSelector(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show warning if no Bengali voice available after a delay
  const [voiceWarning, setVoiceWarning] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasBengaliVoice && bengaliVoices.length === 0) {
        setVoiceWarning(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [hasBengaliVoice, bengaliVoices.length]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      showToast('error', 'শুধুমাত্র .txt ফাইল সাপোর্ট করা হয়।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (encoding === 'ansi') {
        const converted = ansiToUnicode(content);
        setText(maxChars > 0 ? converted.slice(0, maxChars) : converted);
        setEncoding('unicode');
      } else {
        setText(maxChars > 0 ? content.slice(0, maxChars) : content);
      }
      showToast('success', 'ফাইল সফলভাবে লোড হয়েছে!');
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  };

  const handlePlay = () => {
    if (!text.trim()) {
      showToast('info', 'অনুগ্রহ করে প্রথমে কিছু লিখুন।');
      return;
    }

    const textToSpeak = encoding === 'ansi' ? ansiToUnicode(text) : text;
    setText(textToSpeak);
    setEncoding('unicode');

    play();

    addHistory({
      type: 'tts',
      input: textToSpeak,
      output: 'TTS চালানো হয়েছে',
      encoding: 'unicode',
    }, user?.id);
  };

  const handleRefresh = () => {
    stopSpeech();
    setText('');
    showToast('info', 'টেক্সট রিসেট করা হয়েছে।');
  };

  const handleTextChange = (value: string) => {
    if (maxChars > 0 && value.length > maxChars) {
      setText(value.slice(0, maxChars));
      showToast('info', `সর্বোচ্চ ${toBanglaNumerals(maxChars.toString())} অক্ষর লেখা যাবে।`);
      return;
    }
    setText(value);
  };

  // Current selected voice display name
  const selectedVoiceObj = bengaliVoices.find(v => v.voiceURI === voiceURI);
  const selectedVoiceName = selectedVoiceObj?.name || 'ব্রাউজার কণ্ঠস্বর';

  const charCount = text.length;
  const isOverLimit = maxChars > 0 && charCount >= maxChars;

  // Word count
  const wordCount = useMemo(() => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  }, [text]);

  // Estimate speaking time (avg 150 words/min for Bangla at 1x speed)
  const estimatedTime = useMemo(() => {
    const minutes = wordCount / (150 * rate);
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);
    return `${toBanglaNumerals(m.toString())}:${toBanglaNumerals(s.toString().padStart(2, '0'))}`;
  }, [wordCount, rate]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
      {/* Voice warning banner */}
      {voiceWarning && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p
            className="text-xs text-amber-700"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            আপনার ব্রাউজারে কোনো বাংলা কণ্ঠস্বর পাওয়া যায়নি। Google Chrome ব্যবহার করুন এবং ইন্টারনেট সংযোগ নিশ্চিত করুন।
          </p>
          <button onClick={() => setVoiceWarning(false)} className="text-amber-400 hover:text-amber-600 ml-auto flex-shrink-0">
            &times;
          </button>
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7]/50 border-b border-[#dcfce7]">
        {/* Encoding Toggle */}
        <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          <button
            onClick={() => setEncoding('unicode')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              encoding === 'unicode'
                ? 'bg-[#006a4e] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            ইউনিকোড
          </button>
          <button
            onClick={() => setEncoding('ansi')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              encoding === 'ansi'
                ? 'bg-[#006a4e] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            পুরনো বাংলা
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Voice selector dropdown - browser voices only */}
          <div className="relative" ref={voiceSelectorRef}>
            <button
              onClick={() => setShowVoiceSelector(!showVoiceSelector)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                hasBengaliVoice
                  ? 'text-slate-600 hover:bg-white hover:text-[#006a4e] border-transparent hover:border-slate-200'
                  : 'text-amber-600 border-amber-200 bg-amber-50'
              }`}
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              <Volume2 className={`w-4 h-4 ${hasBengaliVoice ? '' : 'text-amber-500'}`} />
              <span className="hidden sm:inline max-w-[120px] truncate">{selectedVoiceName}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showVoiceSelector && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-30 max-h-80 overflow-y-auto">
                {bengaliVoices.length > 0 ? (
                  <>
                    <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 sticky top-0"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                      ব্রাউজার বাংলা কণ্ঠস্বর
                    </div>
                    {bengaliVoices.map((voice) => (
                      <button
                        key={voice.voiceURI}
                        onClick={() => {
                          setVoiceURI(voice.voiceURI);
                          setShowVoiceSelector(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[#f0fdf4] transition-colors ${
                          voiceURI === voice.voiceURI ? 'bg-[#f0fdf4] border-l-2 border-[#006a4e]' : ''
                        }`}
                      >
                        <span className="text-lg flex-shrink-0">&#x1F50A;</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-slate-800 truncate block">
                            {voice.name}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">{voice.lang}</span>
                        </div>
                        {voiceURI === voice.voiceURI && (
                          <div className="w-4 h-4 rounded-full bg-[#006a4e] flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                      কোনো বাংলা কণ্ঠস্বর পাওয়া যায়নি।
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Chrome/Edge ব্যবহার করুন
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings ? 'bg-[#006a4e]/10 text-[#006a4e]' : 'text-slate-500 hover:bg-white hover:text-[#006a4e]'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-20">
                <h3
                  className="text-sm font-semibold text-slate-800 mb-3"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  সেটিংস
                </h3>

                {/* Current voice info */}
                <div className="mb-3 p-2.5 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">&#x1F50A;</span>
                    <div>
                      <p className="text-xs font-medium text-slate-700" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                        {selectedVoiceName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Web Speech API (ব্রাউজার)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Speed */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <label
                      className="text-xs font-medium text-slate-600 flex items-center gap-1"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      <Gauge className="w-3.5 h-3.5" />
                      গতি
                    </label>
                    <span
                      className="text-xs font-semibold text-[#006a4e]"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {toBanglaNumerals(rate.toFixed(1))}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#006a4e]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>ধীর</span>
                    <span>স্বাভাবিক</span>
                    <span>দ্রুত</span>
                  </div>
                </div>

                {/* Pitch */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <label
                      className="text-xs font-medium text-slate-600 flex items-center gap-1"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      <Waves className="w-3.5 h-3.5" />
                      পিচ
                    </label>
                    <span
                      className="text-xs font-semibold text-[#006a4e]"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {toBanglaNumerals(pitch.toFixed(1))}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#006a4e]"
                  />
                </div>

                {/* Volume */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      className="text-xs font-medium text-slate-600 flex items-center gap-1"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      ভলিউম
                    </label>
                    <span
                      className="text-xs font-semibold text-[#006a4e]"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {toBanglaNumerals(Math.round(volume * 100))}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#006a4e]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-white hover:text-[#006a4e] transition-colors"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">আপলোড</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Textarea */}
      <div className="p-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxChars > 0 ? maxChars : undefined}
            className={`bangla-textarea w-full h-48 sm:h-64 p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] bg-[#fafcfa] resize-none custom-scrollbar transition-colors ${
              isOverLimit ? 'border-red-300' : 'border-slate-200'
            } ${isPlaying && !isPaused ? 'ring-2 ring-[#006a4e]/10 border-[#006a4e]/30' : ''}`}
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            dir="auto"
          />
          {/* Playing indicator overlay */}
          {isPlaying && !isPaused && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#006a4e] rounded-full shadow-lg">
              <div className="flex items-center gap-0.5">
                <span className="w-0.5 h-3 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}></span>
                <span className="w-0.5 h-4 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-0.5 h-2 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }}></span>
                <span className="w-0.5 h-5 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ animationDelay: '0.45s' }}></span>
                <span className="w-0.5 h-3 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }}></span>
              </div>
              <span className="text-[10px] text-white font-medium" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                চলছে
              </span>
            </div>
          )}
          {/* Paused indicator */}
          {isPaused && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 rounded-full shadow-lg">
              <Pause className="w-3 h-3 text-white" />
              <span className="text-[10px] text-white font-medium" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                বিরতি
              </span>
            </div>
          )}
        </div>

        {/* Character counter & stats */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              <Type className="w-3 h-3" />
              শব্দ: {toBanglaNumerals(wordCount.toString())}
            </span>
            {text.trim() && (
              <span className="text-xs text-slate-400 flex items-center gap-1" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                <Waves className="w-3 h-3" />
                ~{estimatedTime}
              </span>
            )}
          </div>
          <span
            className={`text-xs ${
              isOverLimit ? 'text-red-500 font-medium' : 'text-slate-400'
            }`}
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            অক্ষর: {toBanglaNumerals(charCount)}{maxChars > 0 ? ` / ${toBanglaNumerals(maxChars.toString())}` : ''}
          </span>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 border-t border-slate-200">
        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="p-3 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-all active:scale-90"
          title="রিসেট"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Play/Pause - Large center button */}
        <div className="relative">
          {/* Glow effect when playing */}
          {isPlaying && !isPaused && (
            <div className="absolute inset-0 rounded-full bg-[#006a4e]/20 animate-ping" style={{ animationDuration: '2s' }}></div>
          )}
          <button
            onClick={isPlaying ? (isPaused ? play : pauseSpeech) : handlePlay}
            disabled={isLoading}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${
              isPlaying && !isPaused
                ? 'bg-gradient-to-br from-[#f42a41] to-[#e0233a] shadow-red-200'
                : isLoading
                ? 'bg-slate-400 cursor-wait'
                : 'bg-gradient-to-br from-[#006a4e] to-[#005540] shadow-[#006a4e]/30'
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying && !isPaused ? (
              <Pause className="w-7 h-7" />
            ) : isPaused ? (
              <Volume2 className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-1" />
            )}
          </button>
        </div>

        {/* Stop */}
        {isPlaying && (
          <button
            onClick={stopSpeech}
            className="p-3 rounded-full text-red-500 hover:bg-red-50 transition-all active:scale-90"
          >
            <Square className="w-5 h-5" />
          </button>
        )}

        {/* Download button */}
        <div className="hidden sm:flex items-center gap-2 ml-4">
          <button
            onClick={downloadNormalSpeed}
            disabled={!text.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-white hover:text-[#006a4e] border border-slate-200 hover:border-[#006a4e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            <Download className="w-3.5 h-3.5" />
            ডাউনলোড (.txt)
          </button>
        </div>
      </div>

      {/* Mobile download button */}
      {text.trim() && (
        <div className="sm:hidden flex items-center gap-2 px-4 pb-4">
          <button
            onClick={downloadNormalSpeed}
            disabled={!text.trim()}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-white hover:text-[#006a4e] border border-slate-200 transition-all disabled:opacity-50"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            <Download className="w-3.5 h-3.5" />
            ডাউনলোড (.txt)
          </button>
        </div>
      )}
    </div>
  );
}
