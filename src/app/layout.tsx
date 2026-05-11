import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাংলা ভয়েস — লেখা থেকে কথা, কথা থেকে লেখা",
  description: "বাংলা ভাষায় টেক্সট টু স্পিচ (TTS) এবং স্পিচ টু টেক্সট (STT) প্ল্যাটফর্ম। বাংলাদেশ সরকারের তথ্য ও যোগাযোগ প্রযুক্তি বিভাগের উদ্যোগ।",
  keywords: ["বাংলা", "ভয়েস", "TTS", "STT", "স্পিচ", "বাংলাদেশ", "Bangla", "Voice", "Text to Speech", "Speech to Text"],
  authors: [{ name: "বাংলা ভয়েস" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "বাংলা ভয়েস প্ল্যাটফর্ম",
    description: "বাংলা ভাষায় টেক্সট টু স্পিচ এবং স্পিচ টু টেক্সট",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-white text-slate-800">
        {children}
      </body>
    </html>
  );
}
