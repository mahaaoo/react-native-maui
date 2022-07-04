/**
 * Animation effect child component
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSkeletonStyle, BaseChildAnimationProps } from '../type';

interface BreathProps extends BaseChildAnimationProps {
};

const Breath: React.FC<BreathProps> = props => {
  const {style} = props;
  const {animationProgress, color} = useSkeletonStyle();

  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animationProgress.value, [0, 1], [0.6, 1])
    }
  });

  return (
    <Animated.View style={[style, styles.mask, { backgroundColor: color }, animationStyle]} />
  )
};

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject
  }
})

export default Breath;
