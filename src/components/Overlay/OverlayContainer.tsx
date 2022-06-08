import React, {useLayoutEffect} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface OverlayContainerProps {
  containerStyle?: ViewStyle,
  dark?: boolean
}

const OverlayContainer: React.FC<OverlayContainerProps> = (props) => {
  const {
    children, 
    containerStyle,
    dark = true
  } = props;
  const opacity = useSharedValue(0);

  useLayoutEffect(() => {
    opacity.value = withTiming(0.3, {duration: 250});
  }, []);

  const animationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: dark ? '#000' : 'transparent',
      opacity: opacity.value
    }
  });

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, containerStyle]}>
        {children}
      </View>
      <Animated.View pointerEvents={"none"} style={[styles.overlay, animationStyle]} />
    </View>
  )
}

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
