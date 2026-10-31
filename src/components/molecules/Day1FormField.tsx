import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Day1Text } from '../atoms/Day1Text';

type Day1FormFieldProps = {
  label: string;
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Day1FormField({ label, children, style }: Day1FormFieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Day1Text variant="labelMedium14">{label}</Day1Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6, width: '100%' },
});