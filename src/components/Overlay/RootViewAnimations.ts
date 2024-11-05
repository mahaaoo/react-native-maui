import { Dimensions } from 'react-native';
import {
  Extrapolation,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
const { height } = Dimensions.get('window');

const addDeg = (deg: number): string => {
  'worklet';
  return `${deg}deg`;
};

export const scaleAnimation = (progress: SharedValue<number>) => {
  'worklet';
  return {
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [1, 0.94],
          Extrapolation.CLAMP
        ),
      },
    ],
  };
};

export const translateXAnimation = (
  progress: SharedValue<number>,
  targetValue: SharedValue<number>
) => {
  'worklet';
  return {
    transform: [
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, targetValue.value],
          Extrapolation.CLAMP
        ),
      },
    ],
  };
};

export const rotateXAnimation = (progress: SharedValue<number>) => {
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
          interpolate(progress.value, [0, 0.5], [0, 4], Extrapolation.CLAMP)
        ),
      },
      {
        translateY: -height,
      },
      {
        rotateX: addDeg(
          interpolate(progress.value, [0.5, 1], [0, -4], Extrapolation.CLAMP)
        ),
      },
      {
        translateY: height / 2,
      },
    ],
  };
};

export const scaleAndTranslateX = (
  progress: SharedValue<number>,
  targetValue: SharedValue<number>
) => {
  'worklet';
  return {
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [1, 0.94],
          Extrapolation.CLAMP
        ),
      },
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, targetValue.value],
          Extrapolation.CLAMP
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
    progress: SharedValue<number>,
    targetValue: SharedValue<number>
  ) => any;
} = {
  'null': () => {
    'worklet';
    return {};
  },
  'scale': (progress: SharedValue<number>) => {
    'worklet';
    return scaleAnimation(progress);
  },
  'translateX': (
    progress: SharedValue<number>,
    targetValue: SharedValue<number>
  ) => {
    'worklet';
    return translateXAnimation(progress, targetValue);
  },
  'rotateX': (progress: SharedValue<number>) => {
    'worklet';
    return rotateXAnimation(progress);
  },
  'scaleAndtranslateX': (
    progress: SharedValue<number>,
    targetValue: SharedValue<number>
  ) => {
    'worklet';
    return scaleAndTranslateX(progress, targetValue);
  },
};

export const configAnimation = (
  type: RootAnimationType,
  progress: SharedValue<number>,
  targetValue: SharedValue<number>
) => {
  'worklet';
  const animation = TypeToAnimation[type];
  return animation(progress, targetValue);
};
