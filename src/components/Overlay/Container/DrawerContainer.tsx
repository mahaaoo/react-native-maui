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
  useRef,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { runOnJS, withTiming } from 'react-native-reanimated';
import { useOverlay } from '../Overlay';
import { BaseContainerProps } from './type';

export interface DrawerContainerRef {
  mount: (callback?: () => void) => void;
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
    const { mainTransform } = useOverlay();
    const { mainTranslateX } = mainTransform;

    const toWidth = useRef(0);

    const onLayout = useCallback(
      ({
        nativeEvent: {
          layout: { width: w },
        },
      }) => {
        toWidth.current = w;
        mount();
      },
      []
    );

    const mount = useCallback(() => {
      let dest = 0;
      switch (true) {
        case position === 'left': {
          dest = toWidth.current;
          break;
        }
        case position === 'right': {
          dest = -toWidth.current;
          break;
        }
      }

      mainTranslateX.value = withTiming(dest, { duration }, () => {
        onAppear && runOnJS(onAppear)();
      });
    }, [onAppear]);

    const unMount = useCallback(() => {
      mainTranslateX.value = withTiming(0, { duration }, () => {
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
        mount,
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
