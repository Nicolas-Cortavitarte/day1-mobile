import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Icon } from '@/components/atoms/Day1Icon';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/AuthProvider';
import { isValidEmail } from '@/features/auth/validation';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const colors = useTheme();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (loading) return;
    if (!isValidEmail(email)) {
      setError('Escribe un correo electrónico válido.');
      return;
    }

    setLoading(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) setError(signInError);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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
          <Day1Text variant="heading28">Qué bueno verte.</Day1Text>
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
            Tus planes y tus pequeños pasos te esperan.
          </Day1Text>
        </View>

        <View style={styles.brand}>
          <Day1Icon name="sprout" size={38} color={colors.actionPrimary} strokeWidth={2.2} />
          <Day1Text variant="display46" color={colors.actionPressed}>
            Day1
          </Day1Text>
        </View>

        <View style={styles.fields}>
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
            textContentType="password"
            autoComplete="current-password"
            placeholder="••••••••••••"
            returnKeyType="go"
            onSubmitEditing={handleSignIn}
          />
        </View>

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
        ) : null}

        <Day1Text
          variant="labelSemiBold14"
          color={colors.actionPressed}
          style={styles.forgotLink}
          onPress={() => navigation.navigate('ForgotPassword')}>
          ¿Olvidaste tu contraseña?
        </Day1Text>

        <Day1Button
          label={loading ? 'Entrando...' : 'Iniciar sesión'}
          variant="primary"
          onPress={handleSignIn}
          disabled={loading || !email || !password}
        />

        <View style={styles.signUpBlock}>
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable} style={styles.centerText}>
            ¿Es tu primer día aquí?
          </Day1Text>
          <Day1Button
            label="Crear mi cuenta"
            variant="secondary"
            onPress={() => navigation.replace('SignUp')}
          />
        </View>

        <Day1Text variant="labelRegular13" color={colors.textSecondaryReadable} style={styles.centerText}>
          One day or day one.
        </Day1Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing[24], gap: Spacing[24] },
  backRow: { alignItems: 'flex-start' },
  header: { gap: Spacing[12] },
  brand: { flexDirection: 'row', alignItems: 'center', gap: Spacing[10], minHeight: 72 },
  fields: { gap: Spacing[20] },
  forgotLink: { textAlign: 'right' },
  signUpBlock: { gap: Spacing[8] },
  centerText: { textAlign: 'center' },
});
