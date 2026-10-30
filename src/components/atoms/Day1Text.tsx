import { Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Typography } from '@/constants/theme';

export type Day1TextVariant = keyof typeof Typography;

type Day1TextProps = TextProps & {
  variant?: Day1TextVariant;
  color?: string;
};

export function Day1Text({ variant = 'bodyRegular16', color, style, ...rest }: Day1TextProps) {
  const colors = useTheme();
  const resolvedColor = color ?? colors.textPrimary;

  return (
    <Text style={[Typography[variant] as TextStyle, { color: resolvedColor }, style]} {...rest} />
  );
}