import React from 'react';
import {Dimensions, View, Text} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, Extrapolate, interpolate, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withDecay, withSpring, withTiming } from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';

const {width} = Dimensions.get('window');

const data: number[] = [];
for(let i = 0; i<20; i++) {
  data.push(1990 + i);
}

const ITEM_HEIGHT = 30;
const INIT_INDEX = 3;

interface PickerExampleProps {
};

const PickerExample: React.FC<PickerExampleProps> = props => {
  const {} = props;
  const translateY = useSharedValue(3*ITEM_HEIGHT); 
  const offset = useSharedValue(0);
  const currentIndex = useSharedValue(INIT_INDEX);

  const snapPoints = data.map((_, index) => -index * ITEM_HEIGHT + 3*ITEM_HEIGHT);
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

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value
        },
      ]
    }
  })

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <GestureDetector gesture={panGesture}>
        <View style={{ width, height: ITEM_HEIGHT * 7, backgroundColor: 'white', overflow: 'hidden' }}>
          <Animated.View style={[{flex: 1}, style]}>
            {data?.map((res, index) => {
              return <PickerItem key={`key_${index}`} {...{index, res, currentIndex, translateY}} />
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
    </View>
  )
};

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

export default PickerExample;
