// store/registration.persist.ts
const DRAFT_KEY = 'pk_registration_draft';

export function saveDraftToStorage(draft: unknown) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {}
}

export function loadDraftFromStorage<T = unknown>(): T | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearDraftFromStorage() {
  localStorage.removeItem(DRAFT_KEY);
}
