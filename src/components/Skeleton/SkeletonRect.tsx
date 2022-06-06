import React from 'react';
import {View, ViewStyle, StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import {useSkeletonStyle} from './SkeletonContainer';

interface SkeletonRectProps {
  style?: ViewStyle
};

const SkeletonRect: React.FC<SkeletonRectProps> = props => {
  const {children, style} = props;
  const {animationStyle, finished} = useSkeletonStyle();

  return (
    <View style={[style]}>
      {children}
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
