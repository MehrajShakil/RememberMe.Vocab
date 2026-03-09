import type { VocabWord } from '../types';

export function selectDailyWords(
  allWords: VocabWord[],
  count: number,
  today?: string
): VocabWord[] {
  const todayStr = today ?? new Date().toISOString().split('T')[0];

  const overdue: VocabWord[] = [];
  const newWords: VocabWord[] = [];
  const upcoming: VocabWord[] = [];

  for (const w of allWords) {
    if (w.nextReview <= todayStr) {
      if (w.repetitions === 0) {
        newWords.push(w);
      } else {
        overdue.push(w);
      }
    } else {
      upcoming.push(w);
    }
  }

  overdue.sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  newWords.sort((a, b) => a.dateAdded.localeCompare(b.dateAdded));
  upcoming.sort((a, b) => a.nextReview.localeCompare(b.nextReview));

  const result: VocabWord[] = [];

  for (const w of overdue) {
    if (result.length >= count) break;
    result.push(w);
  }
  for (const w of newWords) {
    if (result.length >= count) break;
    result.push(w);
  }
  for (const w of upcoming) {
    if (result.length >= count) break;
    result.push(w);
  }

  return result;
}
