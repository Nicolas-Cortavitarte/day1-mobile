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
  const metadata = session?.user.user_metadata as
    | { full_name?: string; name?: string; display_name?: string; avatar_url?: string; picture?: string }
    | undefined;
  const metadataName = metadata?.display_name ?? metadata?.full_name ?? metadata?.name ?? null;
  const metadataAvatar = metadata?.avatar_url ?? metadata?.picture ?? null;

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
      if (currentRequest !== requestId.current) return;

      const patch: ProfileUpdate = {};
      if (!data.displayName && metadataName?.trim()) {
        patch.displayName = metadataName.trim();
      }
      if (!data.avatarUrl && metadataAvatar?.trim()) {
        patch.avatarUrl = metadataAvatar.trim();
      }

      if (Object.keys(patch).length > 0) {
        try {
          const synced = await api.patch<UserProfile>('/me', patch);
          if (currentRequest === requestId.current) setProfile(synced);
          return;
        } catch {
          setProfile(data);
          return;
        }
      }

      setProfile(data);
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(getErrorMessage(err, 'No se pudo cargar el perfil.'));
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, [userId, metadataName, metadataAvatar]);

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
