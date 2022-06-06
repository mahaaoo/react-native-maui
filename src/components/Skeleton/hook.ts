import { interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

export const useBreath = () => {
  const initialValue = 1;
  const toValue = 0;

  const animationValue = useSharedValue(1);
  const animationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(animationValue.value, [toValue,initialValue], ['white', '#D8D8D8'])
    }
  });

  const animation = withSequence(withTiming(toValue, {duration: 1000}), withTiming(initialValue, {duration: 1000}));
  const reverse = true;

  return {
    animationValue,
    animation,
    animationStyle,
    initialValue,
    toValue,
    reverse
  }
}

export const useShine = () => {

}
