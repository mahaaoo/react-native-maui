import React, { useContext, useEffect } from 'react';
import Animated, { Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import {Breath, Shine, Normal} from './Animation';

type AnimatedType = typeof Breath | typeof Shine | typeof Normal;

interface SkeletonContextProps {
  animationProgress: Animated.SharedValue<number>,
  finished: boolean,
  animatedType: AnimatedType
}

export const SkeletonContext = React.createContext<SkeletonContextProps>({} as SkeletonContextProps);
export const useSkeletonStyle = () => useContext(SkeletonContext);

interface SkeletonContainerProps {
  animatedType?: AnimatedType;
  finished?: boolean;
  reverse?: boolean;
};

const SkeletonContainer: React.FC<SkeletonContainerProps> = props => {
  const {children, finished = false, reverse = true, animatedType = Breath} = props;
  const initialValue = 0;
  const toValue = 1;
  const animationProgress = useSharedValue(initialValue);

  useEffect(() => {
    animationProgress.value = withRepeat(withTiming(toValue, {duration: 1000, easing: Easing.bezier(0.65, 0, 0.35, 1)}) , -1, reverse);
  }, [reverse])

  return (
    <SkeletonContext.Provider value={{
      finished,
      animationProgress,
      animatedType
    }}>
      {children}
    </SkeletonContext.Provider>
  )
};



export default SkeletonContainer;
