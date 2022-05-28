import React from 'react';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import {PickerItemProps} from './type';

const PickerItem: React.FC<PickerItemProps> = props => {
  const {index, currentIndex, translateY, children, options} = props;

  const style = useAnimatedStyle(() => {
    const panIndex = options.maxRender - translateY.value / options.itemHeight;

    const visibleRotateX = [50, 30, 20, 0, -20, -30, -50];
    const visibleIndex = [index-3, index-2, index - 1, index, index + 1, index + 2, index + 3];
    const rotateX = interpolate(panIndex, visibleIndex, visibleRotateX);

    return {
      opacity: interpolate(panIndex, visibleIndex, [0.2, 0.4, 0.6, 1, 0.6, 0.4, 0.2]),
      transform: [
        {perspective: 1500},
        {rotateX: `${rotateX}deg`},
        {scaleX: interpolate(panIndex, visibleIndex, [0.9, 0.92, 0.95, 1.02, 0.95, 0.92, 0.9])},
        {scaleY: interpolate(panIndex, visibleIndex, [0.9, 0.92, 0.95, 1.02, 0.95, 0.92, 0.9])}
      ]
    };
  });

  return (
    <Animated.View style={[{ 
      height: options.itemHeight, 
      width: '100%', 
      justifyContent: 'center', 
      alignItems: 'center',
    }, style]}>
      {children}
    </Animated.View>
  )
}

export default PickerItem;
