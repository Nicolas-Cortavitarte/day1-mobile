import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { Day1FloatingActionButton } from '@/components/atoms/Day1FloatingActionButton';
import { Day1Icon } from '@/components/atoms/Day1Icon';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1DailyProgressSummary } from '@/components/molecules/Day1DailyProgressSummary';
import { Day1DaySwitcher } from '@/components/molecules/Day1DaySwitcher';
import { Day1ErrorState } from '@/components/molecules/Day1ErrorState';
import { Day1MonthCalendar } from '@/components/molecules/Day1MonthCalendar';
import { Day1WeekStrip } from '@/components/molecules/Day1WeekStrip';
import { Day1ActivityList } from '@/components/organisms/Day1ActivityList';
import { Radius, Spacing } from '@/constants/theme';
import { isPastDate, longDateLabel, todayISODate } from '@/features/activities/dateUtils';
import { useActivitiesByDate } from '@/features/activities/useActivitiesByDate';
import { useTheme } from '@/hooks/use-theme';
import type { MainTabScreenProps } from '@/app/navigation-types';

type CalendarMode = 'dia' | 'semana' | 'mes';

const MODES: { key: CalendarMode; label: string }[] = [
  { key: 'dia', label: 'Día' },
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mes' },
];

export function CalendarioScreen({ navigation }: MainTabScreenProps<'Calendario'>) {
  const colors = useTheme();
  const [mode, setMode] = useState<CalendarMode>('semana');
  const [selectedDate, setSelectedDate] = useState(todayISODate());

  const { categories, activities, isLoading, error, reload, toggleComplete } =
    useActivitiesByDate(selectedDate);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const today = todayISODate();
  const isToday = selectedDate === today;
  const isPast = isPastDate(selectedDate);
  const completedCount = activities.filter((a) => !!a.completedAt).length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Day1Text variant="heading26">Calendario</Day1Text>
          {!isToday ? (
            <Pressable
              onPress={() => setSelectedDate(today)}
              accessibilityRole="button"
              accessibilityLabel="Volver a hoy"
              style={[styles.todayPill, { backgroundColor: colors.surfaceBrandSoft }]}>
              <Day1Icon name="calendar" size={14} color={colors.actionPressed} />
              <Day1Text variant="labelSemiBold12" color={colors.actionPressed}>
                Ir a hoy
              </Day1Text>
            </Pressable>
          ) : null}
        </View>

        <View style={[styles.segmentedBar, { backgroundColor: colors.surfaceSegmented }]}>
          {MODES.map((item) => {
            const active = mode === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setMode(item.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={[
                  styles.segmentButton,
                  active && { backgroundColor: colors.actionPrimary },
                ]}>
                <Day1Text
                  variant={active ? 'labelSemiBold14' : 'labelMedium14'}
                  color={active ? colors.textOnAction : colors.textSecondaryReadable}>
                  {item.label}
                </Day1Text>
              </Pressable>
            );
          })}
        </View>

        {mode === 'dia' && <Day1DaySwitcher date={selectedDate} onChangeDate={setSelectedDate} />}
        {mode === 'semana' && <Day1WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />}
        {mode === 'mes' && <Day1MonthCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />}
      </View>

      {error ? (
        <Day1ErrorState message={error} onRetry={reload} />
      ) : (
        <Day1ActivityList
          activities={activities}
          categories={categories}
          loading={isLoading}
          onPressActivity={(activity) => navigation.navigate('ActivityDetail', { activity })}
          onToggleComplete={toggleComplete}
          emptyActionLabel={!isPast ? 'Agendar actividad en esta fecha' : undefined}
          onEmptyActionPress={
            !isPast ? () => navigation.navigate('CreateActivity', { initialDate: selectedDate }) : undefined
          }
          listHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.dayBanner}>
                <Day1Text variant="bodySemiBold16" style={styles.capitalize}>
                  {longDateLabel(selectedDate)}
                </Day1Text>
                <Day1Text variant="labelRegular13" color={colors.textSecondaryReadable}>
                  {activities.length === 0
                    ? isPast
                      ? 'Fecha pasada sin registros'
                      : 'Sin planes agendados'
                    : `${completedCount}/${activities.length} completadas`}
                </Day1Text>
              </View>
              {activities.length > 0 ? (
                <Day1DailyProgressSummary completed={completedCount} total={activities.length} />
              ) : null}
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={reload} tintColor={colors.actionPrimary} />
          }
        />
      )}

      {!isPast ? (
        <Day1FloatingActionButton
          onPress={() => navigation.navigate('CreateActivity', { initialDate: selectedDate })}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: Spacing[20], paddingTop: Spacing[12], paddingBottom: Spacing[6], gap: Spacing[10] },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  todayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[6],
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[6],
    borderRadius: Radius[20],
  },
  segmentedBar: {
    flexDirection: 'row',
    borderRadius: Radius[14],
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: Spacing[8],
    borderRadius: Radius[12],
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    gap: Spacing[10],
    marginBottom: Spacing[4],
  },
  dayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[4],
  },
  capitalize: {
    textTransform: 'capitalize',
  },
});
