import { useState } from 'react';
import type { VocabWord, QualityRating } from '../types';
import { useDictionary } from '../hooks/useDictionary';
import { getGoogleTranslateUrl } from '../utils/dictionary';
import RatingButtons from './RatingButtons';

export default function WordCard({
  word,
  isReviewed,
  onRate,
  targetLanguage,
}: {
  word: VocabWord;
  isReviewed: boolean;
  onRate: (word: string, quality: QualityRating) => void;
  targetLanguage: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const { entry, loading } = useDictionary(expanded ? word.word : null);

  const translateUrl = getGoogleTranslateUrl(word.word, targetLanguage);

  const partOfSpeech = entry?.meanings?.[0]?.partOfSpeech ?? null;

  // Find the first example sentence across all meanings/definitions
  const exampleSentence = entry?.meanings
    ?.flatMap((m) => m.definitions)
    ?.find((d) => d.example)
    ?.example ?? null;

  if (isReviewed) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-3 mb-2 opacity-70">
        <div className="flex items-center justify-between">
          <span className="font-medium text-green-700">{word.word}</span>
          <span className="text-xs text-green-500">Reviewed ✓</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm mb-2 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">
            {word.word}
          </span>
          <span className="text-xs text-gray-400">
            {expanded ? 'tap to collapse' : 'tap to reveal'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-100">
          <div className="py-2">
            {loading && <p className="text-sm text-gray-400">Loading...</p>}
            {!loading && partOfSpeech && (
              <span className="inline-block text-xs font-semibold text-indigo-500 uppercase mb-1">{partOfSpeech}</span>
            )}
            {!loading && exampleSentence && (
              <p className="text-sm text-gray-600 italic">"{exampleSentence}"</p>
            )}
            {!loading && !exampleSentence && entry && (
              <p className="text-sm text-gray-400">No example available.</p>
            )}
            <a
              href={translateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs text-indigo-500 hover:underline mt-2"
            >
              View on Google Translate →
            </a>
          </div>
          <RatingButtons onRate={(q) => onRate(word.word, q)} />
        </div>
      )}
    </div>
  );
}
