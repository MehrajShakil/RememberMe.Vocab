import { useState, useEffect, useCallback } from 'react';
import type { VocabWord, QualityRating } from '../types';
import { useWords } from './useWords';
import { useSettings } from './useSettings';
import { selectDailyWords } from '../utils/daily';
import { sm2 } from '../utils/sm2';

export function useDailyWords() {
  const { words, loading: wordsLoading, updateWord } = useWords();
  const { settings, loading: settingsLoading } = useSettings();
  const [dailyWords, setDailyWords] = useState<VocabWord[]>([]);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

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
      const updated: VocabWord = {
        ...current,
        ...result,
      };

      await updateWord(updated);
      setReviewed((prev) => new Set(prev).add(word));
    },
    [dailyWords, updateWord]
  );

  return {
    dailyWords,
    loading: wordsLoading || settingsLoading,
    reviewed,
    rateWord,
    reviewedCount: reviewed.size,
    totalCount: dailyWords.length,
  };
}
