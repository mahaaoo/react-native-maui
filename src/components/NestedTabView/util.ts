import { scrollTo as _scrollTo, AnimatedRef } from 'react-native-reanimated';

export const scrollTo = (
  animatedRef: AnimatedRef<any>,
  x: number,
  y: number,
  animated: boolean
) => {
  if (!animatedRef) return;
  _scrollTo(animatedRef, x, y, animated);
};
