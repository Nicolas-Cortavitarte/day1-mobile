import { TextInput, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Typography } from '@/constants/theme';
import { Day1InputShell } from '../atoms/Day1InputShell';
import { Day1FormField } from './Day1FormField';

type Day1TextFieldProps = TextInputProps & {
  label: string;
};

export function Day1TextField({ label, style, ...rest }: Day1TextFieldProps) {
  const colors = useTheme();
  return (
    <Day1FormField label={label}>
      <Day1InputShell>
        <TextInput
          placeholderTextColor={colors.textSecondaryReadable}
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