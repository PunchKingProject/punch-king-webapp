import dayjs from "dayjs";
import type { PaymentStatus, SubscriptionStatus } from "../components/chips/StatusChipDropdown";
import { matchIsValidTel } from "mui-tel-input";
import type { PurchaseStatus } from "../pages/admin/Sponsorship/api/sponsorships.types";
import { isAxiosError, } from 'axios';
export type SectionKey =
  | 'about'
  | 'subscriptions'
  | 'ranking'
  | 'posts'
  | 'contacts';


type ApiErrorBody = {
  error?: string;
  message?: string;
  meta?: { message?: string };
};

export const gridWidth = (columns: number): string => {
  if (columns < 1 || columns > 12) {
    console.warn(
      `gridWidth: Expected a value between 1 and 12, received ${columns}`
    );
    return '100%';
  }
  const percentage = (columns / 12) * 100;
  return `${percentage.toFixed(6)}%`; // e.g. '33.333333%'
};


export function displayValue(v: unknown): React.ReactNode {
  if (v === null || v === undefined) return '';
  return typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean'
    ? v
    : String(v);
}

// utils/openInbox.ts
export function openInbox(email?: string) {
  const domain = (email?.split('@')[1] || '').toLowerCase();

  const providers: Record<string, string> = {
    'gmail.com': 'https://mail.google.com/mail/u/0/#inbox',
    'googlemail.com': 'https://mail.google.com/mail/u/0/#inbox',
    'yahoo.com': 'https://mail.yahoo.com/',
    'outlook.com': 'https://outlook.live.com/mail/0/inbox',
    'hotmail.com': 'https://outlook.live.com/mail/0/inbox',
    'live.com': 'https://outlook.live.com/mail/0/inbox',
    'icloud.com': 'https://www.icloud.com/mail',
    'proton.me': 'https://mail.proton.me/u/0/inbox',
  };

  const url = providers[domain];
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  // Fallback: open default mail app (compose window)
  window.location.href = 'mailto:';
}


export const isVideo = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);


export const normalizePaymentStatus = (s?: string | null): PaymentStatus => {
  const v = (s ?? 'pending').toLowerCase();
  return (
    ['pending', 'confirmed', 'failed'].includes(v) ? v : 'pending'
  ) as PaymentStatus;
};

export const normalizeSubscriptionStatus = (
  s?: string | null
): SubscriptionStatus => {
  const v = (s ?? 'pending').toLowerCase();
  return (
    ['pending', 'processing', 'processed', 'failed'].includes(v) ? v : 'pending'
  ) as SubscriptionStatus;
};

export const fmtDate = (iso?: string | null) =>
  iso ? dayjs(iso).format('M/D/YYYY') : '—';


// Optional: export the validator so you can reuse it in Yup if you want
export const isValidPhone = (v?: string | null) =>
  v ? matchIsValidTel(v) : false;


// src/utils/helpers.ts

// export function normalizePaymentStatus(s?: string | null): PaymentStatus {
//   switch ((s ?? '').toLowerCase()) {
//     case 'confirmed': return 'confirmed';
//     case 'failed':    return 'failed';
//     case 'pending':
//     default:          return 'pending';
//   }
// }

export function normalizePurchaseStatus(s?: string | null): PurchaseStatus {
  switch ((s ?? '').toLowerCase()) {
    case 'processing': return 'processing';
    case 'processed':  return 'processed';
    case 'failed':     return 'failed';
    case 'pending':
    default:           return 'pending';
  }
}

export function getToastError(err: unknown): string {
  // Axios-style errors
  if (isAxiosError<ApiErrorBody>(err)) {
    const data = err.response?.data;
    const fromAxios = data?.error ?? data?.message ?? data?.meta?.message;
    if (typeof fromAxios === 'string' && fromAxios.trim()) return fromAxios;
  }

  // Standard Error
  if (
    err instanceof Error &&
    typeof err.message === 'string' &&
    err.message.trim()
  ) {
    return err.message;
  }

  // Thrown string
  if (typeof err === 'string' && err.trim()) {
    return err;
  }

  return 'Something went wrong';
}

// src/utils/number.ts
export function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export function pctOrZero(v: unknown): number {
  return isFiniteNumber(v) ? v : 0;
}

export function pctTextOrZero(v: unknown, fractionDigits = 0): string {
  const n = pctOrZero(v);
  return `${n.toFixed(fractionDigits)}%`;
}

export function scrollToSection(id: SectionKey) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}