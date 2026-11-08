import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { type StyleProp, type ViewStyle } from 'react-native';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

type Day1LottieProps = {
  source: LottieViewProps['source'];
  size?: number;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Day1Lottie({ source, size = 36, loop = false, style }: Day1LottieProps) {
  const reducedMotion = useReducedMotion();

  return (
    <LottieView
      source={source}
      autoPlay={!reducedMotion}
      loop={reducedMotion ? false : loop}
      progress={reducedMotion ? 1 : undefined}
      style={[{ width: size, height: size }, style]}
    />
  );
}
