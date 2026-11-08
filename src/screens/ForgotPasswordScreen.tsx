import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1IconBadge } from '@/components/atoms/Day1IconBadge';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/AuthProvider';
import { isValidEmail } from '@/features/auth/validation';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const colors = useTheme();
  const { requestPasswordReset } = useSession();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    if (loading) return;
    if (!isValidEmail(email)) {
      setError('Escribe un correo electrónico válido.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: requestError } = await requestPasswordReset(email);
    setLoading(false);

    if (requestError) {
      setError(requestError);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Day1Text variant="heading28">Revisa tu correo</Day1Text>
            <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
              Te acompañamos en el siguiente paso.
            </Day1Text>
          </View>

          <Day1IconBadge glyph="✉️" />

          <View style={[styles.card, { backgroundColor: colors.surfaceCard }]}>
            <Day1Text variant="section20">Enlace enviado</Day1Text>
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
              Si existe una cuenta con {email.trim()}, recibirás un enlace para restablecer tu contraseña.
            </Day1Text>
          </View>

          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
            El enlace caduca en 30 minutos. Si no lo ves, revisa la carpeta de correo no deseado.
          </Day1Text>

          {error ? (
            <Day1Text variant="labelRegular14" color={colors.statusError}>
              {error}
            </Day1Text>
          ) : null}

          <Day1Button
            label="Volver a iniciar sesión"
            variant="primary"
            onPress={() => navigation.replace('SignIn')}
          />

          <Day1Button
            label={loading ? 'Reenviando...' : 'Reenviar correo'}
            variant="ghost"
            onPress={handleRequest}
            disabled={loading}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Day1Text variant="heading28">Volvamos a entrar</Day1Text>
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
            A veces solo hace falta empezar de nuevo.
          </Day1Text>
        </View>

        <Day1IconBadge glyph="🔑" />

        <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
          Escribe el correo de tu cuenta. Te enviaremos un enlace seguro para crear una nueva contraseña.
        </Day1Text>

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

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
        ) : null}

        <Day1Button
          label={loading ? 'Enviando...' : 'Enviar enlace'}
          variant="primary"
          onPress={handleRequest}
          disabled={loading || !email}
        />

        <Day1Button
          label="Volver a iniciar sesión"
          variant="ghost"
          onPress={() => navigation.replace('SignIn')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing[24], gap: Spacing[20] },
  header: { gap: Spacing[12] },
  card: { gap: Spacing[12], padding: Spacing[16], borderRadius: Radius[20] },
});
