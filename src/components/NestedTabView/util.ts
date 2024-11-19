import { scrollTo, AnimatedRef } from 'react-native-reanimated';

export const mscrollTo = (
  animatedRef: AnimatedRef<any>,
  x: number,
  y: number,
  animated: boolean
) => {
  'worklet';
  if (!animatedRef) return;
  console.log('滚动到', y);
  scrollTo(animatedRef, x, y, animated);
};
