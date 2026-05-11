export interface HistoryItem {
  id: string;
  type: 'tts' | 'stt';
  input: string;
  output: string;
  encoding: 'unicode' | 'ansi';
  duration?: number;
  createdAt: string;
}

function getHistoryKey(userId?: string): string {
  return userId ? `bangla_voice_history_${userId}` : 'bangla_voice_history';
}

function getHistory(userId?: string): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(getHistoryKey(userId));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[], userId?: string): void {
  localStorage.setItem(getHistoryKey(userId), JSON.stringify(items));
}

export function addHistory(item: Omit<HistoryItem, 'id' | 'createdAt'>, userId?: string): HistoryItem {
  const history = getHistory(userId);
  const newItem: HistoryItem = {
    ...item,
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    createdAt: new Date().toISOString(),
  };
  history.unshift(newItem);
  // Keep max 100 items
  if (history.length > 100) history.pop();
  saveHistory(history, userId);
  return newItem;
}

export function getAllHistory(userId?: string): HistoryItem[] {
  return getHistory(userId);
}

export function deleteHistoryItem(id: string, userId?: string): void {
  const history = getHistory(userId);
  const filtered = history.filter(item => item.id !== id);
  saveHistory(filtered, userId);
}

export function clearAllHistory(userId?: string): void {
  saveHistory([], userId);
}

export function getHistoryStats(userId?: string): { totalTTS: number; totalSTT: number; thisMonth: number } {
  const history = getHistory(userId);
  const now = new Date();
  const thisMonth = history.filter(item => {
    const itemDate = new Date(item.createdAt);
    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
  }).length;
  return {
    totalTTS: history.filter(item => item.type === 'tts').length,
    totalSTT: history.filter(item => item.type === 'stt').length,
    thisMonth,
  };
}
