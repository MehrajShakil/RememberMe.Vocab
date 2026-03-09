import type { QualityRating, SM2Output } from '../types';

export function sm2(
  current: { easinessFactor: number; interval: number; repetitions: number },
  quality: QualityRating,
  today?: string
): SM2Output {
  const todayStr = today ?? new Date().toISOString().split('T')[0];
  let { easinessFactor, interval, repetitions } = current;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easinessFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easinessFactor =
    easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easinessFactor < 1.3) {
    easinessFactor = 1.3;
  }

  const nextDate = new Date(todayStr);
  nextDate.setDate(nextDate.getDate() + interval);
  const nextReview = nextDate.toISOString().split('T')[0];

  return { easinessFactor, interval, repetitions, nextReview };
}
