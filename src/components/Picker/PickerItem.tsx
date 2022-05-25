import React from 'react';
import {Text} from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

const ITEM_HEIGHT = 30;
const INIT_INDEX = 3;

interface PickerItemProps {
  index: number;
  res: number;
  currentIndex: Animated.SharedValue<number>;
  translateY: Animated.SharedValue<number>;
}

const PickerItem: React.FC<PickerItemProps> = props => {
  const {index, res, currentIndex, translateY} = props;

  const style = useAnimatedStyle(() => {
    const panIndex = INIT_INDEX - translateY.value / ITEM_HEIGHT;

    const visibleRotateX = [50, 30, 20, 0, -20, -30, -50];
    const visibleIndex = [index-3, index-2, index - 1, index, index + 1, index + 2, index + 3];
    const rotateX = interpolate(panIndex, visibleIndex, visibleRotateX);

    return {
      opacity: interpolate(panIndex, visibleIndex, [0.2, 0.4, 0.6, 1, 0.6, 0.4, 0.2]),
      transform: [
        {perspective: 1500},
        {rotateX: `${rotateX}deg`},
        {scaleX: interpolate(panIndex, visibleIndex, [0.9, 0.92, 0.95, 1.03, 0.95, 0.92, 0.9])},
        {scaleY: interpolate(panIndex, visibleIndex, [0.9, 0.92, 0.95, 1.03, 0.95, 0.92, 0.9])}
      ]
    };
  });

  return (
    <Animated.View style={[{ 
      height: ITEM_HEIGHT, 
      width: '100%', 
      justifyContent: 'center', 
      alignItems: 'center',
    }, style]}>
      <Text style={{ fontSize: 20 }}>{res}</Text>
    </Animated.View>
  )
}

export default PickerItem;
