import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/AuthProvider';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const colors = useTheme();
  const { signUp } = useSession();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    setNotice(null);

    const { error, needsEmailConfirmation } = await signUp(email, password, displayName);
    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    if (needsEmailConfirmation) {
      setNotice('Te enviamos un correo de confirmación. Revísalo para activar tu cuenta.');
      return;
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content}>
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
            placeholder="Alex"
          />

          <Day1TextField
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="alex@correo.com"
          />

          <Day1TextField
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="••••••••••••"
            helperText="Al menos 8 caracteres, una letra y un número."
          />
        </View>

        <Day1Text variant="labelRegular13" color={colors.textSecondaryReadable}>
          Al crear tu cuenta, aceptas los Términos de uso y la Política de privacidad. Tus planes son privados.
        </Day1Text>

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
        ) : null}

        {notice ? (
          <Day1Text variant="labelRegular14" color={colors.statusSuccess}>
            {notice}
          </Day1Text>
        ) : null}

        <Day1Button
          label={loading ? 'Creando cuenta...' : 'Crear cuenta'}
          variant="primary"
          onPress={handleSignUp}
          disabled={loading || !email || !password || !displayName}
        />

        <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable} style={styles.centerText}>
          ¿Ya tienes cuenta?
        </Day1Text>

        <Day1Button
          label="Iniciar sesión"
          variant="ghost"
          onPress={() => navigation.replace('SignIn')}
        />

        <View style={styles.brandBlock}>
          <Day1Text variant="heading26" color={colors.actionPressed}>
            Day1
          </Day1Text>
          <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable} style={styles.centerText}>
            Tu progreso empieza contigo.
          </Day1Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing[24], gap: Spacing[20] },
  header: { gap: Spacing[12] },
  form: { gap: Spacing[20] },
  centerText: { textAlign: 'center' },
  brandBlock: { gap: Spacing[12], alignItems: 'center', paddingTop: Spacing[16] },
});