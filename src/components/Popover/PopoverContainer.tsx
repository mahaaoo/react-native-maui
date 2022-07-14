import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { BaseContainerProps } from '../Overlay';
import { Position, Placement, ArrowPlacement } from './type';
import { getPosition } from './utils';

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
    const arrowStyle = useRef({});
    const [_, forceUpdate] = useState(0);

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
      arrowStyle.current = arrow;
      forceUpdate((update) => update + 1);
      opacity.value = 1;
    }, []);

    const handleClickMask = useCallback(() => {
      onPressMask && onPressMask();
    }, []);

    const animationStyle = useAnimatedStyle(() => {
      return {
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
          style={[
            { position: 'absolute' },
            popoverPosition.current,
            animationStyle,
          ]}
          onLayout={handleLayout}
        >
          {children}
        </Animated.View>
        <View style={[styles.arrow, arrowStyle.current]} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
  },
});

export default PopoverContainer;
