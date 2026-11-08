import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import { Day1Icon } from '../atoms/Day1Icon';
import { Day1Text } from '../atoms/Day1Text';

type Day1InlineNoticeProps = {
  message: string;
  title?: string;

  compact?: boolean;
};

export function Day1InlineNotice({ message, title, compact }: Day1InlineNoticeProps) {
  const colors = useTheme();

  if (compact) {
    return (
      <View style={styles.compactRow} accessibilityRole="alert">
        <Day1Icon name="alert" size={16} color={colors.statusError} />
        <Day1Text variant="labelRegular13" color={colors.statusError} style={styles.compactText}>
          {message}
        </Day1Text>
      </View>
    );
  }

  return (
    <View
      accessibilityRole="alert"
      style={[styles.card, { backgroundColor: colors.surfaceErrorSoft, borderColor: colors.statusError }]}>
      <Day1Icon name="alert" size={20} color={colors.statusError} />
      <View style={styles.texts}>
        {title ? (
          <Day1Text variant="labelSemiBold14" color={colors.statusError}>
            {title}
          </Day1Text>
        ) : null}
        <Day1Text variant="labelRegular13" color={colors.statusError}>
          {message}
        </Day1Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing[10],
    padding: Spacing[12],
    borderRadius: Radius[14],
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  texts: { flex: 1, gap: 2 },
  compactRow: { flexDirection: 'row', gap: Spacing[6], alignItems: 'flex-start' },
  compactText: { flex: 1 },
});
