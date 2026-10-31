import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
      <View style={styles.content}>
        <Day1Text variant="heading28">Crea tu cuenta</Day1Text>
        <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
          Empieza a construir tu rutina con Day1.
        </Day1Text>

        <Day1TextField
          label="Nombre"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          placeholder="Tu nombre"
        />

        <Day1TextField
          label="Correo"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="tu@correo.com"
        />

        <Day1TextField
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Mínimo 6 caracteres"
        />

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

        <Day1Button
          label="Ya tengo cuenta"
          variant="ghost"
          onPress={() => navigation.replace('SignIn')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: Spacing[16], gap: Spacing[16] },
});