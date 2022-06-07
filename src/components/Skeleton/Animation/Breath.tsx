import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { useSkeletonStyle } from '../SkeletonContainer';

interface BreathProps {
};

const Breath: React.FC<BreathProps> = props => {
  const {} = props;
  const {animationProgress} = useSkeletonStyle();

  const animationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(animationProgress.value, [0, 1], ['#F8F8F8', '#D8D8D8'])
    }
  });

  return (
    <Animated.View style={[styles.mask, animationStyle]} />
  )
};

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D8D8D8'
  }
})

export default Breath;
