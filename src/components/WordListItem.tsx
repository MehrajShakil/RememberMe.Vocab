import type { VocabWord } from '../types';

export default function WordListItem({
  word,
  onDelete,
}: {
  word: VocabWord;
  onDelete: (word: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 px-1 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{word.word}</p>
        <p className="text-xs text-gray-400">
          Added {word.dateAdded} · Next review {word.nextReview}
        </p>
      </div>
      <button
        onClick={() => onDelete(word.word)}
        className="ml-2 text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1"
      >
        Delete
      </button>
    </div>
  );
}
