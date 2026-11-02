import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';
import type { ProfileUpdate, UserProfile } from './types';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProfile(await api.get<UserProfile>('/me'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el perfil.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateProfile(changes: ProfileUpdate) {
    const updated = await api.patch<UserProfile>('/me', changes);
    setProfile(updated);
    return updated;
  }

  return { profile, isLoading, error, reload: load, updateProfile };
}