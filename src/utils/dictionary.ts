import type { DictionaryEntry } from '../types';

const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export async function fetchDefinition(
  word: string
): Promise<DictionaryEntry | null> {
  const cacheKey = `dict_${word}`;

  const cached = await chrome.storage.local.get(cacheKey);
  if (cached[cacheKey]) {
    return cached[cacheKey] as DictionaryEntry;
  }

  try {
    const response = await fetch(`${API_URL}/${encodeURIComponent(word)}`);
    if (!response.ok) return null;

    const data = await response.json();
    const entry = data[0] as DictionaryEntry;

    await chrome.storage.local.set({ [cacheKey]: entry });
    return entry;
  } catch {
    return null;
  }
}

export function getGoogleTranslateUrl(word: string): string {
  return `https://translate.google.com/?sl=en&tl=auto&text=${encodeURIComponent(word)}`;
}
