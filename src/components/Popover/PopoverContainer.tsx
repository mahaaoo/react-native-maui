import React, { forwardRef, useCallback, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { BaseContainerProps } from '../Overlay';
import { Position, Placement, ArrowPlacement } from './type';
import { getPosition } from './utils';
import { useForceUpdate } from '../../utils/hooks';

interface PopoverContainerRef {}

interface PopoverContainerProps extends BaseContainerProps {
  position: Position;
  arrowPosition: ArrowPlacement;
  placement: Placement;
  arrowSize: number;
  arrowColor: string;
  onPressMask?: () => void;
}

const PopoverContainer = forwardRef<PopoverContainerRef, PopoverContainerProps>(
  (props, ref) => {
    const {
      children,
      position,
      placement,
      arrowSize,
      arrowColor,
      onPressMask,
      arrowPosition,
    } = props;
    const opacity = useSharedValue(0);
    const popoverPosition = useRef({});
    const arrowStyle = useRef({
      borderWidth: arrowSize,
    });
    const { forceUpdate } = useForceUpdate();

    const handleLayout = useCallback(({ nativeEvent: { layout } }) => {
      const { popover, arrow } = getPosition(
        position,
        layout,
        arrowSize,
        arrowColor,
        placement,
        arrowPosition
      );
      popoverPosition.current = popover;
      arrowStyle.current = {
        ...arrowStyle.current,
        ...arrow,
      };
      forceUpdate();
      opacity.value = 1;
    }, []);

    const handleClickMask = useCallback(() => {
      onPressMask && onPressMask();
    }, []);

    const animationStyle = useAnimatedStyle(() => {
      return {
        position: 'absolute',
        opacity: opacity.value,
      };
    });

    return (
      <View style={styles.overlay}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={handleClickMask}
        >
          <View pointerEvents={'none'} style={[styles.overlay]} />
        </TouchableOpacity>
        <Animated.View
          style={[popoverPosition.current, animationStyle]}
          onLayout={handleLayout}
        >
          {children}
        </Animated.View>
        <Animated.View
          style={[styles.arrow, arrowStyle.current, animationStyle]}
        />
      </View>
    );
  }
);

PopoverContainer.displayName = 'PopoverContainer';

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  arrow: {
    width: 0,
    height: 0,
    borderColor: 'transparent',
  },
});

export default PopoverContainer;
