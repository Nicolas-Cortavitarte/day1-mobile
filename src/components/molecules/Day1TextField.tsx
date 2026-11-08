import { useState } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Typography } from '@/constants/theme';
import { Day1InputShell } from '../atoms/Day1InputShell';
import { Day1FormField } from './Day1FormField';

type Day1TextFieldProps = TextInputProps & {
  label: string;
  helperText?: string;
};

export function Day1TextField({ label, helperText, style, onFocus, onBlur, ...rest }: Day1TextFieldProps) {
  const colors = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <Day1FormField label={label} helperText={helperText}>
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
