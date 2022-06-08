import React, { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

interface TranslateContainerProps {
  children: React.ReactNode,
  from?: 'bottom' | 'top' | 'left' | 'right';
};

export interface TranslateContainerRef {
  mount: (callback?: () => void) => void;
  unMount: (callback?: () => void) => void;
}

const TranslateContainer = forwardRef<TranslateContainerRef, TranslateContainerProps>((props, ref) => {
  const {from = 'bottom', children} = props;
  const translateY = useSharedValue(0);

  const toHeight = useSharedValue(0);
  const toWidth = useSharedValue(0);

  const onLayout = useCallback(({
    nativeEvent: {
      layout: { height: h, width: w},
    },
  }) => {
    toHeight.value = h;
    toWidth.value = w;
    mount();
  }, []);

  const mount = useCallback((callback?) => {
    console.log(toHeight.value);
    translateY.value = withTiming(-toHeight.value, {duration: 250}, () => {
      callback && callback();
    });
  }, []);

  const unMount = useCallback((callback?) => {
    translateY.value = withTiming(height, {duration: 250}, () => {
      callback && callback();
    });
  }, []);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateY: translateY.value
      }]
    }
  });

  const initialPosition = useMemo(() => {
    switch(true) {
      case (from === 'bottom'):
        return {
          top: height,
          left: 0,
          right: 0,
        }
      case (from === 'top'):
        return {
          bottom: height,
          left: 0,
          right: 0,
        }
      case (from === 'left'):
        return {
          top: 0,
          bottom: 0,
          right: width,
        }
      case (from === 'right'):
        return {
          top: 0,
          bottom: 0,
          left: width,
        }         
    }
  }, [from])

  useImperativeHandle(ref, () => ({
    mount,
    unMount,
  }), []);

  return (
    <Animated.View 
      style={[styles.overlay, initialPosition, animationStyle]}
    >
      <View onLayout={onLayout}>
        {children}
      </View>
    </Animated.View>
  )
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
  },
})

export default TranslateContainer;
