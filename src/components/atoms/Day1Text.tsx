import { Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useFontScale } from '@/hooks/use-font-scale';
import { Typography } from '@/constants/theme';

export type Day1TextVariant = keyof typeof Typography;

type Day1TextProps = TextProps & {
  variant?: Day1TextVariant;
  color?: string;
};

export function Day1Text({ variant = 'bodyRegular16', color, style, ...rest }: Day1TextProps) {
  const colors = useTheme();
  const scale = useFontScale();
  const resolvedColor = color ?? colors.textPrimary;
  const base = Typography[variant] as TextStyle;

  const scaledStyle: TextStyle = {
    ...base,
    fontSize: typeof base.fontSize === 'number' ? base.fontSize * scale : base.fontSize,
    lineHeight: typeof base.lineHeight === 'number' ? base.lineHeight * scale : base.lineHeight,
  };

  return <Text style={[scaledStyle, { color: resolvedColor }, style]} {...rest} />;
}