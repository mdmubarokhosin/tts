// Client-side JSON data management using localStorage
// All data is managed client-side — no server required
// Uses only Browser Web Speech API — 100% free, open source

// ─── Types ────────────────────────────────────────────────────────────

export interface SiteConfig {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  heroTitle: string;
  heroSubtitle: string;
  ttsTabName: string;
  sttTabName: string;
  ttsPlaceholder: string;
  maxChars: number;
  themeColor: string;
  headerNav: { label: string; href: string }[];
  footer: {
    copyright: string;
    partners: { name: string; url: string; short: string }[];
  };
  features: { icon: string; title: string; desc: string }[];
  externalLinks: {
    enrichmentTool: string;
    enrichmentLabel: string;
  };
  adminCredentials: {
    email: string;
    password: string;
  };
}

export interface Voice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  language: string;
  provider: 'browser';
  enabled: boolean;
  defaultSpeed: number;
  defaultPitch: number;
  // Display settings
  icon?: string;
  category?: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
  nativeName: string;
  enabled: boolean;
  direction: 'ltr' | 'rtl';
  isDefault: boolean;
}

export interface PagesContent {
  [key: string]: {
    title: string;
    content: string;
    lastUpdated: string;
  };
}

// ─── Default Data ─────────────────────────────────────────────────────

const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: "বাংলা ভয়েস",
  siteTitle: "বাংলা ভয়েস — লেখা থেকে কথা, কথা থেকে লেখা",
  siteDescription: "বাংলা ভাষায় টেক্সট টু স্পিচ (TTS) এবং স্পিচ টু টেক্সট (STT) প্ল্যাটফর্ম। সম্পূর্ণ বিনা খরচে, ব্রাউজার ভিত্তিক।",
  siteKeywords: "বাংলা, ভয়েস, TTS, STT, স্পিচ, বাংলাদেশ, Bangla, Voice, Text to Speech, Speech to Text, Web Speech API",
  heroTitle: "বাংলা ভয়েস প্ল্যাটফর্ম",
  heroSubtitle: "লেখা থেকে কথা এবং কথা থেকে লেখা — বাংলা ভাষায় স্পিচ সলিউশন",
  ttsTabName: "লেখা থেকে কথা",
  sttTabName: "কথা থেকে লেখা",
  ttsPlaceholder: "এখানে লিখুন অথবা পেস্ট করুন ...",
  maxChars: 0, // 0 = unlimited
  themeColor: "#006a4e",
  headerNav: [
    { label: "লেখা থেকে কথা", href: "#tts" },
    { label: "কথা থেকে লেখা", href: "#stt" },
    { label: "সম্পর্কে", href: "#about" }
  ],
  footer: {
    copyright: "© ২০২৫ সর্বস্বত্ব সংরক্ষিত | বাংলা ভয়েস প্ল্যাটফর্ম",
    partners: [
      { name: "বাংলা.গভ.বিডি", url: "https://www.bangla.gov.bd/", short: "Bangla.gov.bd" },
      { name: "BCC", url: "https://bcc.gov.bd/", short: "BCC" },
      { name: "ICTD", url: "https://ictd.gov.bd/", short: "ICTD" },
      { name: "EBLICT", url: "https://eblict.gov.bd/", short: "EBLICT" }
    ]
  },
  features: [
    { icon: "🎙️", title: "টেক্সট টু স্পিচ", desc: "বাংলা লেখা থেকে স্বাভাবিক কণ্ঠে অডিও তৈরি করুন — ব্রাউজার ভিত্তিক" },
    { icon: "🎤", title: "স্পিচ টু টেক্সট", desc: "কথা বলে সহজেই বাংলা লেখায় রূপান্তর করুন" },
    { icon: "🔄", title: "ইউনিকোড সাপোর্ট", desc: "ইউনিকোড এবং পুরনো বাংলা উভয় ফন্ট সাপোর্ট" },
    { icon: "💾", title: "ডাউনলোড", desc: "টেক্সট ফাইল সহজেই ডাউনলোড করুন" }
  ],
  externalLinks: {
    enrichmentTool: "https://amarkantho.revesoft.com/",
    enrichmentLabel: "সমৃদ্ধ করুন"
  },
  // SECURITY: Change these default credentials before deploying!
  // Use environment variables in production for real security.
  adminCredentials: {
    email: "admin@bangla.gov.bd",
    password: "ChangeMeImmediately123!"
  }
};

// Browser-only voices (Web Speech API)
const DEFAULT_VOICES: Voice[] = [
  {
    id: "voice-male-1",
    name: "ব্রাউজার পুরুষ কণ্ঠ",
    description: "ব্রাউজার বিল্ট-ইন বাংলা পুরুষ কণ্ঠ - Web Speech API",
    gender: "male",
    language: "bn-BD",
    provider: "browser",
    enabled: true,
    defaultSpeed: 1.0,
    defaultPitch: 1.0,
    icon: "🌐",
    category: "ব্রাউজার কণ্ঠস্বর"
  },
  {
    id: "voice-female-1",
    name: "ব্রাউজার মহিলা কণ্ঠ",
    description: "ব্রাউজার বিল্ট-ইন বাংলা মহিলা কণ্ঠ - Web Speech API",
    gender: "female",
    language: "bn-BD",
    provider: "browser",
    enabled: true,
    defaultSpeed: 1.0,
    defaultPitch: 1.0,
    icon: "🌐",
    category: "ব্রাউজার কণ্ঠস্বর"
  }
];

// Single language — Bangla only
const DEFAULT_LANGUAGES: Language[] = [
  {
    id: "lang-bn-bd",
    name: "বাংলা (বাংলাদেশ)",
    code: "bn-BD",
    nativeName: "বাংলা",
    enabled: true,
    direction: "ltr",
    isDefault: true
  }
];

const DEFAULT_PAGES_CONTENT: PagesContent = {
  about: {
    title: "আমাদের সম্পর্কে",
    content: "বাংলা ভয়েস প্ল্যাটফর্ম একটি সম্পূর্ণ বাংলা ভাষাভিত্তিক ওয়েব অ্যাপ্লিকেশন। এই প্ল্যাটফর্মটি বাংলা ভাষায় Text-to-Speech (TTS) এবং Speech-to-Text (STT) সেবা প্রদান করে।\n\nআমাদের লক্ষ্য হলো বাংলা ভাষাকে ডিজিটাল জগতে আরও সমৃদ্ধ ও অ্যাক্সেসিবল করা। এই প্ল্যাটফর্মের মাধ্যমে যে কেউ সহজেই বাংলা লেখাকে কথায় এবং কথাকে লেখায় রূপান্তর করতে পারবেন।\n\nএই প্ল্যাটফর্মটি সম্পূর্ণ বিনা খরচে ব্যবহার করা যায়। সব প্রসেসিং আপনার ব্রাউজারেই হয় — কোনো বাহ্যিক সার্ভার বা API প্রয়োজন নেই।",
    lastUpdated: "2025-01-01T00:00:00.000Z"
  },
  privacy: {
    title: "গোপনীয়তা নীতি",
    content: "আমরা আপনার ব্যক্তিগত তথ্যের গোপনীয়তা গুরুত্বের সাথে রক্ষা করি। এই গোপনীয়তা নীতিতে বর্ণিত পদ্ধতিতে আমরা আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।\n\nআমরা আপনার ইমেইল ঠিকানা, নাম এবং ব্যবহারের তথ্য সংগ্রহ করি। এই তথ্য শুধুমাত্র সেবা উন্নয়ন এবং ব্যবহারকারী অভিজ্ঞতা উন্নয়নের জন্য ব্যবহৃত হয়।",
    lastUpdated: "2025-01-01T00:00:00.000Z"
  },
  terms: {
    title: "ব্যবহারের শর্তাবলী",
    content: "বাংলা ভয়েস প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে আপনি নিম্নলিখিত শর্তাবলীতে সম্মত হচ্ছেন।\n\n১. এই প্ল্যাটফর্মটি শুধুমাত্র ব্যক্তিগত এবং অবাণিজ্যিক ব্যবহারের জন্য।\n২. আপনি এই সেবা কোনো অবৈধ কাজে ব্যবহার করতে পারবেন না।\n৩. আমরা যেকোনো সময় সেবার শর্তাবলী পরিবর্তন করার অধিকার সংরক্ষণ করি।",
    lastUpdated: "2025-01-01T00:00:00.000Z"
  },
  faq: {
    title: "সাধারণ জিজ্ঞাসা",
    content: "কিভাবে TTS ব্যবহার করব?\nটেক্সট ইনপুট বক্সে বাংলা লিখুন এবং Play বাটনে ক্লিক করুন। ব্রাউজারের বিল্ট-ইন কণ্ঠস্বর অডিও স্বয়ংক্রিয়ভাবে তৈরি করবে। কোনো ক্যারেক্টার লিমিট নেই।\n\nকোন ব্রাউজার সাপোর্ট করে?\nGoogle Chrome এবং Microsoft Edge ব্রাউজার সবচেয়ে ভালো সাপোর্ট করে।\n\nএই সেবা কি বিনা খরচে?\nহ্যাঁ, সম্পূর্ণ বিনা খরচে। ব্রাউজারের Web Speech API ব্যবহার করা হয়।",
    lastUpdated: "2025-01-01T00:00:00.000Z"
  }
};

// ─── localStorage Helpers ─────────────────────────────────────────────

const STORAGE_KEYS = {
  siteConfig: 'bangla_voice_site_config',
  voices: 'bangla_voice_voices',
  languages: 'bangla_voice_languages',
  pagesContent: 'bangla_voice_pages_content',
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Site Config ──────────────────────────────────────────────────────

export function getSiteConfig(): SiteConfig {
  return getFromStorage<SiteConfig>(STORAGE_KEYS.siteConfig, DEFAULT_SITE_CONFIG);
}

export function updateSiteConfig(config: SiteConfig): void {
  setToStorage(STORAGE_KEYS.siteConfig, config);
}

// ─── Voices ───────────────────────────────────────────────────────────

export function getVoices(): Voice[] {
  return getFromStorage<Voice[]>(STORAGE_KEYS.voices, DEFAULT_VOICES);
}

export function updateVoices(voices: Voice[]): void {
  setToStorage(STORAGE_KEYS.voices, voices);
}

// ─── Languages ────────────────────────────────────────────────────────

export function getLanguages(): Language[] {
  return getFromStorage<Language[]>(STORAGE_KEYS.languages, DEFAULT_LANGUAGES);
}

export function updateLanguages(languages: Language[]): void {
  setToStorage(STORAGE_KEYS.languages, languages);
}

// ─── Pages Content ────────────────────────────────────────────────────

export function getPagesContent(): PagesContent {
  return getFromStorage<PagesContent>(STORAGE_KEYS.pagesContent, DEFAULT_PAGES_CONTENT);
}

export function updatePageContent(pageKey: string, pageData: { title: string; content: string }): void {
  const pages = getPagesContent();
  pages[pageKey] = {
    ...pages[pageKey],
    ...pageData,
    lastUpdated: new Date().toISOString(),
  };
  setToStorage(STORAGE_KEYS.pagesContent, pages);
}

// ─── Export / Import All Data ─────────────────────────────────────────

export function exportAllData() {
  return {
    siteConfig: getSiteConfig(),
    voices: getVoices(),
    languages: getLanguages(),
    pagesContent: getPagesContent(),
    exportedAt: new Date().toISOString(),
  };
}

export function importAllData(data: {
  siteConfig?: SiteConfig;
  voices?: Voice[];
  languages?: Language[];
  pagesContent?: PagesContent;
}): void {
  if (data.siteConfig) updateSiteConfig(data.siteConfig);
  if (data.voices) updateVoices(data.voices);
  if (data.languages) updateLanguages(data.languages);
  if (data.pagesContent) setToStorage(STORAGE_KEYS.pagesContent, data.pagesContent);
}
