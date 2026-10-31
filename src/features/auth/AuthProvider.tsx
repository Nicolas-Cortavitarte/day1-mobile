import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';
import { Linking } from 'react-native';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  completePasswordReset: (newPassword: string) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useSession() {
  const value = use(AuthContext);
  if (!value) throw new Error('useSession debe usarse dentro de <AuthProvider />');
  return value;
}

function parseRecoveryParams(url: string) {
  try {
    const hashIndex = url.indexOf('#');
    if (hashIndex === -1) return null;

    const fragment = url.slice(hashIndex + 1);
    const params = new URLSearchParams(fragment);

    return {
      type: params.get('type'),
      accessToken: params.get('access_token'),
      refreshToken: params.get('refresh_token'),
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function handleUrl(url: string | null | undefined) {
      if (!url) return;
      const parsed = parseRecoveryParams(url);
      if (parsed?.type === 'recovery' && parsed.accessToken && parsed.refreshToken) {
        setIsPasswordRecovery(true);
        await supabase.auth.setSession({
          access_token: parsed.accessToken,
          refresh_token: parsed.refreshToken,
        });
      }
    }

    Linking.getInitialURL().then(handleUrl);

    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    return () => subscription.remove();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signUp(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    if (error) {
      return { error: error.message, needsEmailConfirmation: false };
    }

    return { error: null, needsEmailConfirmation: !data.session };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function requestPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'day1://reset-password',
    });
    return { error: error?.message ?? null };
  }

  async function completePasswordReset(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      setIsPasswordRecovery(false);
    }
    return { error: error?.message ?? null };
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isPasswordRecovery,
        signIn,
        signUp,
        signOut,
        requestPasswordReset,
        completePasswordReset,
      }}>
      {children}
    </AuthContext.Provider>
  );
}