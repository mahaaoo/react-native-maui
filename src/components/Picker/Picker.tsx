import React, { useCallback, useMemo, useEffect } from 'react';
import {View, Dimensions, ViewStyle} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';
import PickerItem from './PickerItem';
import { PickerProps } from './type';
import { useProps, useInitialValue } from './hook';

const {width} = Dimensions.get('window');

const ITEM_HEIGHT = 30;
const INIT_INDEX = 2;

const Picker: React.FC<PickerProps> = props => {
  const {dataSource, style, renderItem, onChange, options} = useProps(props);
  const {
    translateY,
    offset,
    currentIndex,
    snapPoints,
    timingOptions
  } = useInitialValue(options, dataSource);

  useEffect(() => {
    // 立即执行一次onChange，保证父组件第一次也能拿到值
    handleChange(currentIndex.value);
  }, []);

  const handleChange = useCallback((index: number) => {
    onChange && onChange(dataSource[index]);
  }, []);

  const panGesture = Gesture.Pan()
  .onBegin(() => {
    offset.value = translateY.value;
  })
  .onUpdate(({translationY}) => {
    translateY.value = offset.value + translationY;
  })
  .onEnd(({velocityY}) => {
    const dest = snapPoint(translateY.value, velocityY, snapPoints);
    currentIndex.value = options.maxRender - dest / options.itemHeight;
            
    translateY.value = withTiming(dest, timingOptions, () => {
      runOnJS(handleChange)(currentIndex.value)
    });
  });

  const aninmatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value
        },
      ]
    }
  });
  
  const mustStyle: ViewStyle = useMemo(() => {
    return {
      overflow: 'hidden',
      height: options.itemHeight * (options.maxRender * 2 + 1)
    }
  }, [options]);

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[{ backgroundColor: 'white' }, style, mustStyle]}>
        <Animated.View style={[{flex: 1}, aninmatedStyle]}>
          {dataSource?.map((item, index) => {
            return (
              <PickerItem key={`key_${index}`} {...{index, currentIndex, translateY, options}}>
                {renderItem && renderItem(item, index)}
              </PickerItem>
            )
          })}
        </Animated.View>
        <View style={{
          position: 'absolute',
          top: INIT_INDEX * ITEM_HEIGHT,
          left: 0,
          right: 0,
          width,
          height: ITEM_HEIGHT,
          borderWidth: 1,
          borderColor: 'red',
          backgroundColor: 'transparent',
        }} />
      </View>
    </GestureDetector>
  )
};

export default Picker;
