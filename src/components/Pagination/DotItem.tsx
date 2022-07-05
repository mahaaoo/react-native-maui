import React, { useMemo } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {Extrapolate, interpolate, useAnimatedStyle} from 'react-native-reanimated'
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
  const {index, shape = 'circle', size = 8, activeColor = 'white', style, inActiveColor = 'white'} = props;
  const {currentIndex} = usePagination();

  const animationStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];
    const opacity = interpolate(currentIndex, inputRange, [0.5, 1, 0.5], Extrapolate.CLAMP);
    const scale = interpolate(currentIndex, inputRange, [1, 1.25, 1], Extrapolate.CLAMP);
  
    return {
      opacity,
      transform: [{scale}],
      backgroundColor: currentIndex === index ? activeColor : inActiveColor, 
    }
  })

  const borderRadius = useMemo(() => {
    if (shape === 'cube') {
      return 0
    }
    if (shape === 'circle') {
      return size / 2
    }
    return 0
  }, [shape, size]) 

  return (
    <Animated.View
      style={[{ 
        width: size, 
        height: size, 
        borderRadius: borderRadius, 
        margin: 4,
      }, style, animationStyle]}
    />
  )
}

export default DotItem;
