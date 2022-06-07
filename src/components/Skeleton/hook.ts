import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

const initialValue = 1;
const toValue = 0;

export const useBreath = (animationProgress: Animated.SharedValue<number>) => {
  const reverse = true;

  return {
    reverse
  }
}

export const useShine = (animationProgress: Animated.SharedValue<number>) => {
  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: interpolateColor(animationProgress.value, [toValue, initialValue], [0, 100])
      }]
    }
  });

  const reverse = false;

  return {
    animationStyle,
    reverse
  }
}
