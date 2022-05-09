import React, {useRef, useEffect, useLayoutEffect, useCallback} from 'react';
import {View, StyleSheet, Animated, ViewStyle} from 'react-native';

interface OverlayContainerProps {
  opacity?: number;
  containerStyle?: ViewStyle
}

const OverlayContainer: React.FC<OverlayContainerProps> = (props) => {
  const {
    children, 
    opacity = 0.3,
    containerStyle,
  } = props;
  const opacityRef = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    appear();
  }, []);

  const appear = useCallback(() => {
    opacityRef.setValue(0);
    Animated.timing(opacityRef, {
      toValue: opacity,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const disappear = useCallback(() => {
    Animated.timing(opacityRef, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.overlay}>
      <Animated.View pointerEvents={"none"} style={[styles.overlay, {backgroundColor: '#000', opacity: opacityRef}]} />
      <View style={[styles.container, containerStyle]}>
        {children}
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
})

export default OverlayContainer;
