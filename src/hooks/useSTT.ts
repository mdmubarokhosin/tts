'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  startListening, stopListening, isSupported, detectLanguage,
} from '@/lib/stt';

export interface UseSTTState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  language: 'bn' | 'en';
  isRecording: boolean;
  recordingTime: number;
  mode: 'voice' | 'file';
}

export function useSTT() {
  const [isListening, setIsListening] = useState(false);
  const supported = typeof window !== 'undefined' ? isSupported() : false;
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mode, setMode] = useState<'voice' | 'file'>('voice');
  const [sttLanguage, setSttLanguage] = useState<'bn-BD' | 'en-US'>('bn-BD');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalTranscriptRef = useRef('');

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    setRecordingTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setInterimTranscript('');
    setIsListening(true);
    setIsRecording(true);
    startTimer();

    startListening(
      sttLanguage,
      (result, isFinal) => {
        if (isFinal) {
          finalTranscriptRef.current += result;
          setTranscript(finalTranscriptRef.current);
          setInterimTranscript('');
          setLanguage(detectLanguage(finalTranscriptRef.current));
        } else {
          setInterimTranscript(result);
        }
      },
      (error) => {
        console.error('STT Error:', error);
        setIsListening(false);
        setIsRecording(false);
        stopTimer();
      },
      (state) => {
        if (state.isListening === false) {
          setIsListening(false);
          setIsRecording(false);
          stopTimer();
        }
      }
    );
  }, [startTimer, stopTimer, sttLanguage]);

  const stopSTT = useCallback(() => {
    stopListening();
    setIsListening(false);
    setIsRecording(false);
    stopTimer();
  }, [stopTimer]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopSTT();
    } else {
      start();
    }
  }, [isListening, start, stopSTT]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    setLanguage(sttLanguage === 'bn-BD' ? 'bn' : 'en');
  }, [sttLanguage]);

  const copyTranscript = useCallback(async (): Promise<boolean> => {
    const fullText = transcript + interimTranscript;
    if (!fullText) return false;
    try {
      await navigator.clipboard.writeText(fullText);
      return true;
    } catch {
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = fullText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch {
        return false;
      }
    }
  }, [transcript, interimTranscript]);

  const downloadTranscript = useCallback(() => {
    const fullText = transcript + interimTranscript;
    if (!fullText) return;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bangla-stt-transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [transcript, interimTranscript]);

  return {
    isListening,
    isSupported: supported,
    transcript,
    setTranscript,
    interimTranscript,
    language,
    isRecording,
    recordingTime,
    mode,
    setMode,
    sttLanguage,
    setSttLanguage,
    start,
    stop: stopSTT,
    toggle: toggleListening,
    clear: clearTranscript,
    copy: copyTranscript,
    download: downloadTranscript,
  };
}
