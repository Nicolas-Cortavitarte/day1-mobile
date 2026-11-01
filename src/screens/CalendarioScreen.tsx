import { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1DaySwitcher } from '@/components/molecules/Day1DaySwitcher';
import { Day1WeekStrip } from '@/components/molecules/Day1WeekStrip';
import { Day1MonthCalendar } from '@/components/molecules/Day1MonthCalendar';
import { Day1ActivityList } from '@/components/organisms/Day1ActivityList';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { todayISODate } from '@/features/activities/dateUtils';
import { useActivitiesByDate } from '@/features/activities/useActivitiesByDate';
import type { MainTabScreenProps } from '@/app/navigation-types';

type CalendarMode = 'dia' | 'semana' | 'mes';

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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.header}>
        <Day1Text variant="heading26">Calendario</Day1Text>

        <View style={styles.modeRow}>
          <Day1Button label="Día" variant={mode === 'dia' ? 'primary' : 'ghost'} onPress={() => setMode('dia')} />
          <Day1Button label="Semana" variant={mode === 'semana' ? 'primary' : 'ghost'} onPress={() => setMode('semana')} />
          <Day1Button label="Mes" variant={mode === 'mes' ? 'primary' : 'ghost'} onPress={() => setMode('mes')} />
        </View>

        {mode === 'dia' && <Day1DaySwitcher date={selectedDate} onChangeDate={setSelectedDate} />}
        {mode === 'semana' && <Day1WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />}
        {mode === 'mes' && <Day1MonthCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />}
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
          <Day1Button label="Reintentar" variant="secondary" onPress={reload} />
        </View>
      ) : (
        <Day1ActivityList
          activities={activities}
          categories={categories}
          onPressActivity={(activity) => navigation.navigate('ActivityDetail', { activity })}
          onToggleComplete={toggleComplete}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={reload} tintColor={colors.actionPrimary} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: Spacing[16], paddingTop: Spacing[8], gap: Spacing[8] },
  modeRow: { flexDirection: 'row', gap: Spacing[8] },
  errorBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing[12], padding: Spacing[16] },
});