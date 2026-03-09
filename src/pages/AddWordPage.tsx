import { useState } from 'react';
import { useWords } from '../hooks/useWords';

export default function AddWordPage() {
  const { addWord } = useWords();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a word');
      return;
    }

    try {
      await addWord(trimmed);
      setSuccess(`"${trimmed}" added!`);
      setInput('');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-600 mb-4">
        Add New Word
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            placeholder="Enter an English word..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
            autoFocus
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {success && <p className="text-xs text-green-500">{success}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Add Word
        </button>
      </form>

      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500">
          <strong>Tip:</strong> Add words you encounter while reading or
          browsing. The spaced repetition algorithm will help you memorize them
          efficiently.
        </p>
      </div>
    </div>
  );
}
