import React from 'react';
import Animated, { 
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useItemOffset} from './hook';
import { BaseLayoutProps } from './type';

const BaseLayout: React.FC<BaseLayoutProps> = props => {
  const {currentIndex, index, translate, children, size, options, stepDistance, horizontal} = props;

  const style = useAnimatedStyle(() => {
    const itemOffset = useItemOffset(-currentIndex.value, index, size, currentIndex.value, options);
    if (horizontal) {
      return {
        transform: [{
          translateX: translate.value + (itemOffset * size * stepDistance),
        }, {
          translateY: 0,
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
  }, [currentIndex, horizontal]);

  return (
    <Animated.View 
      style={[{width: '100%', height: '100%'}, style]}
    >
      {children}
    </Animated.View>
  );};

export default BaseLayout;
