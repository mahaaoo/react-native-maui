import React from 'react';
import {View, ViewStyle} from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {useSkeletonStyle} from './SkeletonContainer';
import {Breath} from './Animation';

interface SkeletonRectProps {
  style?: ViewStyle
};

const SkeletonRect: React.FC<SkeletonRectProps> = props => {
  const {children, style} = props;
  const {finished, animatedType} = useSkeletonStyle();

  const fadeStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(finished ? 1 : 0, {duration: 500})
    }
  })

  const Animation = animatedType || Breath;

  return (
    <View style={style}>
      <Animated.View style={fadeStyle}>
        {children}
      </Animated.View>
      {
        !finished && <Animation />
      }
    </View>
  )
};

export default SkeletonRect;
