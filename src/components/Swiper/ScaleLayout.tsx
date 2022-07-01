import React, { useMemo } from 'react';
import Animated, { 
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useItemOffset} from './utils';
import { ScaleLayoutProps } from './type';

const ScaleLayout: React.FC<ScaleLayoutProps> = props => {
  const {
    currentIndex, 
    index, 
    translate, 
    children, 
    size, 
    options, 
    stepDistance, 
    horizontal,
    layoutOption,
    indexAtData,
    container
  } = props;

  const style = useAnimatedStyle(() => {
    const itemOffset = useItemOffset(-currentIndex.value, index, size, currentIndex.value, options);
    const scale = interpolate(indexAtData.value, [index - 1, index, index + 1], [0.9, 1, 0.9], Extrapolate.CLAMP);
    const zIndex = interpolate(indexAtData.value, [index - 1, index, index + 1], [1, 99, 1], Extrapolate.CLAMP);
    if (horizontal) {
      const offset = (container.width - layoutOption?.options.mainAxisSize) / 2 - layoutOption?.options.margin || 0;
      return {
        zIndex,
        transform: [{
          translateX: translate.value + (itemOffset * size * stepDistance) + offset,
        }, {
          translateY: 0,
        }, {
          scaleY: withTiming(scale),
        }]
      };  
    } else {
      const offset = (container.height - layoutOption?.options.mainAxisSize) / 2 - layoutOption?.options.margin || 0;
      return {
        zIndex,
        transform: [{
          translateY: translate.value + (itemOffset * size * stepDistance) + offset,
        }, {
          translateX: 0,
        }, {
          scaleX: withTiming(scale),
        }]
      };  
    } 
  }, [currentIndex, horizontal, layoutOption, indexAtData, container]);

  const defaultStyle = useMemo(() => {
    if (horizontal) {      
      return {
        zIndex: size - index,
        width: layoutOption?.options.mainAxisSize,
        height: container.height,
        marginHorizontal: layoutOption?.options.margin,
      }
    }
    return {
      zIndex: size - index,
      width: container.width,
      height: layoutOption?.options.mainAxisSize,
      marginVertical: layoutOption?.options.margin,
    }

  }, [container, horizontal, layoutOption, size, index])

  return (
    <Animated.View 
      style={[defaultStyle, style]}
    >
      {children}
    </Animated.View>
  );};

export default ScaleLayout;
