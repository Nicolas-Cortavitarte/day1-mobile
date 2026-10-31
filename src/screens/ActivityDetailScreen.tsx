import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityDetail'>;

export function ActivityDetailScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { activity } = route.params;
  const isCompleted = !!activity.completedAt;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Day1Button label="Volver" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">{activity.title}</Day1Text>

        <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
          {isCompleted ? 'Completada ✅' : 'Pendiente'}
        </Day1Text>

        <View style={styles.row}>
          <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
            Fecha
          </Day1Text>
          <Day1Text variant="bodyRegular16">{activity.scheduledDate}</Day1Text>
        </View>

        {activity.startTime ? (
          <View style={styles.row}>
            <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
              Hora
            </Day1Text>
            <Day1Text variant="bodyRegular16">{activity.startTime.slice(0, 5)}</Day1Text>
          </View>
        ) : null}

        {activity.durationMinutes ? (
          <View style={styles.row}>
            <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
              Duración
            </Day1Text>
            <Day1Text variant="bodyRegular16">{activity.durationMinutes} min</Day1Text>
          </View>
        ) : null}

        {activity.description ? (
          <View style={styles.row}>
            <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
              Descripción
            </Day1Text>
            <Day1Text variant="bodyRegular16">{activity.description}</Day1Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, padding: Spacing[16], gap: Spacing[16] },
  header: { flexDirection: 'row' },
  row: { gap: 4 },
});