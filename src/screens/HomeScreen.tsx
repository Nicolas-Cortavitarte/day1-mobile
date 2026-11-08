import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { ANIMATIONS } from '@/assets/animations';
import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1FloatingActionButton } from '@/components/atoms/Day1FloatingActionButton';
import { Day1Lottie } from '@/components/atoms/Day1Lottie';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1ActivityRow } from '@/components/molecules/Day1ActivityRow';
import { Day1DailyProgressSummary } from '@/components/molecules/Day1DailyProgressSummary';
import { Day1DateStrip } from '@/components/molecules/Day1DateStrip';
import { Radius, Spacing } from '@/constants/theme';
import { fullDateLabel, todayISODate } from '@/features/activities/dateUtils';
import { useTodayActivities } from '@/features/activities/useTodayActivities';
import { useSession } from '@/features/auth/AuthProvider';
import { useProfile } from '@/features/profile/useProfile';
import { useTheme } from '@/hooks/use-theme';
import type { MainTabScreenProps } from '@/app/navigation-types';

type Props = MainTabScreenProps<'Hoy'>;

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function HomeScreen({ navigation }: Props) {
  const colors = useTheme();
  const { profile } = useProfile();
  const { justSignedIn, clearJustSignedIn } = useSession();
  const [showWelcomeBanner] = useState(justSignedIn);
  const [selectedDate, setSelectedDate] = useState(todayISODate());
  const { activities, categories, isLoading, error, reload, toggleComplete } = useTodayActivities(selectedDate);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  useEffect(() => {
    if (justSignedIn) clearJustSignedIn();
  }, [justSignedIn, clearJustSignedIn]);

  const scheduled = activities.filter((a) => a.startTime);
  const anytime = activities.filter((a) => !a.startTime);
  const completedCount = activities.filter((a) => a.completedAt).length;
  const firstName = profile?.displayName?.split(' ')[0] ?? '';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      {error ? (
        <View style={styles.errorBox}>
          <Day1Lottie source={ANIMATIONS.alert} size={72} />
          <Day1Text variant="labelRegular14" color={colors.statusError} style={styles.centerText}>
            {error}
          </Day1Text>
          <Day1Button label="Reintentar" variant="secondary" onPress={reload} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={reload} tintColor={colors.actionPrimary} />}>
          <View style={styles.greetingBlock}>
            <Day1Text variant="heading26">
              ¡{greeting()}{firstName ? `, ${firstName}` : ''}! 🌱
            </Day1Text>
            <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable} style={styles.capitalize}>
              {fullDateLabel(selectedDate)}
            </Day1Text>
          </View>

          {showWelcomeBanner ? (
            <View style={[styles.banner, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
              <View style={[styles.bannerCheck, { backgroundColor: colors.statusSuccess }]}>
                <Day1Text variant="labelSemiBold12" color={colors.textOnAction}>
                  ✓
                </Day1Text>
              </View>
              <View style={styles.bannerTexts}>
                <Day1Text variant="bodySemiBold16">¡Qué bueno tenerte de vuelta!</Day1Text>
                <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                  Has iniciado sesión. Tus planes están al día.
                </Day1Text>
              </View>
            </View>
          ) : null}

          <Day1DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

          {activities.length > 0 ? (
            <Day1DailyProgressSummary completed={completedCount} total={activities.length} />
          ) : !isLoading ? (
            <>
              <View style={[styles.emptyCard, { backgroundColor: colors.surfaceBrandSoft }]}>
                <Day1Text variant="bodySemiBold16" color={colors.actionPressed}>
                  Un día con espacio para ti.
                </Day1Text>
                <Day1Text variant="labelRegular14" color={colors.actionPressed}>
                  Organizarte o descansar: hoy tú eliges.
                </Day1Text>
              </View>

              <View style={styles.emptyState}>
                <Day1Lottie source={ANIMATIONS.emptyCalm} size={110} />
                <Day1Text variant="section20" style={styles.centerText}>
                  Hoy no hay actividades
                </Day1Text>
                <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable} style={styles.centerText}>
                  Puedes añadir un plan si lo necesitas. Descansar también está bien.
                </Day1Text>
                <Day1Button
                  label="+ Añadir actividad"
                  variant="primary"
                  onPress={() => navigation.navigate('CreateActivity')}
                  style={styles.emptyButton}
                />
              </View>
            </>
          ) : null}

          {scheduled.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Day1Text variant="section20">Con horario</Day1Text>
                <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
                  {scheduled.length} {scheduled.length === 1 ? 'actividad' : 'actividades'}
                </Day1Text>
              </View>
              {scheduled.map((activity) => (
                <Day1ActivityRow
                  key={activity.id}
                  activity={activity}
                  category={categories.find((c) => c.id === activity.categoryId)}
                  onPress={() => navigation.navigate('ActivityDetail', { activity })}
                  onToggleComplete={() => toggleComplete(activity)}
                />
              ))}
            </View>
          ) : null}

          {anytime.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Day1Text variant="section20">A tu ritmo</Day1Text>
                <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
                  {anytime.length} {anytime.length === 1 ? 'actividad' : 'actividades'}
                </Day1Text>
              </View>
              {anytime.map((activity) => (
                <Day1ActivityRow
                  key={activity.id}
                  activity={activity}
                  category={categories.find((c) => c.id === activity.categoryId)}
                  onPress={() => navigation.navigate('ActivityDetail', { activity })}
                  onToggleComplete={() => toggleComplete(activity)}
                />
              ))}
            </View>
          ) : null}
        </ScrollView>
      )}

      <Day1FloatingActionButton onPress={() => navigation.navigate('CreateActivity')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[20], paddingBottom: Spacing[64], gap: Spacing[12] },
  greetingBlock: { gap: Spacing[6] },
  capitalize: { textTransform: 'capitalize' },
  section: { gap: Spacing[10] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  banner: { flexDirection: 'row', gap: Spacing[12], padding: Spacing[12], borderRadius: Radius[14], borderWidth: 1 },
  bannerCheck: { width: 22, height: 22, borderRadius: Radius[12], alignItems: 'center', justifyContent: 'center' },
  bannerTexts: { flex: 1, gap: 2 },
  emptyCard: { gap: Spacing[4], padding: Spacing[16], borderRadius: Radius[20] },
  emptyState: { alignItems: 'center', gap: Spacing[12], paddingTop: Spacing[24], paddingHorizontal: Spacing[16] },
  emptyButton: { width: '100%', marginTop: Spacing[8] },
  centerText: { textAlign: 'center' },
  errorBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing[12], padding: Spacing[16] },
});
