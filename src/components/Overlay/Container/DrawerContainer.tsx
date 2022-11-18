/**
 * Component below MainView
 * when it mount, change MainView's translateX
 * only support horizontal direction
 */
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { runOnJS, withTiming } from 'react-native-reanimated';
import { useOverlay } from '../Overlay';
import { BaseContainerProps } from './type';

export interface DrawerContainerRef {
  unMount: (callback?: () => void) => void;
}

interface DrawerContainerProps extends BaseContainerProps {
  position?: 'left' | 'right';
  duration?: number;
}

const DrawerContainer = forwardRef<DrawerContainerRef, DrawerContainerProps>(
  (props, ref) => {
    const {
      position,
      duration = 250,
      onAppear,
      containerStyle,
      children,
      onDisappear,
    } = props;

    const { targetValue, progress } = useOverlay();

    const onLayout = useCallback(
      ({
        nativeEvent: {
          layout: { width: w },
        },
      }) => {
        mount(w);
      },
      []
    );

    const mount = useCallback(
      (w: number) => {
        if (position === 'left') {
          targetValue.value = w;
        } else {
          targetValue.value = -w;
        }

        progress.value = withTiming(1, { duration }, () => {
          onAppear && runOnJS(onAppear)();
        });
      },
      [onAppear]
    );

    const unMount = useCallback(() => {
      progress.value = withTiming(0, { duration }, () => {
        onDisappear && runOnJS(onDisappear)();
      });
    }, [onDisappear, position]);

    const initialPosition = useMemo(() => {
      switch (true) {
        case position === 'left':
          return {
            top: 0,
            bottom: 0,
            left: 0,
          };
        case position === 'right':
          return {
            top: 0,
            bottom: 0,
            right: 0,
          };
      }
    }, [position]);

    useImperativeHandle(
      ref,
      () => ({
        unMount,
      }),
      []
    );

    return (
      <View style={styles.mask}>
        <Animated.View style={[styles.overlay, initialPosition]}>
          <View style={[styles.container, containerStyle]} onLayout={onLayout}>
            {children}
          </View>
        </Animated.View>
      </View>
    );
  }
);

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

DrawerContainer.displayName = 'DrawerContainer';

export default DrawerContainer;
