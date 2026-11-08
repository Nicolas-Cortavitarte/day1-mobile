import type { AnimationObject } from 'lottie-react-native';

export const ANIMATIONS = {
  alert: require('./alert.json') as AnimationObject,
  delete: require('./delete.json') as AnimationObject,
  emptyCalm: require('./empty-calm.json') as AnimationObject,
  milestone: require('./milestone.json') as AnimationObject,
  success: require('./success.json') as AnimationObject,
} as const;
