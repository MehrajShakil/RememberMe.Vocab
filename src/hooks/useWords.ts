import { useState, useEffect, useCallback } from 'react';
import type { VocabWord } from '../types';
import * as storage from '../utils/storage';

export function useWords() {
  const [words, setWords] = useState<VocabWord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await storage.getWords();
    setWords(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area === 'sync' && changes.words) {
        setWords((changes.words.newValue as VocabWord[] | undefined) ?? []);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, [refresh]);

  const addWord = useCallback(async (word: string) => {
    const newWord = await storage.addWord(word);
    setWords((prev) => [...prev, newWord]);
    return newWord;
  }, []);

  const removeWord = useCallback(async (word: string) => {
    await storage.removeWord(word);
    setWords((prev) => prev.filter((w) => w.word !== word));
  }, []);

  const updateWord = useCallback(async (updated: VocabWord) => {
    await storage.updateWord(updated);
    setWords((prev) => prev.map((w) => (w.word === updated.word ? updated : w)));
  }, []);

  return { words, loading, addWord, removeWord, updateWord, refresh };
}
