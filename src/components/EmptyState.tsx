export default function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-12">
      <div className="text-5xl mb-4">📖</div>
      <p className="text-lg font-medium text-gray-600">{title}</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
}
