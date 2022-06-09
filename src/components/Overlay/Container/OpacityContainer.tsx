/**
 * if use this componet wrapper overlay componet 
 * onAppear will be called when it mount,
 * onDisappear will be called when it unMount
 * when it mount, will play opacity animation
 */
import React, {forwardRef, useCallback, useEffect, useImperativeHandle} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useOverlay } from '../Overlay';
import { AnimationContainerProps } from './type';

interface OpacityContainerProps extends AnimationContainerProps {
}

export interface OpacityContainerRef {
  mount: () => void;
}

const OverlayContainer = forwardRef<OpacityContainerRef, OpacityContainerProps>((props, ref) => {
  const {
    children, 
    onAppear, 
    onDisappear, 
    mask = true, 
    duration = 250,
    modal = false,
    onClickMask,
    pointerEvents='auto',
    innerKey,
    containerStyle
  } = props;
  const {remove} = useOverlay();
  const opacity = useSharedValue(0);

  useEffect(() => {
    mount();
    return () => {
      onDisappear && onDisappear();
    }
  }, []);

  const mount = useCallback(() => {
    opacity.value = withTiming(mask ? 0.3 : 0, {duration}, () => {
      onAppear && runOnJS(onAppear)();
    });
  }, [onAppear]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: '#000',
      opacity: opacity.value
    }
  });

  const handleClickMask = useCallback(() => {
    if (pointerEvents === 'none') return;
    if (!modal && pointerEvents === 'auto') {
      remove(innerKey);
    }
    onClickMask && onClickMask();
  }, []);

  useImperativeHandle(ref, () => ({
    mount,
  }), []);

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, containerStyle]}>
        {children}
      </View>
      <TouchableWithoutFeedback style={styles.overlay} onPress={handleClickMask}>
        <Animated.View pointerEvents={pointerEvents} style={[styles.overlay, animationStyle]} />
      </TouchableWithoutFeedback>
    </View>
  )
})

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1, 
  }
})

export default OverlayContainer;
