import { Dimensions } from 'react-native';
import Animated, { Extrapolate, interpolate } from 'react-native-reanimated';
const { height } = Dimensions.get('window');

const addDeg = (deg: number): string => {
  'worklet';
  return `${deg}deg`;
};

export const scaleAnimation = (
  progress: Animated.SharedValue<number>
): Array<any> => {
  'worklet';
  return [
    {
      scale: interpolate(progress.value, [0, 1], [1, 0.94], Extrapolate.CLAMP),
    },
  ];
};

export const translateXAnimation = (
  progress: Animated.SharedValue<number>,
  targetValue: Animated.SharedValue<number>
) => {
  'worklet';
  return [
    {
      translateX: interpolate(
        progress.value,
        [0, 1],
        [0, targetValue.value],
        Extrapolate.CLAMP
      ),
    },
  ];
};

export const rotateXAnimation = (progress: Animated.SharedValue<number>) => {
  'worklet';
  return [
    {
      perspective: 600,
    },
    {
      translateY: height / 2,
    },
    {
      rotateX: addDeg(
        interpolate(progress.value, [0, 0.5], [0, 4], Extrapolate.CLAMP)
      ),
    },
    {
      translateY: -height,
    },
    {
      rotateX: addDeg(
        interpolate(progress.value, [0.5, 1], [0, -4], Extrapolate.CLAMP)
      ),
    },
    {
      translateY: height / 2,
    },
  ];
};
