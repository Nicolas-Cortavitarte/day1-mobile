import { createContext, use, useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import { Linking } from 'react-native';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { translateAuthError } from './authErrors';
import { normalizeEmail } from './validation';

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  justSignedIn: boolean;
  clearJustSignedIn: () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  completePasswordReset: (newPassword: string) => Promise<{ error: string | null }>;
  cancelPasswordRecovery: () => Promise<void>;
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
  const [justSignedIn, setJustSignedIn] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setSession(data.session);
      })
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setJustSignedIn(false);
        setIsPasswordRecovery(false);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function handleUrl(url: string | null | undefined) {
      if (!url) return;
      const parsed = parseRecoveryParams(url);
      if (parsed?.type !== 'recovery' || !parsed.accessToken || !parsed.refreshToken) return;

      setIsPasswordRecovery(true);
      try {
        const { error } = await supabase.auth.setSession({
          access_token: parsed.accessToken,
          refresh_token: parsed.refreshToken,
        });
        if (error) setIsPasswordRecovery(false);
      } catch {
        setIsPasswordRecovery(false);
      }
    }

    Linking.getInitialURL().then(handleUrl).catch(() => { });

    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    return () => subscription.remove();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email: normalizeEmail(email), password });
    if (error) return { error: translateAuthError(error) };
    setJustSignedIn(true);
    return { error: null };
  }

  const clearJustSignedIn = useCallback(() => {
    setJustSignedIn(false);
  }, []);

  async function signUp(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
      email: normalizeEmail(email),
      password,
      options: { data: { display_name: displayName.trim() } },
    });

    if (error) {
      return { error: translateAuthError(error), needsEmailConfirmation: false };
    }

    return { error: null, needsEmailConfirmation: !data.session };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function requestPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(email), {
      redirectTo: 'day1://reset-password',
    });
    return { error: error ? translateAuthError(error) : null };
  }

  async function completePasswordReset(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: translateAuthError(error) };
    setIsPasswordRecovery(false);
    return { error: null };
  }

  async function cancelPasswordRecovery() {
    setIsPasswordRecovery(false);
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isPasswordRecovery,
        justSignedIn,
        clearJustSignedIn,
        signIn,
        signUp,
        signOut,
        requestPasswordReset,
        completePasswordReset,
        cancelPasswordRecovery,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
