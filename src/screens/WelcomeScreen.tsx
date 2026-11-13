import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Icon } from '@/components/atoms/Day1Icon';
import { Day1Logo } from '@/components/atoms/Day1Logo';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Radius, ShadowColor, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const colors = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandHeader}>
          <Day1Logo size={32} />
          <Day1Text variant="section24" color={colors.actionPressed}>
            Day1
          </Day1Text>
        </View>

        <View style={styles.heroWrapper}>
          <View style={[styles.heroCircle, { backgroundColor: colors.surfaceBrandSoft }]}>
            <View style={styles.barsRow}>
              <View style={[styles.bar, styles.barStep1, { backgroundColor: colors.illustrationSoft }]} />
              <View style={[styles.bar, styles.barStep2, { backgroundColor: colors.illustrationMedium }]} />
              <View style={[styles.bar, styles.barStep3, { backgroundColor: colors.actionPrimary }]} />
            </View>

            <View
              style={[
                styles.floatingCard,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.borderSubtle,
                },
              ]}>
              <View style={styles.cardHeaderRow}>
                <Day1Icon name="sprout" size={16} color={colors.actionPrimary} strokeWidth={2} />
                <Day1Text variant="labelSemiBold14">Hoy elijo empezar</Day1Text>
              </View>
              <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
                Un pequeño paso. A mi manera.
              </Day1Text>
            </View>

            <View
              style={[
                styles.checkBadge,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.borderSubtle,
                },
              ]}>
              <Day1Icon name="check" size={16} color={colors.actionPrimary} strokeWidth={2.5} />
            </View>
          </View>
        </View>

        <View style={styles.copySection}>
          <Day1Text variant="heading28">Tu primer día empieza aquí.</Day1Text>
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Organiza tus planes, construye hábitos y descubre cuánto has avanzado.
          </Day1Text>
        </View>

        <View style={styles.actionsSection}>
          <Day1Button
            label="Crear mi cuenta"
            variant="primary"
            onPress={() => navigation.navigate('SignUp')}
          />
          <Day1Button
            label="Ya tengo una cuenta"
            variant="secondary"
            onPress={() => navigation.navigate('SignIn')}
          />
        </View>

        <Day1Text variant="labelRegular13" color={colors.textSecondaryReadable} style={styles.footerText}>
          One day or day one.
        </Day1Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[24],
    paddingTop: Spacing[16],
    paddingBottom: Spacing[24],
    gap: Spacing[24],
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[8],
  },
  heroWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[8],
  },
  heroCircle: {
    width: 248,
    height: 248,
    borderRadius: 124,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Spacing[24],
    position: 'relative',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing[12],
  },
  bar: {
    width: 56,
    borderRadius: Radius[12],
  },
  barStep1: {
    height: 36,
  },
  barStep2: {
    height: 76,
  },
  barStep3: {
    height: 118,
  },
  floatingCard: {
    position: 'absolute',
    top: 44,
    left: -8,
    width: 192,
    borderRadius: Radius[16],
    borderWidth: 1,
    paddingHorizontal: Spacing[14],
    paddingVertical: Spacing[12],
    gap: Spacing[6],
    shadowColor: ShadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[6],
  },
  checkBadge: {
    position: 'absolute',
    top: 52,
    right: 26,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ShadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  copySection: {
    gap: Spacing[10],
  },
  actionsSection: {
    gap: Spacing[12],
  },
  footerText: {
    textAlign: 'center',
  },
});
