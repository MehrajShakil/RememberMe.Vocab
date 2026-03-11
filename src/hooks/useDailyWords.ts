import { useState, useEffect, useCallback, useRef } from 'react';
import type { VocabWord, QualityRating } from '../types';
import { useWords } from './useWords';
import { useSettings } from './useSettings';
import { selectDailyWords } from '../utils/daily';
import { sm2 } from '../utils/sm2';

const TODAY = new Date().toISOString().split('T')[0];
const REVIEWED_KEY = `reviewed_${TODAY}`;
const SNAPSHOTS_KEY = `snapshots_${TODAY}`;

type Snapshots = Record<string, VocabWord>;

export function useDailyWords() {
  const { words, loading: wordsLoading, updateWord } = useWords();
  const { settings, loading: settingsLoading } = useSettings();
  const [dailyWords, setDailyWords] = useState<VocabWord[]>([]);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [reviewedLoading, setReviewedLoading] = useState(true);
  const initialized = useRef(false);

  // Load today's reviewed set from persistent storage on mount
  useEffect(() => {
    chrome.storage.local.get(REVIEWED_KEY).then((result) => {
      const stored = result[REVIEWED_KEY] as string[] | undefined;
      if (stored) setReviewed(new Set(stored));
      setReviewedLoading(false);
    });
  }, []);

  // Snapshot daily words once on initial load — never re-derive after ratings change storage
  useEffect(() => {
    if (!wordsLoading && !settingsLoading && !initialized.current) {
      const selected = selectDailyWords(words, settings.dailyWordCount);
      setDailyWords(selected);
      initialized.current = true;
    }
  }, [words, wordsLoading, settings, settingsLoading]);

  const rateWord = useCallback(
    async (word: string, quality: QualityRating) => {
      const current = dailyWords.find((w) => w.word === word);
      if (!current) return;

      // Save pre-rating snapshot so reset can fully revert
      const snapshotsResult = await chrome.storage.local.get(SNAPSHOTS_KEY);
      const snapshots = (snapshotsResult[SNAPSHOTS_KEY] ?? {}) as Snapshots;
      if (!snapshots[word]) {
        snapshots[word] = current;
        await chrome.storage.local.set({ [SNAPSHOTS_KEY]: snapshots });
      }

      const result = sm2(current, quality);
      const updated: VocabWord = { ...current, ...result };

      await updateWord(updated);
      setReviewed((prev) => {
        const next = new Set(prev).add(word);
        chrome.storage.local.set({ [REVIEWED_KEY]: [...next] });
        return next;
      });
    },
    [dailyWords, updateWord]
  );

  const resetReviewed = useCallback(async () => {
    // Restore all pre-rating snapshots so words reappear in today's list
    const result = await chrome.storage.local.get(SNAPSHOTS_KEY);
    const snapshots = (result[SNAPSHOTS_KEY] ?? {}) as Snapshots;
    await Promise.all(Object.values(snapshots).map((w) => updateWord(w)));
    await chrome.storage.local.remove([REVIEWED_KEY, SNAPSHOTS_KEY]);
    setReviewed(new Set());
  }, [updateWord]);

  const resetWord = useCallback(
    async (word: string) => {
      const snapshotsResult = await chrome.storage.local.get(SNAPSHOTS_KEY);
      const snapshots = (snapshotsResult[SNAPSHOTS_KEY] ?? {}) as Snapshots;

      // Restore snapshot if it exists
      if (snapshots[word]) {
        await updateWord(snapshots[word]);
        delete snapshots[word];
        if (Object.keys(snapshots).length > 0) {
          await chrome.storage.local.set({ [SNAPSHOTS_KEY]: snapshots });
        } else {
          await chrome.storage.local.remove(SNAPSHOTS_KEY);
        }
      }

      // Remove from reviewed set
      setReviewed((prev) => {
        const next = new Set(prev);
        next.delete(word);
        if (next.size > 0) {
          chrome.storage.local.set({ [REVIEWED_KEY]: [...next] });
        } else {
          chrome.storage.local.remove(REVIEWED_KEY);
        }
        return next;
      });
    },
    [updateWord]
  );

  return {
    dailyWords,
    loading: wordsLoading || settingsLoading || reviewedLoading,
    reviewed,
    rateWord,
    resetReviewed,
    resetWord,
    reviewedCount: reviewed.size,
    // Exclude reviewed words still in dailyWords (timing gap before storage update propagates)
    totalCount: dailyWords.filter((w) => !reviewed.has(w.word)).length + reviewed.size,
  };
}
