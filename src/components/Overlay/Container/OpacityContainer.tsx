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
  dark?: boolean,
  children: React.ReactNode,
  onAppear?: () => void;
  onDisappear?: () => void;
}

export interface OpacityContainerRef {
  mount: () => void;
}

const OverlayContainer = forwardRef<OpacityContainerRef, OpacityContainerProps>((props, ref) => {
  const {
    children, 
    containerStyle,
    dark = true,
    onAppear,
    onDisappear
  } = props;
  const opacity = useSharedValue(0);

  useEffect(() => {
    mount();
    return () => {
      onDisappear && onDisappear();
    }
  }, []);

  const mount = useCallback(() => {
    opacity.value = withTiming(dark ? 0.3 : 0, {duration: 250}, () => {
      onAppear && runOnJS(onAppear)();
    });
  }, [onAppear]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: dark ? '#000' : 'transparent',
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
