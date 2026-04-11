import { jwtDecode } from 'jwt-decode';

export type PkClaims = {
  email?: string;
  exp?: number;
  name?: string;
  role?: 'team' | 'user' | 'admin' | string;
  sub?: number | string;
};

export function readClaimsFromStorage(key = 'pk_token'): PkClaims | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(key);
  if (!token) return null;

  try {
    return jwtDecode<PkClaims>(token);
  } catch {
    return null; // corrupted/expired/etc.
  }
}
