export interface VocabWord {
  word: string;
  dateAdded: string;
  easinessFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
}

export interface Settings {
  dailyWordCount: number;
  targetLanguage: string;
}

export type QualityRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface SM2Output {
  easinessFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
}

export interface DictionaryEntry {
  word: string;
  phonetics: { text?: string; audio?: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }[];
    synonyms: string[];
    antonyms: string[];
  }[];
  sourceUrls: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  dailyWordCount: 10,
  targetLanguage: 'auto',
};

export function createNewWord(word: string): VocabWord {
  const today = new Date().toISOString().split('T')[0];
  return {
    word: word.trim().toLowerCase(),
    dateAdded: today,
    easinessFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: today,
  };
}
