import { useState, useEffect } from 'react';
import type { DictionaryEntry } from '../types';
import { fetchDefinition } from '../utils/dictionary';

export function useDictionary(word: string | null) {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!word) {
      setEntry(null);
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchDefinition(word).then((result) => {
      if (cancelled) return;
      setEntry(result);
      setLoading(false);
      if (!result) setError(true);
    });

    return () => {
      cancelled = true;
    };
  }, [word]);

  return { entry, loading, error };
}
