import React from 'react';
import { Dimensions } from 'react-native';
import Animated, { 
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useItemOffset} from './hook';
import { ScaleLayoutProps } from './type';

const {width} = Dimensions.get('window');

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
  } = props;

  const style = useAnimatedStyle(() => {
    const itemOffset = useItemOffset(-currentIndex.value, index, size, currentIndex.value, options);
    const scale = interpolate(indexAtData.value, [index - 1, index, index + 1], [0.9, 1, 0.9], Extrapolate.CLAMP);
    const offset = (width - layoutOption?.options.width) / 2 - layoutOption?.options.margin || 0;

    if (horizontal) {
      return {
        transform: [{
          translateX: translate.value + (itemOffset * size * stepDistance) + offset,
        }, {
          translateY: 0,
        }, {
          scaleY: withTiming(scale),
        }]
      };  
    } else {
      return {
        transform: [{
          translateY: translate.value + (itemOffset * size * stepDistance),
        }, {
          translateX: 0,
        }]
      };  
    } 
  }, [currentIndex, horizontal, layoutOption, indexAtData]);

  return (
    <Animated.View 
      style={[style]}
    >
      {children}
    </Animated.View>
  );};

export default ScaleLayout;
