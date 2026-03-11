import { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';

const LANGUAGES = [
  { code: 'auto', label: 'Auto-detect' },
  { code: 'bn', label: 'Bengali' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'nl', label: 'Dutch' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'hi', label: 'Hindi' },
  { code: 'id', label: 'Indonesian' },
  { code: 'it', label: 'Italian' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'ms', label: 'Malay' },
  { code: 'fa', label: 'Persian' },
  { code: 'pl', label: 'Polish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' },
  { code: 'es', label: 'Spanish' },
  { code: 'tr', label: 'Turkish' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'ur', label: 'Urdu' },
  { code: 'vi', label: 'Vietnamese' },
];

export default function SettingsPage() {
  const { settings, loading, updateSettings } = useSettings();
  const [count, setCount] = useState(settings.dailyWordCount);
  const [lang, setLang] = useState(settings.targetLanguage);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCount(settings.dailyWordCount);
    setLang(settings.targetLanguage);
  }, [settings.dailyWordCount, settings.targetLanguage]);

  const handleSave = async () => {
    const clamped = Math.min(50, Math.max(1, count));
    await updateSettings({ ...settings, dailyWordCount: clamped, targetLanguage: lang });
    setCount(clamped);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return <p className="text-center text-gray-400 py-8">Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-600 mb-4">Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Daily word count
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <span className="text-xs text-gray-400">words per day (1-50)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Translation language
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Save
        </button>

        {saved && (
          <p className="text-xs text-green-500">Settings saved!</p>
        )}
      </div>

      <div className="mt-8 p-3 bg-gray-50 rounded-lg space-y-2">
        <p className="text-xs text-gray-500">
          <strong>How it works:</strong> RememberMe Vocab uses the SM-2 spaced
          repetition algorithm. Words you find difficult will appear more often,
          while easy words are shown less frequently.
        </p>
        <p className="text-xs text-gray-400">
          Data syncs across your Chrome browsers via your Google account.
        </p>
      </div>
    </div>
  );
}
