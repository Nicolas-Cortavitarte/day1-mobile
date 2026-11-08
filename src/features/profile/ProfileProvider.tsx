import { createContext, use, useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useSession } from '@/features/auth/AuthProvider';
import type { ProfileUpdate, UserProfile } from './types';

type ProfileContextValue = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  updateProfile: (changes: ProfileUpdate) => Promise<UserProfile>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function useProfileContext() {
  const value = use(ProfileContext);
  if (!value) throw new Error('useProfile debe usarse dentro de <ProfileProvider />');
  return value;
}

export function ProfileProvider({ children }: PropsWithChildren) {
  const { session } = useSession();
  const userId = session?.user.id ?? null;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;

    if (!userId) {
      setProfile(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<UserProfile>('/me');
      if (currentRequest === requestId.current) setProfile(data);
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(getErrorMessage(err, 'No se pudo cargar el perfil.'));
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateProfile = useCallback(async (changes: ProfileUpdate) => {
    const updated = await api.patch<UserProfile>('/me', changes);
    setProfile(updated);
    return updated;
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, reload: load, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
