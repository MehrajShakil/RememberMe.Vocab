import { useState } from 'react';
import type { VocabWord, QualityRating } from '../types';
import { useDictionary } from '../hooks/useDictionary';
import { getGoogleTranslateUrl } from '../utils/dictionary';
import RatingButtons from './RatingButtons';

export default function WordCard({
  word,
  isReviewed,
  onRate,
}: {
  word: VocabWord;
  isReviewed: boolean;
  onRate: (word: string, quality: QualityRating) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { entry, loading, error } = useDictionary(expanded ? word.word : null);

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
          {loading && (
            <p className="text-sm text-gray-400 py-2">Loading definition...</p>
          )}

          {error && (
            <p className="text-sm text-gray-400 py-2">
              No definition found.{' '}
              <a
                href={getGoogleTranslateUrl(word.word)}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-500 underline"
              >
                View on Google Translate
              </a>
            </p>
          )}

          {entry && (
            <div className="pt-2 space-y-2">
              {entry.phonetics?.[0]?.text && (
                <p className="text-sm text-gray-500 italic">
                  {entry.phonetics[0].text}
                </p>
              )}

              {entry.meanings.slice(0, 2).map((meaning, i) => {
                const synonyms = [
                  ...new Set([
                    ...meaning.synonyms,
                    ...meaning.definitions.flatMap((d) => d.synonyms),
                  ]),
                ].slice(0, 5);

                return (
                  <div key={i}>
                    <p className="text-xs font-semibold text-indigo-500 uppercase">
                      {meaning.partOfSpeech}
                    </p>
                    {meaning.definitions.slice(0, 2).map((def, j) => (
                      <div key={j} className="ml-2 mt-0.5">
                        <p className="text-sm text-gray-700">{def.definition}</p>
                        {def.example && (
                          <p className="text-xs text-gray-400 italic mt-0.5">
                            "{def.example}"
                          </p>
                        )}
                      </div>
                    ))}
                    {synonyms.length > 0 && (
                      <div className="ml-2 mt-1 flex flex-wrap gap-1">
                        {synonyms.map((syn) => (
                          <span
                            key={syn}
                            className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded"
                          >
                            {syn}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <a
                href={getGoogleTranslateUrl(word.word)}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs text-indigo-500 hover:underline mt-1"
              >
                View on Google Translate →
              </a>
            </div>
          )}

          <RatingButtons onRate={(q) => onRate(word.word, q)} />
        </div>
      )}
    </div>
  );
}
