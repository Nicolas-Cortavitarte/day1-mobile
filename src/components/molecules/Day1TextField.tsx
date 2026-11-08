import { useState } from 'react';
import { TextInput, type TextInputProps, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Typography } from '@/constants/theme';
import { Day1InputShell } from '../atoms/Day1InputShell';
import { Day1FormField } from './Day1FormField';

type Day1TextFieldProps = TextInputProps & {
  label: string;
  helperText?: string;
  containerStyle?: ViewStyle;
};

export function Day1TextField({
  label,
  helperText,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: Day1TextFieldProps) {
  const colors = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <Day1FormField label={label} helperText={helperText} style={containerStyle}>
      <Day1InputShell focused={focused}>
        <TextInput
          placeholderTextColor={colors.textSecondaryReadable}
          accessibilityLabel={label}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[
            Typography.bodyRegular16,
            { flex: 1, padding: 0, margin: 0, color: colors.textPrimary },
            style,
          ]}
          {...rest}
        />
      </Day1InputShell>
    </Day1FormField>
  );
}
