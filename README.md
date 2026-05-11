# 🎙️ বাংলা ভয়েস প্ল্যাটফর্ম

<p align="center">
  <strong>লেখা থেকে কথা এবং কথা থেকে লেখা — বাংলা ভাষায় স্পিচ সলিউশন</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-latest-black" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/Cloudflare_Pages-Ready-F38020?logo=cloudflare" alt="Cloudflare Pages" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## ✨ বৈশিষ্ট্যসমূহ

### মূল ফিচার
- **Text-to-Speech (TTS)** — বাংলা টেক্সটকে অডিওতে রূপান্তর (ব্রাউজার নেটিভ Web Speech API)
- **Speech-to-Text (STT)** — বাংলা কথাকে লেখায় রূপান্তর (ব্রাউজার মাইক্রোফোন)
- **ইউনিকোড / পুরনো বাংলা (ANSI/Bijoy) টগল** — দুই ধরনের এনকোডিং সাপোর্ট
- **ফাইল আপলোড** — TTS তে `.txt` ফাইল এবং STT তে অডিও ফাইল আপলোড
- **অডিও কন্ট্রোল** — Play, Pause, Stop, স্বাভাবিক ও পরিবর্তিত গতিতে ডাউনলোড
- **ভয়েস সেটিংস** — গতি, পিচ ও ভলিউম কাস্টমাইজেশন
- **রিয়েল-টাইম ট্রান্সক্রিপশন** — লাইভ কথা থেকে তাৎক্ষণিক বাংলা টেক্সট

### এডমিন প্যানেল
- **সম্পূর্ণ ফাংশনাল এডমিন প্যানেল** — হেডারে "এডমিন" বাটন বা নিচে বাম কোণের শিল্ড আইকন থেকে অ্যাক্সেস
- **সাইট কনফিগারেশন এডিটর** — সাইটের নাম, টাইটেল, বিবরণ, হিরো সেকশন, থিম রঙ, TTS/STT সেটিংস, হেডার নেভিগেশন, ফুটার পার্টনার, ফিচার তালিকা — সব পরিবর্তনযোগ্য
- **ভয়েস ম্যানেজমেন্ট** — নতুন ভয়েস যোগ, সম্পাদনা, মুছে ফেলা, সক্রিয়/নিষ্ক্রিয় টগল
- **ভাষা ম্যানেজমেন্ট** — নতুন ভাষা যোগ, সম্পাদনা, ডিফল্ট সেট, LTR/RTL সাপোর্ট
- **পেজ কন্টেন্ট এডিটর** — সম্পর্কে, গোপনীয়তা নীতি, শর্তাবলী, FAQ সম্পাদনা
- **ডাটা এক্সপোর্ট/ইমপোর্ট** — সকল JSON ডাটা একটি ফাইলে ব্যাকআপ ও রিস্টোর

### অন্যান্য
- **রেসপন্সিভ ডিজাইন** — মোবাইল, ট্যাবলেট ও ডেস্কটপ সাপোর্ট
- **বাংলা UI** — সম্পূর্ণ বাংলা ইন্টারফেস (Noto Sans Bengali + Noto Serif Bengali)
- **JSON ভিত্তিক ডাটা সিস্টেম** — সকল সাইট কনফিগারেশন JSON ফাইলে সংরক্ষিত
- **ইউজার অথেনটিকেশন** — ইমেইল/পাসওয়ার্ড লগইন ও রেজিস্ট্রেশন
- **ইউজার ড্যাশবোর্ড** — হিস্ট্রি ট্র্যাকিং ও সেটিংস

---

## 🛠️ টেক স্ট্যাক

| প্রযুক্তি | বিবরণ |
|-----------|-------|
| **Next.js 16** (App Router) | React ফ্রেমওয়ার্ক, Static Export |
| **TypeScript 5** | টাইপ-সেফ ডেভেলপমেন্ট |
| **Tailwind CSS 4** | ইউটিলিটি-ফার্স্ট CSS ফ্রেমওয়ার্ক |
| **shadcn/ui** | অ্যাক্সেসিবল ও কাস্টমাইজেবল UI কম্পোনেন্ট |
| **Prisma ORM** | টাইপ-সেফ ডাটাবেস (SQLite) |
| **NextAuth.js v4** | অথেনটিকেশন সিস্টেম |
| **Lucide Icons** | আইকন লাইব্রেরি |
| **Framer Motion** | অ্যানিমেশন ও ট্রানজিশন |

---

## 📁 প্রজেক্ট স্ট্রাকচার

```
bangla-voice-platform/
├── data/                           # JSON ডাটা ফাইল (এডমিন প্যানেল থেকে ম্যানেজ হয়)
│   ├── site-config.json            # সাইটের সম্পূর্ণ কনফিগারেশন
│   ├── voices.json                 # ভয়েস তালিকা
│   ├── languages.json              # ভাষা তালিকা
│   └── pages-content.json          # পেজ কন্টেন্ট (সম্পর্কে, গোপনীয়তা, শর্তাবলী, FAQ)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # রুট লেআউট
│   │   ├── page.tsx                # হোম পেজ (TTS + STT ট্যাব + এডমিন ইন্টিগ্রেশন)
│   │   ├── globals.css             # গ্লোবাল স্টাইল
│   │   ├── login/page.tsx          # লগইন পেজ
│   │   ├── register/page.tsx       # রেজিস্ট্রেশন পেজ
│   │   ├── about/page.tsx          # সম্পর্কে পেজ
│   │   ├── dashboard/page.tsx      # ড্যাশবোর্ড পেজ
│   │   └── api/admin/
│   │       ├── auth/route.ts       # এডমিন লগইন API
│   │       ├── config/route.ts     # সাইট কনফিগ API (GET/PUT)
│   │       ├── voices/route.ts     # ভয়েস CRUD API
│   │       ├── languages/route.ts  # ভাষা CRUD API
│   │       ├── pages/route.ts      # পেজ কন্টেন্ট API
│   │       └── data/route.ts       # ডাটা এক্সপোর্ট/ইমপোর্ট API
│   │
│   ├── components/
│   │   ├── Header.tsx              # হেডার (এডমিন বাটন সহ)
│   │   ├── Footer.tsx              # ফুটার (JSON কনফিগ থেকে)
│   │   ├── TTSPanel.tsx            # TTS প্যানেল
│   │   ├── STTPanel.tsx            # STT প্যানেল
│   │   ├── Toast.tsx               # টোস্ট নোটিফিকেশন
│   │   ├── admin/
│   │   │   ├── AdminPanel.tsx      # এডমিন প্যানেল (সাইডবার + কন্টেন্ট)
│   │   │   ├── AdminLogin.tsx      # এডমিন লগইন মডাল
│   │   │   ├── SiteConfigEditor.tsx    # সাইট কনফিগ এডিটর
│   │   │   ├── VoicesManager.tsx      # ভয়েস ম্যানেজার
│   │   │   ├── LanguagesManager.tsx   # ভাষা ম্যানেজার
│   │   │   └── PagesManager.tsx       # পেজ কন্টেন্ট এডিটর
│   │   └── ui/                     # shadcn/ui কম্পোনেন্ট
│   │
│   ├── hooks/
│   │   ├── useTTS.ts               # TTS হুক (Web Speech API)
│   │   ├── useSTT.ts               # STT হুক (Web Speech API)
│   │   └── useAuth.ts              # অথেনটিকেশন হুক
│   │
│   └── lib/
│       ├── json-data.ts            # JSON ফাইল CRUD লাইব্রেরি
│       ├── db.ts                   # Prisma ডাটাবেস ক্লায়েন্ট
│       ├── auth.ts                 # অথেনটিকেশন ইউটিলিটি
│       ├── converter.ts            # ANSI ↔ Unicode কনভার্টার
│       ├── tts.ts                  # TTS ইঞ্জিন
│       ├── stt.ts                  # STT ইঞ্জিন
│       ├── history.ts              # হিস্ট্রি ম্যানেজার
│       └── utils.ts                # সাধারণ ইউটিলিটি
│
├── prisma/
│   └── schema.prisma               # ডাটাবেস স্কিমা (SQLite)
│
├── public/
│   ├── favicon.ico                 # ফেভিকন
│   ├── logo.svg                    # লোগো
│   └── robots.txt                  # SEO রোবটস
│
├── next.config.ts                  # Next.js কনফিগ (Static Export)
├── tailwind.config.ts              # Tailwind CSS কনফিগ
├── tsconfig.json                   # TypeScript কনফিগ
├── package.json                    # ডিপেন্ডেন্সি
└── README.md                       # এই ফাইল
```

---

## 🚀 ইন্সটলেশন ও সেটআপ

### প্রয়োজনীয়তা
- **Node.js** 18+ (অথবা **Bun**)
- **npm**, **yarn** অথবা **bun**

### ইন্সটলেশন

```bash
# রেপো ক্লোন করুন
git clone https://github.com/your-username/bangla-voice-platform.git
cd bangla-voice-platform

# ডিপেন্ডেন্সি ইন্সটল করুন
npm install
# অথবা
bun install

# ডাটাবেস সেটআপ (Prisma + SQLite)
npx prisma db push
# অথবা
bun run db:push

# ডেভ সার্ভার চালু করুন
npm run dev
# অথবা
bun run dev
```

সার্ভার চালু হলে ব্রাউজারে যান: **http://localhost:3000**

---

## 🔐 এডমিন প্যানেল

### অ্যাক্সেস
- হেডারে **"এডমিন"** বাটনে ক্লিক করুন
- অথবা পেজের **নিচে বাম কোণের শিল্ড (🛡️) আইকনে** ক্লিক করুন

### ডিফল্ট লগইন
```
ইমেইল:    admin@bangla.gov.bd
পাসওয়ার্ড: admin123
```

> ⚠️ **গুরুত্বপূর্ণ:** প্রোডাকশনে ডিপ্লয় করার আগে অবশ্যই `data/site-config.json` ফাইলে এডমিন পাসওয়ার্ড পরিবর্তন করুন।

### এডমিন প্যানেলের সেকশনসমূহ

| সেকশন | কাজ |
|--------|------|
| **সাইট কনফিগ** | সাইটের নাম, টাইটেল, বিবরণ, থিম রঙ, হিরো সেকশন, TTS/STT সেটিংস, নেভিগেশন, ফুটার, ফিচার পরিবর্তন |
| **ভয়েস ম্যানেজমেন্ট** | নতুন ভয়েস যোগ, নাম/লিঙ্গ/গতি/পিচ সম্পাদনা, সক্রিয়/নিষ্ক্রিয় টগল |
| **ভাষা ম্যানেজমেন্ট** | নতুন ভাষা যোগ, কোড/নাম/দিকনির্দেশনা সম্পাদনা, ডিফল্ট সেট |
| **পেজ কন্টেন্ট** | সম্পর্কে, গোপনীয়তা নীতি, শর্তাবলী, FAQ পেজের কন্টেন্ট সম্পাদনা |
| **ডাটা এক্সপোর্ট/ইমপোর্ট** | সকল JSON ডাটা ব্যাকআপ (.json ফাইল) ও রিস্টোর |

---

## 📡 API এন্ডপয়েন্ট

### এডমিন API

| মেথড | এন্ডপয়েন্ট | কাজ |
|-------|-------------|------|
| `GET` | `/api/admin/config` | সাইট কনফিগ পড়ুন |
| `PUT` | `/api/admin/config` | সাইট কনফিগ আপডেট করুন |
| `GET` | `/api/admin/voices` | ভয়েস তালিকা পড়ুন |
| `POST` | `/api/admin/voices` | নতুন ভয়েস যোগ করুন |
| `PUT` | `/api/admin/voices` | ভয়েস আপডেট করুন |
| `DELETE` | `/api/admin/voices?id=xxx` | ভয়েস মুছুন |
| `GET` | `/api/admin/languages` | ভাষা তালিকা পড়ুন |
| `POST` | `/api/admin/languages` | নতুন ভাষা যোগ করুন |
| `PUT` | `/api/admin/languages` | ভাষা আপডেট করুন |
| `DELETE` | `/api/admin/languages?id=xxx` | ভাষা মুছুন |
| `GET` | `/api/admin/pages` | পেজ কন্টেন্ট পড়ুন |
| `PUT` | `/api/admin/pages` | পেজ কন্টেন্ট আপডেট করুন |
| `POST` | `/api/admin/auth` | এডমিন লগইন |
| `PUT` | `/api/admin/auth` | পাসওয়ার্ড পরিবর্তন |
| `GET` | `/api/admin/data` | সম্পূর্ণ ডাটা এক্সপোর্ট |
| `POST` | `/api/admin/data` | ডাটা ইমপোর্ট |

---

## 📄 JSON ডাটা সিস্টেম

সাইটের সকল কনফিগারেশন `data/` ফোল্ডারে JSON ফাইলে সংরক্ষিত। এডমিন প্যানেল থেকে সরাসরি পরিবর্তন করা যায়, অথবা ম্যানুয়ালি ফাইল এডিট করেও পরিবর্তন করা যায়।

### `data/site-config.json` — সাইট কনফিগারেশন
```json
{
  "siteName": "বাংলা ভয়েস",
  "siteTitle": "বাংলা ভয়েস — লেখা থেকে কথা, কথা থেকে লেখা",
  "heroTitle": "বাংলা ভয়েস প্ল্যাটফর্ম",
  "themeColor": "#006a4e",
  "maxChars": 1000,
  "features": [...],
  "headerNav": [...],
  "footer": { "copyright": "...", "partners": [...] }
}
```

### `data/voices.json` — ভয়েস তালিকা
```json
[
  { "id": "voice-male-1", "name": "পুরুষ কণ্ঠ ১", "gender": "male", "language": "bn-BD", "enabled": true },
  { "id": "voice-female-1", "name": "মহিলা কণ্ঠ ১", "gender": "female", "language": "bn-BD", "enabled": true }
]
```

### `data/languages.json` — ভাষা তালিকা
```json
[
  { "id": "lang-bn-bd", "name": "বাংলা (বাংলাদেশ)", "code": "bn-BD", "enabled": true, "isDefault": true },
  { "id": "lang-en-us", "name": "English (US)", "code": "en-US", "enabled": true, "isDefault": false }
]
```

### `data/pages-content.json` — পেজ কন্টেন্ট
```json
{
  "about": { "title": "আমাদের সম্পর্কে", "content": "...", "lastUpdated": "..." },
  "privacy": { "title": "গোপনীয়তা নীতি", "content": "...", "lastUpdated": "..." },
  "terms": { "title": "ব্যবহারের শর্তাবলী", "content": "...", "lastUpdated": "..." },
  "faq": { "title": "সাধারণ জিজ্ঞাসা", "items": [...], "lastUpdated": "..." }
}
```

---

## ☁️ Cloudflare Pages ডিপ্লয়মেন্ট

### ধাপ ১: GitHub রেপোতে পুশ করুন
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/bangla-voice-platform.git
git push -u origin main
```

### ধাপ ২: Cloudflare Pages তে কানেক্ট করুন
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) এ লগইন করুন
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. আপনার GitHub রেপো সিলেক্ট করুন
4. বিল্ড সেটিংস:
   - **Framework preset:** `Next.js (Static HTML Export)`
   - **Build command:** `npm run build` (অথবা `bun run build`)
   - **Build output directory:** `out`
5. **Save and Deploy** ক্লিক করুন

### ধাপ ৩: এনভায়রনমেন্ট ভেরিয়েবল (ঐচ্ছিক)
Cloudflare Pages এর **Settings** → **Environment Variables** এ নিচের ভেরিয়েবল যোগ করুন:

```env
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="https://your-domain.pages.dev"
```

---

## 🖥️ স্ক্রিপ্টস

| কমান্ড | কাজ |
|--------|------|
| `npm run dev` | ডেভ সার্ভার চালু করুন (port 3000) |
| `npm run build` | প্রোডাকশন বিল্ড |
| `npm run start` | প্রোডাকশন সার্ভার চালু করুন |
| `npm run lint` | ESLint দিয়ে কোড চেক করুন |
| `npm run db:push` | Prisma স্কিমা ডাটাবেসে পুশ করুন |
| `npm run db:generate` | Prisma ক্লায়েন্ট জেনারেট করুন |

---

## 🌐 ব্রাউজার সাপোর্ট

| ব্রাউজার | TTS | STT | নোট |
|-----------|-----|-----|------|
| **Google Chrome** | ✅ | ✅ | সবচেয়ে ভালো সাপোর্ট |
| **Microsoft Edge** | ✅ | ✅ | সম্পূর্ণ সাপোর্ট |
| **Mozilla Firefox** | ⚠️ | ❌ | TTS কাজ করলেও STT সীমিত |
| **Safari** | ⚠️ | ❌ | সীমিত সাপোর্ট |

> **নোট:** STT (Speech-to-Text) এর জন্য **Google Chrome** বা **Microsoft Edge** ব্রাউজার ব্যবহার করুন।

---

## 📝 কৃতিত্ব

এই প্রকল্পটি [read.bangla.gov.bd](https://read.bangla.gov.bd/) এবং [voice.bangla.gov.bd](https://voice.bangla.gov.bd/) ওয়েবসাইটের অনুপ্রেরণায় তৈরি।

| সংস্থা | ভূমিকা |
|--------|-------|
| [bangla.gov.bd](https://www.bangla.gov.bd/) | বাংলা ভাষা প্রযুক্তি প্ল্যাটফর্ম |
| [BCC](https://bcc.gov.bd/) | বাংলাদেশ কম্পিউটার কাউন্সিল |
| [ICTD](https://ictd.gov.bd/) | তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ |
| [EBLICT](http://eblict.gov.bd/) | এক্সপোর্ট বুস্ট ফর ICT প্রোডাক্টস |

---

## 📜 লাইসেন্স

এই প্রকল্প MIT লাইসেন্সের অধীনে প্রকাশিত। বিস্তারিত জানতে [LICENSE](LICENSE) ফাইল দেখুন।
