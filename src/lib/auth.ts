// Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

const USERS_KEY = 'bangla_voice_users';
const SESSION_KEY = 'bangla_voice_session';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(name: string, email: string, password: string): { success: boolean; message: string } {
  const users = getUsers();
  const existing = users.find(u => u.email === email);
  if (existing) {
    return { success: false, message: 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে।' };
  }
  const newUser: User = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    name,
    email,
    password: simpleHash(password),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true, message: 'নিবন্ধন সফল হয়েছে!' };
}

export function login(email: string, password: string): { success: boolean; message: string; user?: Omit<User, 'password'> } {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === simpleHash(password));
  if (!user) {
    return { success: false, message: 'ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।' };
  }
  localStorage.setItem(SESSION_KEY, user.id);
  const { password: _, ...userWithoutPassword } = user;
  return { success: true, message: 'সফলভাবে লগইন হয়েছে!', user: userWithoutPassword };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): Omit<User, 'password'> | null {
  if (typeof window === 'undefined') return null;
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return null;
  const users = getUsers();
  const user = users.find(u => u.id === sessionId);
  if (!user) return null;
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}
