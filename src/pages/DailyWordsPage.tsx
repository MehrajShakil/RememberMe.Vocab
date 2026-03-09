import { useDailyWords } from '../hooks/useDailyWords';
import WordCard from '../components/WordCard';
import EmptyState from '../components/EmptyState';

export default function DailyWordsPage() {
  const { dailyWords, loading, reviewed, rateWord, reviewedCount, totalCount } =
    useDailyWords();

  if (loading) {
    return <p className="text-center text-gray-400 py-8">Loading...</p>;
  }

  if (dailyWords.length === 0) {
    return (
      <EmptyState
        title="No words yet"
        message="Add some words to start your daily review!"
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-600">Today's Words</h2>
        <span className="text-xs text-gray-400">
          {reviewedCount} / {totalCount} reviewed
        </span>
      </div>

      <div className="space-y-0">
        {dailyWords.map((word) => (
          <WordCard
            key={word.word}
            word={word}
            isReviewed={reviewed.has(word.word)}
            onRate={rateWord}
          />
        ))}
      </div>

      {reviewedCount === totalCount && totalCount > 0 && (
        <div className="text-center py-4">
          <p className="text-green-600 font-medium">All done for today! 🎉</p>
          <p className="text-xs text-gray-400 mt-1">
            Come back tomorrow for more words
          </p>
        </div>
      )}
    </div>
  );
}
