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
