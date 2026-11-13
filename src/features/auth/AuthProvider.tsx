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
  oauthError: string | null;
  clearJustSignedIn: () => void;
  clearOAuthError: () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
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

function parseUrlParams(url: string) {
  try {
    const queryStart = url.indexOf('?');
    const hashStart = url.indexOf('#');
    const queryEnd = hashStart === -1 ? url.length : hashStart;
    const query = queryStart !== -1 && queryStart < queryEnd ? url.slice(queryStart + 1, queryEnd) : '';
    const fragment = hashStart !== -1 ? url.slice(hashStart + 1) : '';

    const queryParams = new URLSearchParams(query);
    const hashParams = new URLSearchParams(fragment);

    const getParam = (key: string) => queryParams.get(key) ?? hashParams.get(key);

    return {
      type: getParam('type'),
      code: getParam('code'),
      accessToken: getParam('access_token'),
      refreshToken: getParam('refresh_token'),
      errorDescription: getParam('error_description') ?? getParam('error'),
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
  const [oauthError, setOAuthError] = useState<string | null>(null);

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
      const parsed = parseUrlParams(url);
      if (!parsed) return;

      if (parsed.type === 'recovery' && parsed.accessToken && parsed.refreshToken) {
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
        return;
      }

      if (!url.includes('auth/callback')) return;

      if (parsed.errorDescription) {
        setOAuthError(decodeURIComponent(parsed.errorDescription.replace(/\+/g, ' ')));
        return;
      }

      if (parsed.code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(parsed.code);
          if (error) {
            setOAuthError(translateAuthError(error));
          } else {
            setOAuthError(null);
            setJustSignedIn(true);
          }
        } catch {
          setOAuthError('No se pudo completar el inicio de sesión con Google.');
        }
        return;
      }

      if (parsed.accessToken && parsed.refreshToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: parsed.accessToken,
            refresh_token: parsed.refreshToken,
          });
          if (error) {
            setOAuthError(translateAuthError(error));
          } else {
            setOAuthError(null);
            setJustSignedIn(true);
          }
        } catch {
          setOAuthError('No se pudo completar el inicio de sesión con Google.');
        }
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

  async function signInWithGoogle() {
    setOAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'day1://auth/callback',
          skipBrowserRedirect: true,
        },
      });
      if (error) return { error: translateAuthError(error) };
      if (!data?.url) return { error: 'No se pudo iniciar el acceso con Google.' };
      await Linking.openURL(data.url);
      return { error: null };
    } catch {
      return { error: 'No se pudo abrir el navegador para iniciar sesión con Google.' };
    }
  }

  const clearJustSignedIn = useCallback(() => {
    setJustSignedIn(false);
  }, []);

  const clearOAuthError = useCallback(() => {
    setOAuthError(null);
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
        oauthError,
        clearJustSignedIn,
        clearOAuthError,
        signIn,
        signInWithGoogle,
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
