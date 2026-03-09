import type { VocabWord, Settings } from '../types';
import { DEFAULT_SETTINGS, createNewWord } from '../types';

export async function getWords(): Promise<VocabWord[]> {
  const result = await chrome.storage.sync.get('words');
  return (result.words as VocabWord[] | undefined) ?? [];
}

export async function saveWords(words: VocabWord[]): Promise<void> {
  await chrome.storage.sync.set({ words });
}

export async function addWord(word: string): Promise<VocabWord> {
  const words = await getWords();
  const normalized = word.trim().toLowerCase();
  if (words.some((w) => w.word === normalized)) {
    throw new Error('Word already exists');
  }
  const newWord = createNewWord(normalized);
  words.push(newWord);
  await saveWords(words);
  return newWord;
}

export async function removeWord(word: string): Promise<void> {
  const words = await getWords();
  const filtered = words.filter((w) => w.word !== word);
  await saveWords(filtered);
}

export async function updateWord(updated: VocabWord): Promise<void> {
  const words = await getWords();
  const index = words.findIndex((w) => w.word === updated.word);
  if (index !== -1) {
    words[index] = updated;
    await saveWords(words);
  }
}

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.sync.get('settings');
  return (result.settings as Settings | undefined) ?? { ...DEFAULT_SETTINGS };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.sync.set({ settings });
}
