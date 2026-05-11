// Browser Text-to-Speech using Web Speech API (FREE, built-in)

export interface TTSOptions {
  rate: number;
  pitch: number;
  volume: number;
  voiceURI?: string;
}

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoaded: boolean;
  currentWordIndex: number;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  audioBlob: Blob | null;
  audioUrl: string | null;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;
let chromeBugTimer: ReturnType<typeof setInterval> | null = null;

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('bn'));
}

export function getAllVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

/**
 * Chrome has a known bug where speechSynthesis stops after ~15 seconds.
 * This workaround pauses and resumes every 14 seconds to keep it alive.
 */
function startChromeBugWorkaround(): void {
  stopChromeBugWorkaround();
  chromeBugTimer = setInterval(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }
  }, 14000);
}

function stopChromeBugWorkaround(): void {
  if (chromeBugTimer) {
    clearInterval(chromeBugTimer);
    chromeBugTimer = null;
  }
}

export function speak(
  text: string,
  options: TTSOptions,
  callbacks?: {
    onBoundary?: (event: SpeechSynthesisEvent) => void;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  }
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    callbacks?.onError?.('ব্রাউজারে TTS সাপোর্ট নেই।');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  stopChromeBugWorkaround();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate;
  utterance.pitch = options.pitch;
  utterance.volume = options.volume;
  utterance.lang = 'bn-BD';

  if (options.voiceURI) {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.voiceURI === options.voiceURI);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang; // Use the voice's actual language
    }
  }

  // If no Bengali voice is set, try to find one automatically
  if (!utterance.voice || !options.voiceURI) {
    const voices = window.speechSynthesis.getVoices();
    const bnVoice = voices.find(v => v.lang.startsWith('bn'));
    if (bnVoice) {
      utterance.voice = bnVoice;
      utterance.lang = bnVoice.lang;
    }
    // If still no voice, try Hindi voices as fallback (they often support Bengali script)
    if (!utterance.voice) {
      const hiVoice = voices.find(v => v.lang.startsWith('hi'));
      if (hiVoice) {
        utterance.voice = hiVoice;
      }
    }
  }

  utterance.onstart = () => {
    currentUtterance = utterance;
    startChromeBugWorkaround();
    callbacks?.onStart?.();
  };

  utterance.onend = () => {
    currentUtterance = null;
    stopChromeBugWorkaround();
    callbacks?.onEnd?.();
  };

  utterance.onerror = (event) => {
    currentUtterance = null;
    stopChromeBugWorkaround();
    callbacks?.onError?.(event.error);
  };

  if (callbacks?.onBoundary) {
    utterance.onboundary = callbacks.onBoundary;
  }

  window.speechSynthesis.speak(utterance);
}

export function pause(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
}

export function resume(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.resume();
  }
}

export function stop(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    stopChromeBugWorkaround();
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}

export function isPaused(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.paused;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
