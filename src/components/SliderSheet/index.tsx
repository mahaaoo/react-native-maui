import React, { useImperativeHandle, useMemo, forwardRef, useCallback } from 'react';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
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

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, {y: number}>({
    onStart: (_, ctx) => {
      ctx.y = translateY.value;
    },
    onActive: ({translationY}, ctx) => {
      translateY.value = clamp(ctx.y + translationY, snapPoints[0], snapPoints[1]);
    },
    onEnd: ({velocityY}) => {
      const dest = snapPoint(translateY.value, velocityY, snapPoints);
      setDest(dest);
    }
  }, [snapPoints]);
  
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
    <PanGestureHandler onGestureEvent={onGestureEvent}>
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
    </PanGestureHandler>

  )
});

export default SliderSheet;
