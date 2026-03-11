import type { QualityRating } from '../types';

const ratings: { label: string; emoji: string; quality: QualityRating; color: string }[] = [
  { label: "Forgot", emoji: '😓', quality: 1, color: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' },
  { label: 'Hard', emoji: '😅', quality: 3, color: 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200' },
  { label: 'Good', emoji: '🙂', quality: 4, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200' },
  { label: 'Easy', emoji: '😎', quality: 5, color: 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200' },
];

export default function RatingButtons({
  onRate,
}: {
  onRate: (quality: QualityRating) => void;
}) {
  return (
    <div className="flex gap-2">
      {ratings.map((r) => (
        <button
          key={r.quality}
          onClick={() => onRate(r.quality)}
          className={`flex-1 flex flex-col items-center gap-0.5 px-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 ${r.color}`}
        >
          <span className="text-base leading-none">{r.emoji}</span>
          <span>{r.label}</span>
        </button>
      ))}
    </div>
  );
}
