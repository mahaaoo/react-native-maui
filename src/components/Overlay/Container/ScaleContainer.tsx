import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useOverlay } from '../Overlay';

import { AnimationContainerProps } from './type';

interface ScaleContainerRef {
  mount: (callback?: () => void) => void;
  unMount: (callback?: () => void) => void;
}

interface ScaleContainerProps extends AnimationContainerProps {}

const ScaleContainer = forwardRef<ScaleContainerRef, ScaleContainerProps>(
  (props, ref) => {
    const {
      children,
      onClickMask,
      pointerEvents = 'auto',
      mask = true,
      duration = 250,
      onAppear,
      onDisappear,
      modal = false,
      innerKey,
    } = props;
    const { remove } = useOverlay();
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.5);

    useEffect(() => {
      mount();
    }, []);

    const mount = useCallback(() => {
      opacity.value = withTiming(mask ? 0.3 : 0, { duration });
      scale.value = withTiming(1, { duration }, () => {
        onAppear && runOnJS(onAppear)();
      });
    }, [onAppear]);

    const unMount = useCallback(() => {
      opacity.value = withTiming(0, { duration });
      scale.value = withTiming(0.5, { duration }, () => {
        onDisappear && runOnJS(onDisappear)();
      });
    }, [onDisappear]);

    const animationStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: '#000',
        opacity: opacity.value,
      };
    });

    const scaleStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          scale.value,
          [0.5, 1],
          [0, 1],
          Extrapolation.CLAMP
        ),
        transform: [
          {
            scale: scale.value,
          },
        ],
      };
    });

    const handleClickMask = useCallback(() => {
      if (pointerEvents === 'none') return;
      if (!modal && pointerEvents === 'auto') {
        remove(innerKey);
      }
      onClickMask && onClickMask();
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        mount,
        unMount,
      }),
      []
    );

    return (
      <View style={styles.overlay}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={handleClickMask}
        >
          <Animated.View
            pointerEvents={pointerEvents}
            style={[styles.overlay, animationStyle]}
          />
        </TouchableOpacity>
        <Animated.View
          style={[styles.container, scaleStyle]}
          pointerEvents={'box-none'}
        >
          {children}
        </Animated.View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

ScaleContainer.displayName = 'ScaleContainer';

export default ScaleContainer;
