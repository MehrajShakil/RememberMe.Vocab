import { useState, useEffect, useCallback } from 'react';
import type { VocabWord, QualityRating } from '../types';
import { useWords } from './useWords';
import { useSettings } from './useSettings';
import { selectDailyWords } from '../utils/daily';
import { sm2 } from '../utils/sm2';

const TODAY = new Date().toISOString().split('T')[0];
const REVIEWED_KEY = `reviewed_${TODAY}`;

export function useDailyWords() {
  const { words, loading: wordsLoading, updateWord } = useWords();
  const { settings, loading: settingsLoading } = useSettings();
  const [dailyWords, setDailyWords] = useState<VocabWord[]>([]);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [reviewedLoading, setReviewedLoading] = useState(true);

  // Load today's reviewed set from persistent storage on mount
  useEffect(() => {
    chrome.storage.local.get(REVIEWED_KEY).then((result) => {
      const stored = result[REVIEWED_KEY] as string[] | undefined;
      if (stored) setReviewed(new Set(stored));
      setReviewedLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!wordsLoading && !settingsLoading) {
      const selected = selectDailyWords(words, settings.dailyWordCount);
      setDailyWords(selected);
    }
  }, [words, wordsLoading, settings, settingsLoading]);

  const rateWord = useCallback(
    async (word: string, quality: QualityRating) => {
      const current = dailyWords.find((w) => w.word === word);
      if (!current) return;

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

  return {
    dailyWords,
    loading: wordsLoading || settingsLoading || reviewedLoading,
    reviewed,
    rateWord,
    reviewedCount: reviewed.size,
    // Include already-reviewed words that were removed from dailyWords after their nextReview advanced
    totalCount: dailyWords.length + reviewed.size,
  };
}
