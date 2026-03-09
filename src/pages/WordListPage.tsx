import { useState } from 'react';
import { useWords } from '../hooks/useWords';
import WordListItem from '../components/WordListItem';
import EmptyState from '../components/EmptyState';

export default function WordListPage() {
  const { words, loading, removeWord } = useWords();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (loading) {
    return <p className="text-center text-gray-400 py-8">Loading...</p>;
  }

  if (words.length === 0) {
    return (
      <EmptyState
        title="No words saved"
        message="Go to Add tab to start building your vocabulary!"
      />
    );
  }

  const filtered = search
    ? words.filter((w) => w.word.includes(search.toLowerCase()))
    : words;

  const sorted = [...filtered].sort((a, b) => a.word.localeCompare(b.word));

  const handleDelete = (word: string) => {
    if (confirmDelete === word) {
      removeWord(word);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(word);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-600">
          All Words ({words.length})
        </h2>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search words..."
        className="w-full px-3 py-1.5 mb-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      <div className="overflow-y-auto max-h-[340px]">
        {sorted.map((word) => (
          <div key={word.word}>
            <WordListItem word={word} onDelete={handleDelete} />
            {confirmDelete === word.word && (
              <p className="text-xs text-red-400 px-1 pb-1">
                Click delete again to confirm
              </p>
            )}
          </div>
        ))}
        {sorted.length === 0 && search && (
          <p className="text-sm text-gray-400 text-center py-4">
            No words match "{search}"
          </p>
        )}
      </div>
    </div>
  );
}
