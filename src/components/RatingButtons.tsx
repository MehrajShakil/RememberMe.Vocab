import type { QualityRating } from '../types';

const ratings: { label: string; quality: QualityRating; color: string }[] = [
  { label: "Didn't know", quality: 1, color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { label: 'Hard', quality: 3, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { label: 'Good', quality: 4, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { label: 'Easy', quality: 5, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
];

export default function RatingButtons({
  onRate,
}: {
  onRate: (quality: QualityRating) => void;
}) {
  return (
    <div className="flex gap-1.5 mt-3">
      {ratings.map((r) => (
        <button
          key={r.quality}
          onClick={() => onRate(r.quality)}
          className={`flex-1 px-1 py-1.5 rounded text-xs font-medium transition-colors ${r.color}`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
