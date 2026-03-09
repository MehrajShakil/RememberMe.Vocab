import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import * as storage from '../utils/storage';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.getSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });

    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area === 'sync' && changes.settings) {
        setSettings((changes.settings.newValue as Settings | undefined) ?? DEFAULT_SETTINGS);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const updateSettings = useCallback(async (newSettings: Settings) => {
    await storage.saveSettings(newSettings);
    setSettings(newSettings);
  }, []);

  return { settings, loading, updateSettings };
}
