// Basic Bijoy/ANSI to Unicode Bangla converter
// This implements a simplified mapping for common characters

const ansiToUnicodeMap: Record<string, string> = {
  'Av': 'অ', 'Avq': 'আ', 'Aw': 'ই', 'Awq': 'ঈ', 'AwW': 'উ', 'AwWq': 'ঊ',
  'AwQ': 'ঋ', 'AwQq': 'ঌ', 'Aew': 'এ', 'Aewq': 'ঐ', 'AaB': 'ও', 'AaBq': 'ঔ',
  'Avwg': 'ক', 'AvwgI': 'খ', 'AvwgY': 'গ', 'AvwgR': 'ঘ', 'AvwgU': 'ঙ',
  'Avjv': 'চ', 'AvjvI': 'ছ', 'AvjvY': 'জ', 'AvjvR': 'ঝ', 'AvjvU': 'ঞ',
  'AvMv': 'ট', 'AvMvI': 'ঠ', 'AvMvY': 'ড', 'AvMvR': 'ঢ', 'AvMvU': 'ণ',
  'AvbB': 'ত', 'AvbBI': 'থ', 'AvbBY': 'দ', 'AvbBR': 'ধ', 'AvbBU': 'ন',
  'Avcb': 'প', 'AvcbI': 'ফ', 'AvcbY': 'ব', 'AvcbR': 'ভ', 'AvcbU': 'ম',
  'Avab': 'য', 'AvabI': 'র', 'AvabY': 'ল', 'AvabR': 'শ', 'AvabU': 'ষ',
  'AvVv': 'স', 'AvVvI': 'হ', 'AvVvY': 'ড়', 'AvVvR': 'ঢ়', 'AvVvU': 'য়',
  'Aviv': 'ৎ', 'Kv': 'ঁ', 'KvI': 'ং', 'KvY': 'ঃ', 'Avi': '়', 'Aeb': 'া',
  'AewW': 'ি', 'AewI': 'ী', 'AebI': 'ু', 'AebY': 'ূ', 'AebYI': 'ৃ',
  'AeB': 'ে', 'AeBI': 'ৈ', 'AaBqI': 'ো', 'AaBqY': 'ৌ',
  'mw': '্', 'AviB': '্য',
  'AviVv': '্ব', 'Avicb': '্প', 'AvibB': '্ত', 'Aviab': '্র',
  'AvicbI': '্ফ', 'AvibBI': '্থ', 'AviVvI': '্ভ', 'AviVvR': '্স',
  'AviVvY': '্হ', 'AvicbY': '্দ', 'AviVvU': '্ম',
};

const unicodeToAnsiMap: Record<string, string> = {};
for (const [ansi, unicode] of Object.entries(ansiToUnicodeMap)) {
  unicodeToAnsiMap[unicode] = ansi;
}

export function ansiToUnicode(text: string): string {
  let result = text;
  // Sort by length descending to match longer patterns first
  const keys = Object.keys(ansiToUnicodeMap).sort((a, b) => b.length - a.length);
  for (const ansi of keys) {
    result = result.split(ansi).join(ansiToUnicodeMap[ansi]);
  }
  return result;
}

export function unicodeToAnsi(text: string): string {
  let result = text;
  const keys = Object.keys(unicodeToAnsiMap).sort((a, b) => b.length - a.length);
  for (const unicode of keys) {
    result = result.split(unicode).join(unicodeToAnsiMap[unicode]);
  }
  return result;
}
