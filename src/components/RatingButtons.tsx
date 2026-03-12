import type { QualityRating } from '../types';

export default function RatingButtons({
  onRate,
}: {
  onRate: (quality: QualityRating) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onRate(1)}
        className="flex-1 flex flex-col items-center gap-0.5 px-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
      >
        <span className="text-base leading-none">😓</span>
        <span>Forgot</span>
      </button>
      <button
        onClick={() => onRate(4)}
        className="flex-1 flex flex-col items-center gap-0.5 px-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
      >
        <span className="text-base leading-none">✅</span>
        <span>Remembered</span>
      </button>
    </div>
  );
}
