import { Image, StyleSheet } from 'react-native';

const LOGO_SOURCE = require('@/assets/images/day1-logo.png');

type Day1LogoProps = {
  size?: number;
};

export function Day1Logo({ size = 40 }: Day1LogoProps) {
  return (
    <Image
      source={LOGO_SOURCE}
      accessibilityIgnoresInvertColors
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.24),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  logo: { resizeMode: 'contain' },
});
