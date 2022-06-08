import React, {forwardRef, useCallback, useEffect, useImperativeHandle} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface OverlayContainerProps {
  containerStyle?: ViewStyle,
  dark?: boolean,
  children: React.ReactNode
}

export interface OverlayContainerRef {
  mount: (callback?: () => void) => void;
  unMount?: (callback?: () => void) => void;
}

const OverlayContainer = forwardRef<OverlayContainerRef, OverlayContainerProps>((props, ref) => {
  const {
    children, 
    containerStyle,
    dark = true
  } = props;
  const opacity = useSharedValue(0);

  useEffect(() => {
    mount();
  }, []);

  const mount = useCallback((callback?) => {
    opacity.value = withTiming(0.3, {duration: 250}, () => {
      callback && callback();
    });
  }, []);

  // const unMount = useCallback((callback?) => {
    // opacity.value = withTiming(0, {duration: 250}, () => {
    //   callback && callback();
    // });
  // }, []);

  const animationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: dark ? '#000' : 'transparent',
      opacity: opacity.value
    }
  });

  useImperativeHandle(ref, () => ({
    mount,
    // unMount,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
})

export default OverlayContainer;
