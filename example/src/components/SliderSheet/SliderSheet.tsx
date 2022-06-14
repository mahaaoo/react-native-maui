import React, { useImperativeHandle, useMemo, forwardRef, useCallback } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { clamp, snapPoint } from 'react-native-redash';

interface SliderSheetProps {
  maxHeight: number;
  minHeight: number;
  position: 'top' | 'bottom';
  children: React.ReactNode;
};

export interface SliderSheetRef {
  show: () => void;
  hidden: () => void;
};

const SliderSheet = forwardRef<SliderSheetRef, SliderSheetProps>((props, ref) => {
  const {maxHeight, minHeight, position, children} = props;
  const translateY = useSharedValue(0);
  const offset = useSharedValue(0);

  const snapPoints = useMemo(() => {
    if (position === 'top') {
      return [0, (maxHeight - minHeight)];
    }
    if (position === 'bottom') {
      return [-(maxHeight - minHeight), 0];
    }
    return [0 , 0];
  }, [maxHeight, minHeight, position]);

  const setDest = useCallback((dest: number) => {
    'worklet';
    translateY.value = withSpring(dest, {overshootClamping: true});
  }, [snapPoints]);
  
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      offset.value = translateY.value;
    })
    .onUpdate(({translationY}) => {
      translateY.value = clamp(offset.value + translationY, snapPoints[0], snapPoints[1]);
    })
    .onEnd(({velocityY}) => {
      const dest = snapPoint(translateY.value, velocityY, snapPoints);
      setDest(dest);
    })

  useImperativeHandle(ref, () => ({
    show: () => {
      const dest = snapPoints[0] + snapPoints[1];
      setDest(dest);
    },
    hidden: () => {
      setDest(0);
    },
  }), [setDest, snapPoints]);

  const style = useAnimatedStyle(() => {
    let positionStyle = {};
    if (position === 'top') {
      positionStyle = {
        top: 0,
        transform: [{
          translateY: -(maxHeight - minHeight) + translateY.value
        }]
      }
    }
    if (position === 'bottom') {
      positionStyle = {
        bottom: 0,
        transform: [{
          translateY: (maxHeight - minHeight) + translateY.value
        }]  
      }
    }
    return positionStyle
  }, [maxHeight, minHeight, position])

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ 
        position: 'absolute', 
        height: maxHeight,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }, style]}>
        {children}
      </Animated.View>
    </GestureDetector>
  )
});

export default SliderSheet;
