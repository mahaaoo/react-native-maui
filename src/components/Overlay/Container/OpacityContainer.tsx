/**
 * if use this componet wrapper overlay componet 
 * onAppear will be called when it mount,
 * onDisappear will be called when it unMount
 * when it mount, will play opacity animation
 */
import React, {forwardRef, useCallback, useEffect, useImperativeHandle} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface OpacityContainerProps {
  containerStyle?: ViewStyle,
  mask?: boolean,
  children: React.ReactNode,
  onAppear?: () => void;
  onDisappear?: () => void;
  duration?: number;
}

export interface OpacityContainerRef {
  mount: () => void;
}

const OverlayContainer = forwardRef<OpacityContainerRef, OpacityContainerProps>((props, ref) => {
  const {
    children, 
    containerStyle,
    mask = true,
    onAppear,
    onDisappear,
    duration = 250,
  } = props;
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

  useImperativeHandle(ref, () => ({
    mount,
  }), []);

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, containerStyle]}>
        {children}
      </View>
      <Animated.View pointerEvents={"none"} style={[styles.overlay, animationStyle]} />
    </View>
  )
})

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
})

export default OverlayContainer;
