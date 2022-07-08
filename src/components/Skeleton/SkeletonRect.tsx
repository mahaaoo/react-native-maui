import React from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { BaseChildAnimationProps, useSkeletonStyle } from './type';
import { Normal } from './Animation';

interface SkeletonRectProps {
  style?: ViewStyle;
  delay?: number;
}

const SkeletonRect: React.FC<SkeletonRectProps> = (props) => {
  const { children, style, delay = 1000 } = props;
  const { finished, childAnimation } = useSkeletonStyle();

  const fadeStyle = useAnimatedStyle(() => {
    return {
      opacity: finished ? withTiming(1, { duration: delay }) : 0,
    };
  });

  const Animation: React.FC<BaseChildAnimationProps> = childAnimation || Normal;

  return (
    <View>
      <Animated.View style={[style, fadeStyle]}>{children}</Animated.View>
      {!finished && <Animation style={style} />}
    </View>
  );
};

export default SkeletonRect;
