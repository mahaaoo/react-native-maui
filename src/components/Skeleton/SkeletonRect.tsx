import React from 'react';
import {View, ViewStyle, StyleSheet} from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {useSkeletonStyle} from './SkeletonContainer';

interface SkeletonRectProps {
  style?: ViewStyle
};

const SkeletonRect: React.FC<SkeletonRectProps> = props => {
  const {children, style} = props;
  const {animationStyle, finished} = useSkeletonStyle();

  const fadeStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(finished ? 1 : 0, {duration: 500})
    }
  })

  return (
    <View style={style}>
      <Animated.View style={fadeStyle}>
        {children}
      </Animated.View>
      {
        !finished &&  <Animated.View style={[styles.mask, animationStyle]} />
      }
    </View>
  )
};

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white'
  }
})

export default SkeletonRect;
