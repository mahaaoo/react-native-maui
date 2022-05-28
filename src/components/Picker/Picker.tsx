import React from 'react';
import {View, Dimensions, ViewStyle} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';
import PickerItem from './PickerItem';

const {width} = Dimensions.get('window');

const ITEM_HEIGHT = 30;
const INIT_INDEX = 3;

interface PickerProps {
  dataSource: any[],
  style?: ViewStyle,
  renderItem: (item: any, index: number) => React.ReactNode,
};

const Picker: React.FC<PickerProps> = props => {
  const {dataSource, style, renderItem} = props;

  const translateY = useSharedValue(3*ITEM_HEIGHT); 
  const offset = useSharedValue(0);
  const currentIndex = useSharedValue(INIT_INDEX);

  const snapPoints = dataSource.map((_, index) => -index * ITEM_HEIGHT + 3*ITEM_HEIGHT);
  console.log(snapPoints);
  

  const panGesture = Gesture.Pan()
  .onBegin(() => {
    offset.value = translateY.value;
  })
  .onUpdate(({translationY}) => {
    translateY.value = offset.value + translationY;
  })
  .onEnd(({velocityY}) => {
    const dest = snapPoint(translateY.value, velocityY, snapPoints);
    currentIndex.value = INIT_INDEX - dest / ITEM_HEIGHT;
            
    translateY.value = withTiming(dest, {
      duration: 1000,
      easing: Easing.bezier(0.22, 1, 0.36, 1),  
    });
  })

  const aninmatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value
        },
      ]
    }
  })

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[{ height: ITEM_HEIGHT * 7, backgroundColor: 'white', overflow: 'hidden' }, style]}>
        <Animated.View style={[{flex: 1}, aninmatedStyle]}>
          {dataSource?.map((item, index) => {
            return (
              <PickerItem key={`key_${index}`} {...{index, currentIndex, translateY}}>
                {renderItem && renderItem(item, index)}
              </PickerItem>
            )
          })}
        </Animated.View>
        <View style={{
          position: 'absolute',
          top: 3 * ITEM_HEIGHT,
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
