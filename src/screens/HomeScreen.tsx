import { useCallback } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1ActivityList } from '@/components/organisms/Day1ActivityList';
import { Spacing } from '@/constants/theme';
import { useTodayActivities } from '@/features/activities/useTodayActivities';
import { useSession } from '@/features/auth/AuthProvider';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const colors = useTheme();
  const { signOut } = useSession();
  const { activities, categories, isLoading, error, reload, toggleComplete } = useTodayActivities();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.header}>
        <Day1Text variant="heading26">Hoy</Day1Text>
        <View style={styles.headerActions}>
          <Day1Button label="+ Nueva" variant="secondary" onPress={() => navigation.navigate('CreateActivity')} />
          <Day1Button label="Cerrar sesión" variant="ghost" onPress={signOut} />
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[16],
    paddingTop: Spacing[8],
  },
  headerActions: { flexDirection: 'row', gap: Spacing[8] },
  errorBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing[12], padding: Spacing[16] },
});