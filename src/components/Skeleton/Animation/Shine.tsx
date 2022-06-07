import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSkeletonStyle } from '../SkeletonContainer';

const {width: Wwidth} = Dimensions.get('window');

interface ShineProps {
};

const Shine: React.FC<ShineProps> = props => {
  const {} = props;
  const {animationProgress} = useSkeletonStyle();
  const width = useSharedValue(Wwidth);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: interpolate(animationProgress.value, [0,1], [-50, width.value])
      }]
    }
  });

  return (
    <View 
      style={[styles.mask]}
      onLayout={({
        nativeEvent: {
          layout: { width: w },
        },
      }) => width.value = w}
    >
      <Animated.View style={[styles.shineSlider, animationStyle]} />
    </View>
  )
};

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D8D8D8',
    flex: 1,
  },
  shineSlider: {
    height: '100%',
    backgroundColor: 'white',
    width: 50,
    opacity: 0.7,
  }
})

export default Shine;
