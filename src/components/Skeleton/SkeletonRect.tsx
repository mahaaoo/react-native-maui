import React from 'react';
import {View, ViewStyle} from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {BaseChildAnimationProps, useSkeletonStyle} from './type';
import {Normal} from './Animation';

interface SkeletonRectProps {
  style?: ViewStyle
};

const SkeletonRect: React.FC<SkeletonRectProps> = props => {
  const {children, style} = props;
  const {finished, childAnimation} = useSkeletonStyle();

  const fadeStyle = useAnimatedStyle(() => {
    return {
      opacity: finished ? withTiming(1, {duration: 500}) : 0
    }
  })

  const Animation: React.FC<BaseChildAnimationProps> = childAnimation || Normal;

  return (
    <View style={style}>
      <Animated.View style={fadeStyle}>
        {children}
      </Animated.View>
      {
        !finished && <Animation style={style} />
      }
    </View>
  )
};

export default SkeletonRect;
