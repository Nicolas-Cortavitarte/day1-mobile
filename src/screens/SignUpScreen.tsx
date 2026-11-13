import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1KeyboardScrollView } from '@/components/atoms/Day1KeyboardScrollView';
import { Day1Logo } from '@/components/atoms/Day1Logo';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/AuthProvider';
import { isValidEmail, PASSWORD_HELPER_TEXT, validatePassword } from '@/features/auth/validation';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const colors = useTheme();
  const { signUp, signInWithGoogle, oauthError, clearOAuthError } = useSession();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const visibleError = error ?? oauthError;

  async function handleSignUp() {
    if (loading || loadingGoogle) return;
    clearOAuthError();
    setError(null);
    setNotice(null);

    if (!displayName.trim()) {
      setError('Cuéntanos tu nombre o apodo.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Escribe un correo electrónico válido.');
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(`Contraseña inválida. ${passwordError}`);
      return;
    }

    setLoading(true);
    const { error: signUpError, needsEmailConfirmation } = await signUp(email, password, displayName);
    setLoading(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    if (needsEmailConfirmation) {
      setNotice('Te enviamos un correo de confirmación. Revísalo para activar tu cuenta.');
    }
  }

  async function handleGoogleSignIn() {
    if (loading || loadingGoogle) return;
    clearOAuthError();
    setError(null);
    setNotice(null);
    setLoadingGoogle(true);
    const { error: googleError } = await signInWithGoogle();
    setLoadingGoogle(false);
    if (googleError) setError(googleError);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <Day1KeyboardScrollView contentContainerStyle={styles.content}>
        {navigation.canGoBack() ? (
          <View style={styles.backRow}>
            <Day1Button
              label="Volver"
              icon="arrowLeft"
              variant="ghost"
              onPress={() => navigation.goBack()}
            />
          </View>
        ) : null}

        <View style={styles.header}>
          <Day1Text variant="heading28">Tu día uno.</Day1Text>
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
            Crea tu cuenta y empieza a tu manera.
          </Day1Text>
        </View>

        <View style={styles.form}>
          <Day1TextField
            label="Nombre o apodo"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            maxLength={80}
            textContentType="name"
            placeholder="Alex"
          />

          <Day1TextField
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            placeholder="alex@correo.com"
          />

          <Day1TextField
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            textContentType="newPassword"
            autoComplete="new-password"
            placeholder="••••••••••••"
            helperText={PASSWORD_HELPER_TEXT}
          />
        </View>

        <Day1Text variant="labelRegular13" color={colors.textSecondaryReadable}>
          Al crear tu cuenta, aceptas los Términos de uso y la Política de privacidad. Tus planes son privados.
        </Day1Text>

        {visibleError ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {visibleError}
          </Day1Text>
        ) : null}

        {notice ? (
          <Day1Text variant="labelRegular14" color={colors.statusSuccess}>
            {notice}
          </Day1Text>
        ) : null}

        <View style={styles.authActions}>
          <Day1Button
            label={loading ? 'Creando cuenta...' : 'Crear cuenta'}
            variant="primary"
            onPress={handleSignUp}
            disabled={loading || loadingGoogle || !email || !password || !displayName.trim()}
          />

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.borderSubtle }]} />
            <Day1Text variant="labelRegular13" color={colors.textSecondaryReadable}>
              o
            </Day1Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.borderSubtle }]} />
          </View>

          <Day1Button
            label={loadingGoogle ? 'Abriendo Google...' : 'Continuar con Google'}
            variant="secondary"
            onPress={handleGoogleSignIn}
            disabled={loading || loadingGoogle}
          />
        </View>

        <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable} style={styles.centerText}>
          ¿Ya tienes cuenta?
        </Day1Text>

        <Day1Button
          label="Iniciar sesión"
          variant="ghost"
          onPress={() => navigation.replace('SignIn')}
        />

        <View style={styles.brandBlock}>
          <View style={styles.brandRow}>
            <Day1Logo size={32} />
            <Day1Text variant="heading26" color={colors.actionPressed}>
              Day1
            </Day1Text>
          </View>
          <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable} style={styles.centerText}>
            Tu progreso empieza contigo.
          </Day1Text>
        </View>
      </Day1KeyboardScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing[24], gap: Spacing[20] },
  backRow: { alignItems: 'flex-start' },
  header: { gap: Spacing[12] },
  form: { gap: Spacing[20] },
  authActions: { gap: Spacing[12] },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[12] },
  dividerLine: { flex: 1, height: 1 },
  centerText: { textAlign: 'center' },
  brandBlock: { gap: Spacing[12], alignItems: 'center', paddingTop: Spacing[16] },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[8] },
});
