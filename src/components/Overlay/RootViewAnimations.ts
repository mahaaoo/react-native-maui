import { Dimensions, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import Animated, {
  AnimatedStyleProp,
  Extrapolate,
  interpolate,
} from 'react-native-reanimated';
const { height } = Dimensions.get('window');

const addDeg = (deg: number): string => {
  'worklet';
  return `${deg}deg`;
};

export const scaleAnimation = (
  progress: Animated.SharedValue<number>
): AnimatedStyleProp<ViewStyle | ImageStyle | TextStyle> => {
  'worklet';
  return {
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [1, 0.94],
          Extrapolate.CLAMP
        ),
      },
    ],
  };
};

export const translateXAnimation = (
  progress: Animated.SharedValue<number>,
  targetValue: Animated.SharedValue<number>
): AnimatedStyleProp<ViewStyle | ImageStyle | TextStyle> => {
  'worklet';
  return {
    transform: [
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, targetValue.value],
          Extrapolate.CLAMP
        ),
      },
    ],
  };
};

export const rotateXAnimation = (
  progress: Animated.SharedValue<number>
): AnimatedStyleProp<ViewStyle | ImageStyle | TextStyle> => {
  'worklet';
  return {
    transform: [
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
    ],
  };
};

export const scaleAndTranslateX = (
  progress: Animated.SharedValue<number>,
  targetValue: Animated.SharedValue<number>
): AnimatedStyleProp<ViewStyle | ImageStyle | TextStyle> => {
  'worklet';
  return {
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [1, 0.94],
          Extrapolate.CLAMP
        ),
      },
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, targetValue.value],
          Extrapolate.CLAMP
        ),
      },
    ],
  };
};

export type RootAnimationType =
  | 'null'
  | 'translateX'
  | 'scale'
  | 'rotateX'
  | 'scaleAndtranslateX';

const TypeToAnimation: {
  [key in RootAnimationType]: (
    progress: Animated.SharedValue<number>,
    targetValue: Animated.SharedValue<number>
  ) => AnimatedStyleProp<ViewStyle | ImageStyle | TextStyle>;
} = {
  'null': () => {
    'worklet';
    return {};
  },
  'scale': (progress: Animated.SharedValue<number>) => {
    'worklet';
    return scaleAnimation(progress);
  },
  'translateX': (
    progress: Animated.SharedValue<number>,
    targetValue: Animated.SharedValue<number>
  ) => {
    'worklet';
    return translateXAnimation(progress, targetValue);
  },
  'rotateX': (progress: Animated.SharedValue<number>) => {
    'worklet';
    return rotateXAnimation(progress);
  },
  'scaleAndtranslateX': (
    progress: Animated.SharedValue<number>,
    targetValue: Animated.SharedValue<number>
  ) => {
    'worklet';
    return scaleAndTranslateX(progress, targetValue);
  },
};

export const configAnimation = (
  type: RootAnimationType,
  progress: Animated.SharedValue<number>,
  targetValue: Animated.SharedValue<number>
): AnimatedStyleProp<ViewStyle | ImageStyle | TextStyle> => {
  'worklet';
  const animation = TypeToAnimation[type];
  return animation(progress, targetValue);
};
