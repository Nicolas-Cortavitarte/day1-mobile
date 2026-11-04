import { createContext, use, useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { api } from '@/lib/api';
import { useSession } from '@/features/auth/AuthProvider';
import type { PreferencesUpdate, ThemePreference, UserPreferences } from './types';

const CACHED_THEME_KEY = 'day1.cachedTheme';

type PreferencesContextValue = {
  preferences: UserPreferences | null;
  cachedTheme: ThemePreference | null;
  isLoading: boolean;
  updatePreferences: (changes: PreferencesUpdate) => Promise<void>;
  reload: () => Promise<void>;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function usePreferencesContext() {
  const value = use(PreferencesContext);
  if (!value) throw new Error('usePreferencesContext debe usarse dentro de <PreferencesProvider />');
  return value;
}

export function PreferencesProvider({ children }: PropsWithChildren) {
  const { session } = useSession();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [cachedTheme, setCachedTheme] = useState<ThemePreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CACHED_THEME_KEY).then((value) => {
      if (value === 'LIGHT' || value === 'DARK' || value === 'SYSTEM') {
        setCachedTheme(value);
      }
    });
  }, []);

  const load = useCallback(async () => {
    if (!session) {
      setPreferences(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.get<UserPreferences>('/me/preferences');
      setPreferences(data);
      setCachedTheme(data.theme);
      AsyncStorage.setItem(CACHED_THEME_KEY, data.theme).catch(() => {});
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    load();
  }, [load]);

  async function updatePreferences(changes: PreferencesUpdate) {
    const updated = await api.patch<UserPreferences>('/me/preferences', changes);
    setPreferences(updated);
    setCachedTheme(updated.theme);
    AsyncStorage.setItem(CACHED_THEME_KEY, updated.theme).catch(() => {});
  }

  return (
    <PreferencesContext.Provider value={{ preferences, cachedTheme, isLoading, updatePreferences, reload: load }}>
      {children}
    </PreferencesContext.Provider>
  );
}