'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  speak, pause, resume, stop, isPaused,
  loadVoices, getAvailableVoices, downloadBlob,
  type TTSOptions,
} from '@/lib/tts';

export interface UseTTSState {
  text: string;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentWordIndex: number;
  rate: number;
  pitch: number;
  volume: number;
  voiceURI: string;
  bengaliVoices: SpeechSynthesisVoice[];
  encoding: 'unicode' | 'ansi';
}

const defaultOptions: TTSOptions = {
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
};

export function useTTS() {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPausedState, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [voiceURI, setVoiceURI] = useState('');
  const [bengaliVoices, setBengaliVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [encoding, setEncoding] = useState<'unicode' | 'ansi'>('unicode');
  const [hasBengaliVoice, setHasBengaliVoice] = useState(false);

  // Load browser Bengali voices
  useEffect(() => {
    loadVoices().then(() => {
      const voices = getAvailableVoices();
      setBengaliVoices(voices);
      setHasBengaliVoice(voices.length > 0);
      // Auto-select first Bengali voice
      if (voices.length > 0 && !voiceURI) {
        setVoiceURI(voices[0].voiceURI);
      }
    });

    // Also listen for voice changes (some browsers load voices async)
    const handleVoicesChanged = () => {
      const voices = getAvailableVoices();
      setBengaliVoices(voices);
      setHasBengaliVoice(voices.length > 0);
      if (voices.length > 0 && !voiceURI) {
        setVoiceURI(voices[0].voiceURI);
      }
    };
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }
  }, []);

  // Refresh voices list
  const refreshVoices = useCallback(() => {
    const voices = getAvailableVoices();
    setBengaliVoices(voices);
    setHasBengaliVoice(voices.length > 0);
  }, []);

  const handleBoundary = useCallback((event: SpeechSynthesisEvent) => {
    if (event.name === 'word') {
      setCurrentWordIndex(event.charIndex);
    }
  }, []);

  // Play using browser TTS (Web Speech API)
  const playBrowserTTS = useCallback((textToSpeak: string, options: TTSOptions) => {
    speak(textToSpeak, options, {
      onBoundary: handleBoundary,
      onStart: () => {
        setIsLoading(false);
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
      },
      onError: (error) => {
        setIsLoading(false);
        setIsPlaying(false);
        setIsPaused(false);
        if (error === 'not-allowed') {
          // Handle specific errors silently or with toast
        }
      },
    });
  }, [handleBoundary]);

  const play = useCallback(() => {
    if (!text.trim()) return;

    // Resume if paused
    if (isPaused()) {
      resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    const options: TTSOptions = { rate, pitch, volume, voiceURI };
    playBrowserTTS(text, options);
  }, [text, rate, pitch, volume, voiceURI, isPaused, playBrowserTTS]);

  const pauseSpeech = useCallback(() => {
    pause();
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const stopSpeech = useCallback(() => {
    stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
  }, []);

  const downloadNormalSpeed = useCallback(async () => {
    if (!text.trim()) return;
    // Browser TTS doesn't support audio recording directly
    // Download as text file
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, 'bangla-tts.txt');
  }, [text]);

  const downloadCustomSpeed = useCallback(async () => {
    if (!text.trim()) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `bangla-tts-${rate.toFixed(1)}x.txt`);
  }, [text, rate]);

  return {
    text,
    setText,
    isPlaying,
    isPaused: isPausedState,
    isLoading,
    currentWordIndex,
    rate, setRate,
    pitch, setPitch,
    volume, setVolume,
    voiceURI, setVoiceURI,
    bengaliVoices,
    hasBengaliVoice,
    encoding, setEncoding,
    refreshVoices,
    play,
    pause: pauseSpeech,
    stop: stopSpeech,
    downloadNormalSpeed,
    downloadCustomSpeed,
  };
}
