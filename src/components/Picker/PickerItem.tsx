import React, { useCallback, useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { interpolate, runOnJS, useAnimatedReaction, useAnimatedStyle } from 'react-native-reanimated';
import {PickerItemProps} from './type';

const PickerItem: React.FC<PickerItemProps> = props => {
  const {index, currentIndex, translateY, children, options, paningIndex} = props;
  const [offWindow, setOffWindow] = useState(true);
  const componentRef = useRef(children);

  const changeState = useCallback((mount: boolean) => {
    if (mount != offWindow) {
      setOffWindow(mount);
    }
  }, [offWindow]);

  // useAnimatedReaction(() => options.maxRender - translateY.value / options.itemHeight, (paningIndex) => {
  //   let shouldMount = !(index < paningIndex - 2 * options.maxRender || index > paningIndex + 2 * options.maxRender);
  //   runOnJS(changeState)(shouldMount);
  // })

  const style = useAnimatedStyle(() => {
    if (index < paningIndex.value - options.maxRender - 1 || index > paningIndex.value + options.maxRender + 1) {
      const upOrDown = index < paningIndex.value - options.maxRender - 1;
      const rotateX = upOrDown ? 50 : -50;
      const outOfY = upOrDown ? -options.itemHeight * (index+1) : 5 *  options.itemHeight

      runOnJS(changeState)(false);

      return {
        opacity: 0.2,
        transform: [
          {translateY: translateY.value},
          {perspective: 1500},
          {rotateX: `${rotateX}deg`},
          {scaleX: 0.9},
          {scaleY: 0.9}
        ]  
      }
    }

    runOnJS(changeState)(true);

    const visibleRotateX = [50, 30, 20, 0, -20, -30, -50];
    const visibleIndex = [index-3, index-2, index - 1, index, index + 1, index + 2, index + 3];
    const rotateX = interpolate(paningIndex.value, visibleIndex, visibleRotateX);

    return {
      opacity: interpolate(paningIndex.value, visibleIndex, [0.2, 0.4, 0.6, 1, 0.6, 0.4, 0.2]),
      transform: [
        {translateY: translateY.value},
        {perspective: 1500},
        {rotateX: `${rotateX}deg`},
        {scaleX: interpolate(paningIndex.value, visibleIndex, [0.9, 0.92, 0.95, 1.05, 0.95, 0.92, 0.9])},
        {scaleY: interpolate(paningIndex.value, visibleIndex, [0.9, 0.92, 0.95, 1.05, 0.95, 0.92, 0.9])}
      ]
    };
  });

  return (
    <Animated.View style={[{ 
      height: options.itemHeight, 
      width: '100%', 
      justifyContent: 'center', 
      alignItems: 'center',
      }, style]}
    >
      {offWindow ? componentRef.current : null}
    </Animated.View>
  )
}

export default PickerItem;
