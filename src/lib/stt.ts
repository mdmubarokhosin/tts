// Speech-to-Text using Web Speech API (SpeechRecognition)
// Open source, free, browser-native API

type ResultCallback = (result: string, isFinal: boolean) => void;
type ErrorCallback = (error: string) => void;
type StateCallback = (state: Partial<STTState>) => void;

export interface STTState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  language: string;
  confidence: number;
}

let recognition: SpeechRecognition | null = null;
let isManualStop = false;

export function isSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function createRecognition(
  lang: string = 'bn-BD',
  continuous: boolean = true,
  interimResults: boolean = true,
  onResult: ResultCallback,
  onError: ErrorCallback,
  onStateChange?: StateCallback
): SpeechRecognition | null {
  if (!isSupported()) {
    onError('আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট করে না। গুগল ক্রোম ব্যবহার করুন।');
    return null;
  }

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) return null;

  recognition = new SpeechRecognitionClass();

  recognition.lang = lang;
  recognition.continuous = continuous;
  recognition.interimResults = interimResults;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    // FIX: Accumulate ALL results first, then call callbacks ONCE per event
    // Previously, calling onResult inside the loop caused text duplication
    let accumulatedFinal = '';
    let accumulatedInterim = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        accumulatedFinal += result[0].transcript;
      } else {
        accumulatedInterim += result[0].transcript;
      }
    }

    // Call callbacks once with accumulated results
    if (accumulatedFinal) {
      onResult(accumulatedFinal, true);
    }
    if (accumulatedInterim && !accumulatedFinal) {
      // Only send interim if there are no new finals in this event
      onResult(accumulatedInterim, false);
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onStateChange?.({ isListening: false });
    switch (event.error) {
      case 'not-allowed':
        onError('মাইক্রোফোন অনুমতি দেওয়া হয়েনি। অনুগ্রহ করে ব্রাউজার সেটিংসে মাইক্রোফোন অনুমতি দিন।');
        break;
      case 'no-speech':
        // Don't show error for no-speech, just continue or restart
        break;
      case 'audio-capture':
        onError('কোনো মাইক্রোফোন পাওয়া যায়নি।');
        break;
      case 'network':
        onError('নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
        break;
      case 'aborted':
        // Manual stop, don't show error
        break;
      default:
        onError(`ত্রুটি: ${event.error}`);
    }
  };

  recognition.onend = () => {
    // Auto-restart if recognition ended unexpectedly (not manually stopped)
    if (!isManualStop && recognition) {
      try {
        // Small delay before restarting to avoid rapid loops
        setTimeout(() => {
          if (recognition && !isManualStop) {
            try {
              recognition.start();
            } catch {
              // If start fails, clean up
              recognition = null;
              onStateChange?.({ isListening: false });
            }
          }
        }, 100);
      } catch {
        recognition = null;
        onStateChange?.({ isListening: false });
      }
    } else {
      isManualStop = false;
      onStateChange?.({ isListening: false });
    }
  };

  return recognition;
}

export function startListening(
  lang: string = 'bn-BD',
  onResult: ResultCallback,
  onError: ErrorCallback,
  onStateChange?: StateCallback
): void {
  isManualStop = false;

  if (recognition) {
    try {
      isManualStop = true; // Treat existing recognition stop as manual
      recognition.stop();
    } catch {
      // ignore if already stopped
    }
  }

  // Small delay to ensure previous recognition is fully stopped
  setTimeout(() => {
    isManualStop = false;
    recognition = createRecognition(lang, true, true, onResult, onError, onStateChange);
    if (!recognition) return;

    try {
      onStateChange?.({ isListening: true, transcript: '', interimTranscript: '' });
      recognition.start();
    } catch {
      onError('রেকর্ডিং শুরু করা যায়নি। আবার চেষ্টা করুন।');
    }
  }, 100);
}

export function stopListening(): void {
  isManualStop = true;
  if (recognition) {
    try {
      recognition.stop();
    } catch {
      // ignore if already stopped
    }
    recognition = null;
  }
}

export function detectLanguage(text: string): 'bn' | 'en' {
  const banglaRange = /[\u0980-\u09FF]/;
  const banglaChars = text.match(banglaRange);
  if (banglaChars && banglaChars.length > text.length * 0.3) {
    return 'bn';
  }
  return 'en';
}
