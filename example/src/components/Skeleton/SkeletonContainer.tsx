import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import {Normal} from './Animation';
import {SkeletonContext, SkeletonContainerProps} from './type';

const SkeletonContainer: React.FC<SkeletonContainerProps> = props => {
  const {children, finished = false, reverse = true, childAnimation = Normal, containerAnimation} = props;
  const initialValue = 0;
  const toValue = 1;
  const animationProgress = useSharedValue(initialValue);

  useEffect(() => {
    animationProgress.value = withRepeat(withTiming(toValue, {duration: 1000, easing: Easing.bezier(0.65, 0, 0.35, 1)}) , -1, reverse);
  }, [reverse])

  const Animation = containerAnimation || View;

  return (
    <SkeletonContext.Provider value={{
      finished,
      animationProgress,
      childAnimation
    }}>
      <View>
        {children}
        {
          !finished && <Animation />
        }
      </View>
    </SkeletonContext.Provider>
  )
};

export default SkeletonContainer;
