import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Day1Text } from '../atoms/Day1Text';

type Day1FormFieldProps = {
  label: string;
  helperText?: string;
  focused?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Day1FormField({ label, helperText, focused, children, style }: Day1FormFieldProps) {
  const colors = useTheme();
  return (
    <View style={[styles.field, style]}>
      <Day1Text
        variant="labelMedium14"
        color={focused ? colors.actionPressed : colors.textPrimary}>
        {label}
      </Day1Text>
      {children}
      {helperText ? (
        <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
          {helperText}
        </Day1Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6, width: '100%' },
});
