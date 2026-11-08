import { createContext, use, useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useSession } from '@/features/auth/AuthProvider';
import type { PreferencesUpdate, ThemePreference, UserPreferences } from './types';

const CACHED_THEME_KEY = 'day1.cachedTheme';

type PreferencesContextValue = {
  preferences: UserPreferences | null;
  cachedTheme: ThemePreference | null;
  isLoading: boolean;
  error: string | null;
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
  const userId = session?.user.id ?? null;

  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [cachedTheme, setCachedTheme] = useState<ThemePreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    AsyncStorage.getItem(CACHED_THEME_KEY)
      .then((value) => {
        if (value === 'LIGHT' || value === 'DARK' || value === 'SYSTEM') {
          setCachedTheme(value);
        }
      })
      .catch(() => { });
  }, []);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;

    if (!userId) {
      setPreferences(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<UserPreferences>('/me/preferences');
      if (currentRequest !== requestId.current) return;
      setPreferences(data);
      setCachedTheme(data.theme);
      AsyncStorage.setItem(CACHED_THEME_KEY, data.theme).catch(() => { });
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(getErrorMessage(err, 'No se pudieron cargar tus preferencias.'));
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const updatePreferences = useCallback(async (changes: PreferencesUpdate) => {
    const updated = await api.patch<UserPreferences>('/me/preferences', changes);
    setPreferences(updated);
    setCachedTheme(updated.theme);
    AsyncStorage.setItem(CACHED_THEME_KEY, updated.theme).catch(() => { });
  }, []);

  return (
    <PreferencesContext.Provider
      value={{ preferences, cachedTheme, isLoading, error, updatePreferences, reload: load }}>
      {children}
    </PreferencesContext.Provider>
  );
}
