import { useRef } from 'react';
import { Animated } from 'react-native';

import { useReducedMotion } from './use-reduced-motion';

export function usePressScale(targetScale = 0.97) {
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;

  function onPressIn() {
    if (reducedMotion) return;
    Animated.spring(scale, {
      toValue: targetScale,
      speed: 50,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  }

  function onPressOut() {
    if (reducedMotion) return;
    Animated.spring(scale, {
      toValue: 1,
      speed: 40,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  }

  return {
    scaleStyle: { transform: [{ scale }] },
    onPressIn,
    onPressOut,
  };
}
