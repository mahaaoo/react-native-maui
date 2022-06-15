/**
 * if use this componet wrapper overlay componet 
 * onAppear will be called when it mount,
 * onDisappear will be called when it unMount
 * when it mount, will play translate animation
 * when it unmount, will play translate animation reversedly
 */
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import {StyleSheet, Dimensions, View, TouchableWithoutFeedback} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { clamp, snapPoint } from '../../../utils/redash';
import {useOverlay} from '../Overlay';
import { AnimationContainerProps } from './type';

const {width, height} = Dimensions.get('window');

interface TranslateContainerProps extends AnimationContainerProps {
  /**
   * it means the component will appear from
   * only support those four direction
   */
  from?: 'bottom' | 'top' | 'left' | 'right',
  /**
   * gesture to close
   */
  gesture?: boolean
};

export interface TranslateContainerRef {
  mount: (callback?: () => void) => void;
  unMount: (callback?: () => void) => void;
}

const TranslateContainer = forwardRef<TranslateContainerRef, TranslateContainerProps>((props, ref) => {
  const {
    from = 'bottom', 
    children, 
    onAppear, 
    onDisappear, 
    mask = true, 
    duration = 250,
    modal = false,
    onClickMask,
    pointerEvents='auto',
    innerKey,
    containerStyle,
    gesture = false,
  } = props;
  const {remove} = useOverlay();
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const offset = useSharedValue(0);

  const toHeight = useRef(0);
  const toWidth = useRef(0);
  const snapPoints1 = useSharedValue<number>(0);
  const snapPoints2 = useSharedValue<number>(0);

  const onLayout = useCallback(({
    nativeEvent: {
      layout: { height: h, width: w},
    },
  }) => {
    toHeight.current = h;
    toWidth.current = w;
    switch(true) {
      case (from === 'bottom'): {
        snapPoints1.value = -h;
        snapPoints2.value = 0;
        break;
      }
      case (from === 'top'): {
        snapPoints1.value = 0;
        snapPoints2.value = h;
        break;
      }
      case (from === 'left'): {
        snapPoints1.value = 0;
        snapPoints2.value = w;
        break;
      }
      case (from === 'right'): {
        snapPoints1.value = -w;
        snapPoints2.value = 0;
        break;
      }
    }
    console.log('onLayout', [h,w]);
    mount();
  }, []);

  /**
   * After Component has created by Overlay, this funtion will move the component to destination
   * Just a animation not created
   */
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

    opacity.value = withTiming(mask ? 0.3 : 0, {duration})
    if (direction) {
      console.log([dest]);
      translateY.value = withTiming(dest, {duration}, () => {
        onAppear && runOnJS(onAppear)();
      });
    } else {
      console.log([dest]);
      translateX.value = withTiming(dest, {duration}, () => {
        onAppear && runOnJS(onAppear)();
      });
    }
  }, [onAppear]);

  /**
   * Before the Component be removed, the function move the component out of the window
   * Just a animation not remove actually
   */
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

    opacity.value = withTiming(0, {duration});

    if (direction) {
      translateY.value = withTiming(dest, {duration}, () => {
        onDisappear && runOnJS(onDisappear)();
      }); 
    } else {
      translateX.value = withTiming(dest, {duration}, () => {
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

  const maskAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value, 
      backgroundColor: '#000'
    }
  })

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

  const removeSelf = useCallback(() => {
    remove(innerKey);
  }, [remove, innerKey])

  const handleClickMask = useCallback(() => {
    if (pointerEvents === 'none') return;
    if (!modal && pointerEvents === 'auto') {
      removeSelf();
    }
    onClickMask && onClickMask();
  }, []);

  const panGesture = Gesture.Pan()
  .onBegin(() => {
    if (!gesture) return;
    if (from === 'bottom' || from === 'top') {
      offset.value = translateY.value;
    } else {
      offset.value = translateX.value;
    }
  })
  .onUpdate(({translationY, translationX}) => {
    if (!gesture) return;
    if (from === 'bottom' || from === 'top') {
      translateY.value = clamp(offset.value + translationY, snapPoints1.value, snapPoints2.value);
    } else {
      translateX.value = clamp(offset.value + translationX, snapPoints1.value, snapPoints2.value);
    }
  })
  .onEnd(({velocityY, velocityX}) => {
    if (!gesture) return;
    let dest;
    if (from === 'bottom' || from === 'top') {
      dest = snapPoint(translateY.value, velocityY, [snapPoints1.value, snapPoints2.value]);
      translateY.value = withTiming(dest);
    } else {
      dest = snapPoint(translateX.value, velocityX, [snapPoints1.value, snapPoints2.value]);
      translateX.value = withTiming(dest);
    }
    if (dest === 0) {
      runOnJS(removeSelf)();
    }
  })

  useImperativeHandle(ref, () => ({
    mount,
    unMount,
  }), []);

  return (
    <View style={styles.mask}>
      <TouchableWithoutFeedback style={styles.overlay} onPress={handleClickMask}>
        <Animated.View pointerEvents={pointerEvents} style={[styles.mask, maskAnimationStyle]} />
      </TouchableWithoutFeedback>
      <GestureDetector gesture={panGesture}>
        <Animated.View 
          style={[styles.overlay, initialPosition, animationStyle]}
        >
          <View style={[styles.container, containerStyle]} onLayout={onLayout}>
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  )
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  }
})

export default TranslateContainer;
