import { createContext, use, useCallback, useEffect, useState, type PropsWithChildren } from 'react';

import { api } from '@/lib/api';
import { useSession } from '@/features/auth/AuthProvider';
import type { PreferencesUpdate, UserPreferences } from './types';

type PreferencesContextValue = {
  preferences: UserPreferences | null;
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
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session) {
      setPreferences(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      setPreferences(await api.get<UserPreferences>('/me/preferences'));
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
  }

  return (
    <PreferencesContext.Provider value={{ preferences, isLoading, updatePreferences, reload: load }}>
      {children}
    </PreferencesContext.Provider>
  );
}