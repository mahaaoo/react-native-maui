/**
 * Animation effect child component
 */
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSkeletonStyle, BaseChildAnimationProps } from '../type';

const {width: Wwidth} = Dimensions.get('window');

interface ShineProps extends BaseChildAnimationProps {
};

const Shine: React.FC<ShineProps> = props => {
  const {style} = props;
  const {animationProgress, color} = useSkeletonStyle();
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
      style={[style, styles.mask, {backgroundColor: color}]}
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
    flex: 1,
    overflow: 'hidden',
  },
  shineSlider: {
    height: '100%',
    backgroundColor: 'white',
    width: 50,
    opacity: 0.7,
  }
})

export default Shine;
