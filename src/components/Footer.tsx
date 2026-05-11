interface FooterConfig {
  footer: {
    copyright: string;
    partners: { name: string; url: string; short: string }[];
  };
}

export default function Footer({ config }: { config?: FooterConfig }) {
  const partners = config?.footer?.partners || [
    { name: 'বাংলা.গভ.বিডি', url: 'https://www.bangla.gov.bd/', short: 'Bangla.gov.bd' },
    { name: 'BCC', url: 'https://bcc.gov.bd/', short: 'BCC' },
    { name: 'ICTD', url: 'https://ictd.gov.bd/', short: 'ICTD' },
    { name: 'EBLICT', url: 'https://eblict.gov.bd/', short: 'EBLICT' },
  ];

  const copyright = config?.footer?.copyright || '© ২০২৫ সর্বস্বত্ব সংরক্ষিত | বাংলা ভয়েস প্ল্যাটফর্ম';

  return (
    <footer className="bg-[#004d3a] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Partner logos */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-6">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-colors no-underline"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              {partner.name}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-4"></div>

        {/* Copyright */}
        <div className="text-center">
          <p
            className="text-sm text-white/70"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
