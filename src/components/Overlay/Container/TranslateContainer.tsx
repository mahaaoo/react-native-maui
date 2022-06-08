/**
 * if use this componet wrapper overlay componet 
 * onAppear will be called when it mount,
 * onDisappear will be called when it unMount
 * when it mount, will play translate animation
 * when it unmount, will play translate animation reversedly
 */
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

interface TranslateContainerProps {
  children: React.ReactNode,
  from?: 'bottom' | 'top' | 'left' | 'right',
  onAppear?: () => void;
  onDisappear?: () => void;
};

export interface TranslateContainerRef {
  mount: (callback?: () => void) => void;
  unMount: (callback?: () => void) => void;
}

const TranslateContainer = forwardRef<TranslateContainerRef, TranslateContainerProps>((props, ref) => {
  const {from = 'bottom', children, onAppear, onDisappear} = props;
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  const toHeight = useRef(0);
  const toWidth = useRef(0);

  const onLayout = useCallback(({
    nativeEvent: {
      layout: { height: h, width: w},
    },
  }) => {
    toHeight.current = h;
    toWidth.current = w;
    console.log('onLayout', [h,w]);
    mount();
  }, []);

  const mount = useCallback(() => {
    let direction;
    let dest = 0;
    switch(true) {
      case (from === 'bottom'): {
        direction = true;
        dest = -toHeight.current;
        break;
      }
      case (from === 'top'): {
        direction = true;
        dest = toHeight.current;
        break;
      }
      case (from === 'left'): {
        direction = false;
        dest = toWidth.current;
        break;
      }
      case (from === 'right'): {
        direction = false;
        dest = -toWidth.current;
        break;
      }
    }

    if (direction) {
      console.log([dest]);
      translateY.value = withTiming(dest, {duration: 250}, () => {
        onAppear && runOnJS(onAppear)();
      });
    } else {
      translateX.value = withTiming(dest, {duration: 250}, () => {
        onAppear && runOnJS(onAppear)();
      });
    }
  }, [onAppear]);

  const unMount = useCallback(() => {
    let direction;
    let dest = 0;
    switch(true) {
      case (from === 'bottom'): {
        direction = true;
        dest = height;
        break;
      }
      case (from === 'top'): {
        direction = true;
        dest = -height;
        break;
      }
      case (from === 'left'): {
        direction = false;
        dest = -width;
        break;
      }
      case (from === 'right'): {
        direction = false;
        dest = width;
        break;
      }
    }

    if (direction) {
      translateY.value = withTiming(dest, {duration: 250}, () => {
        onDisappear && runOnJS(onDisappear)();
      }); 
    } else {
      translateX.value = withTiming(dest, {duration: 250}, () => {
        onDisappear && runOnJS(onDisappear)();
      });
    }
  }, [onDisappear]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: translateX.value
      },{
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
