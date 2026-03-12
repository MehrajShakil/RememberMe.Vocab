import type { VocabWord, QualityRating } from '../types';
import { useDictionary } from '../hooks/useDictionary';
import { getGoogleTranslateUrl } from '../utils/dictionary';
import RatingButtons from './RatingButtons';

export default function WordCard({
  word,
  isReviewed,
  isExpanded,
  onToggle,
  onRate,
  onReset,
  targetLanguage,
}: {
  word: VocabWord;
  isReviewed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onRate: (word: string, quality: QualityRating) => void;
  onReset: (word: string) => void;
  targetLanguage: string;
}) {
  const { entry, loading } = useDictionary(isExpanded ? word.word : null);

  const translateUrl = getGoogleTranslateUrl(word.word, targetLanguage);
  const partOfSpeech = entry?.meanings?.[0]?.partOfSpeech ?? null;

  if (isReviewed) {
    return (
      <div className="flex items-center justify-between px-4 py-2.5 mb-2 rounded-xl bg-green-50 border border-green-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"></span>
          <span className="text-sm font-medium text-green-700">{word.word}</span>
        </div>
        <div className="flex items-center gap-3">
          {(word.successCount ?? 0) > 0 && (
            <span className="text-xs text-green-500 font-medium">✓ {word.successCount}</span>
          )}
          <button
            onClick={() => onReset(word.word)}
            className="text-xs text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
            title="Redo this word"
          >
            ↺
          </button>
          <span className="text-xs text-green-400 font-medium">Done</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-2 rounded-xl border overflow-hidden transition-all duration-200 ${isExpanded ? 'border-indigo-200 shadow-md' : 'border-gray-200 shadow-sm'}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${isExpanded ? 'bg-indigo-400' : 'bg-gray-300'}`}></span>
            <span className="text-base font-semibold text-gray-800 tracking-wide">{word.word}</span>
            {(word.successCount ?? 0) > 0 && (
              <span className="text-[10px] font-semibold text-green-500 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full">
                ✓ {word.successCount}
              </span>
            )}
          </div>
          <span className={`text-[11px] font-medium transition-colors ${isExpanded ? 'text-indigo-400' : 'text-gray-400'}`}>
            {isExpanded ? '▲ collapse' : '▼ reveal'}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="bg-gradient-to-b from-indigo-50/60 to-white border-t border-indigo-100 px-4 pt-3 pb-4">
          {loading && (
            <p className="text-xs text-gray-400 mb-3 animate-pulse">Looking up...</p>
          )}

          {!loading && partOfSpeech && (
            <span className="inline-block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              {partOfSpeech}
            </span>
          )}

          <a
            href={translateUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 transition-colors font-medium mb-4"
          >
            <span>🌐</span>
            <span className="hover:underline">Open in Google Translate</span>
            <span className="text-indigo-300">→</span>
          </a>

          <div className="border-t border-indigo-100 pt-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-semibold">How well did you know it?</p>
            <RatingButtons onRate={(q) => onRate(word.word, q)} />
          </div>
        </div>
      )}
    </div>
  );
}
