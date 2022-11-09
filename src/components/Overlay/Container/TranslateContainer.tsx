/**
 * if use this componet wrapper overlay componet
 * onAppear will be called when it mount,
 * onDisappear will be called when it unMount
 * when it mount, will play translate animation
 * when it unmount, will play translate animation reversedly
 */
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { clamp, snapPoint } from '../../../utils/redash';
import { useOverlay } from '../Overlay';
import { AnimationContainerProps } from './type';

const { width, height } = Dimensions.get('window');

interface TranslateContainerProps extends AnimationContainerProps {
  /**
   * it means the component will appear from
   * only support those four direction
   */
  from?: 'bottom' | 'top' | 'left' | 'right';
  /**
   * gesture to close
   */
  gesture?: boolean;
  /**
   * config Main View
   */
  config?: {
    isScale?: boolean; // support all directions
    isTranslate?: boolean; // only supports left and right
    isRotate?: boolean; //
  };
}

export interface TranslateContainerRef {
  mount: (callback?: () => void) => void;
  /**
   * will be invoked before be removed
   */
  unMount: (callback?: () => void) => void;
}

const TranslateContainer = forwardRef<
  TranslateContainerRef,
  TranslateContainerProps
>((props, ref) => {
  const {
    from = 'bottom',
    children,
    onAppear,
    onDisappear,
    mask = true,
    duration = 300,
    modal = false,
    onClickMask,
    pointerEvents = 'auto',
    innerKey,
    containerStyle,
    gesture = false,
    config = {
      isScale: false,
      isTranslate: false,
      isRotate: false,
    },
  } = props;
  const { remove, mainTransform } = useOverlay();
  const { mainScale, mainTranslateX, mainTopRotateX, mainBottomRotateX } =
    mainTransform;
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const offset = useSharedValue(0);

  const toHeight = useRef(0);
  const toWidth = useRef(0);
  const snapPoints1 = useSharedValue<number>(0);
  const snapPoints2 = useSharedValue<number>(0);

  // panGesture can't get useRef value, those just copy toHeight and toWidth
  const appearHeight = useSharedValue(0);
  const appearWidth = useSharedValue(0);

  useAnimatedReaction(
    () => translateY.value,
    (value) => {
      if (config.isScale) {
        mainScale.value = interpolate(
          value,
          [0, appearHeight.value],
          [1, 0.94],
          Extrapolate.CLAMP
        );
      }
      if (config.isRotate) {
        mainTopRotateX.value = interpolate(
          value,
          [0, appearHeight.value / 2],
          [0, 6],
          Extrapolate.CLAMP
        );
        mainBottomRotateX.value = interpolate(
          value,
          [appearHeight.value / 2, appearHeight.value],
          [0, -6],
          Extrapolate.CLAMP
        );
      }
    }
  );

  useAnimatedReaction(
    () => translateX.value,
    (value) => {
      if (config.isScale) {
        mainScale.value = interpolate(
          value,
          [0, appearWidth.value],
          [1, 0.94],
          Extrapolate.CLAMP
        );
      }
      if (config.isTranslate) {
        if (from === 'left') {
          mainTranslateX.value = Math.max(0, value);
        }
        if (from === 'right') {
          mainTranslateX.value = Math.min(0, value);
        }
      }
    }
  );

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height: h, width: w },
      },
    }) => {
      toHeight.current = h;
      toWidth.current = w;
      switch (true) {
        case from === 'bottom': {
          snapPoints1.value = -h;
          snapPoints2.value = 0;
          break;
        }
        case from === 'top': {
          snapPoints1.value = 0;
          snapPoints2.value = h;
          break;
        }
        case from === 'left': {
          snapPoints1.value = 0;
          snapPoints2.value = w;
          break;
        }
        case from === 'right': {
          snapPoints1.value = -w;
          snapPoints2.value = 0;
          break;
        }
      }
      mount();
    },
    []
  );

  /**
   * After Component has created by Overlay, this funtion will move the component to destination
   * Just a animation not created
   */
  const mount = useCallback(() => {
    let direction;
    let dest = 0;
    switch (true) {
      case from === 'bottom': {
        direction = true;
        dest = -toHeight.current;
        appearHeight.value = -toHeight.current;
        break;
      }
      case from === 'top': {
        direction = true;
        dest = toHeight.current;
        appearHeight.value = toHeight.current;
        break;
      }
      case from === 'left': {
        direction = false;
        dest = toWidth.current;
        appearWidth.value = toWidth.current;
        break;
      }
      case from === 'right': {
        direction = false;
        dest = -toWidth.current;
        appearWidth.value = -toWidth.current;
        break;
      }
    }

    opacity.value = withTiming(mask ? 0.3 : 0, { duration });
    if (direction) {
      translateY.value = withTiming(dest, { duration }, () => {
        onAppear && runOnJS(onAppear)();
      });
    } else {
      translateX.value = withTiming(dest, { duration }, () => {
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
    switch (true) {
      case from === 'bottom': {
        direction = true;
        dest = 0;
        break;
      }
      case from === 'top': {
        direction = true;
        dest = 0;
        break;
      }
      case from === 'left': {
        direction = false;
        dest = 0;
        break;
      }
      case from === 'right': {
        direction = false;
        dest = 0;
        break;
      }
    }

    opacity.value = withTiming(0, { duration });
    if (direction) {
      translateY.value = withTiming(dest, { duration }, () => {
        onDisappear && runOnJS(onDisappear)();
      });
    } else {
      translateX.value = withTiming(dest, { duration }, () => {
        onDisappear && runOnJS(onDisappear)();
      });
    }
  }, [onDisappear]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const maskAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      backgroundColor: '#000',
    };
  });

  // initial position outof window, this is animation origin point
  const initialPosition = useMemo(() => {
    switch (true) {
      case from === 'bottom':
        return {
          top: height,
          left: 0,
          right: 0,
        };
      case from === 'top':
        return {
          bottom: height,
          left: 0,
          right: 0,
        };
      case from === 'left':
        return {
          top: 0,
          bottom: 0,
          right: width,
        };
      case from === 'right':
        return {
          top: 0,
          bottom: 0,
          left: width,
        };
    }
  }, [from]);

  // invoke useOverlay remove by key
  const removeSelf = useCallback(() => {
    remove(innerKey);
  }, [remove, innerKey]);

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
    .onUpdate(({ translationY, translationX }) => {
      if (!gesture) return;
      if (from === 'bottom' || from === 'top') {
        translateY.value = clamp(
          offset.value + translationY,
          snapPoints1.value,
          snapPoints2.value
        );
      } else {
        translateX.value = clamp(
          offset.value + translationX,
          snapPoints1.value,
          snapPoints2.value
        );
      }
    })
    .onEnd(({ velocityY, velocityX }) => {
      if (!gesture) return;
      let dest;
      if (from === 'bottom' || from === 'top') {
        dest = snapPoint(translateY.value, velocityY, [
          snapPoints1.value,
          snapPoints2.value,
        ]);
        translateY.value = withTiming(dest, { duration });
      } else {
        dest = snapPoint(translateX.value, velocityX, [
          snapPoints1.value,
          snapPoints2.value,
        ]);
        translateX.value = withTiming(dest, { duration });
      }
      if (dest === 0) {
        runOnJS(removeSelf)();
      }
    });

  useImperativeHandle(
    ref,
    () => ({
      mount,
      unMount,
    }),
    []
  );

  return (
    <View style={styles.mask}>
      <TouchableWithoutFeedback
        style={styles.overlay}
        onPress={handleClickMask}
      >
        <Animated.View
          pointerEvents={pointerEvents}
          style={[styles.mask, maskAnimationStyle]}
        />
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
  );
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
  },
});

TranslateContainer.displayName = 'TranslateContainer';

export default TranslateContainer;
