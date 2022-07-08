import React, { useMemo } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { usePagination } from './Pagination';

interface DotItemProps {
  index: number;
  size?: number;
  activeColor?: string;
  inActiveColor?: string;
  shape?: 'circle' | 'cube';
  style?: ViewStyle;
}

const DotItem: React.FC<DotItemProps> = (props) => {
  const {
    index,
    shape = 'circle',
    size = 8,
    activeColor = 'white',
    style,
    inActiveColor = 'white',
  } = props;
  const { currentIndex } = usePagination();

  const animationStyle = useAnimatedStyle(() => {
    let value = 0;
    if (typeof currentIndex === 'number') {
      value = currentIndex;
    } else {
      value = currentIndex.value;
    }

    const inputRange = [index - 1, index, index + 1];
    const opacity = interpolate(
      value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      value,
      inputRange,
      [1, 1.25, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
      backgroundColor: interpolateColor(value, inputRange, [
        inActiveColor,
        activeColor,
        inActiveColor,
      ]),
    };
  });

  const borderRadius = useMemo(() => {
    if (shape === 'cube') {
      return 0;
    }
    if (shape === 'circle') {
      return size / 2;
    }
    return 0;
  }, [shape, size]);

  const propStyle = useMemo(() => {
    return {
      width: size,
      height: size,
      borderRadius: borderRadius,
      margin: size / 2,
    };
  }, [size, borderRadius]);

  return <Animated.View style={[propStyle, style, animationStyle]} />;
};

export default DotItem;
