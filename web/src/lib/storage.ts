const EDIT_PREFIX = "gather:edit:";

export function saveEditToken(pollId: string, token: string): void {
  try {
    localStorage.setItem(EDIT_PREFIX + pollId, token);
  } catch {
    // storage unavailable (private mode / disabled) — host link still works
  }
}

export function getEditToken(pollId: string): string | null {
  try {
    return localStorage.getItem(EDIT_PREFIX + pollId);
  } catch {
    return null;
  }
}
