import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import {Breath, Shine, Normal, Loading, ShineOver} from './Animation';

type ChildAnimationType = typeof Breath | typeof Shine | typeof Normal;
type ContainerAnimationType = typeof Loading | typeof ShineOver;

interface SkeletonContextProps {
  animationProgress: Animated.SharedValue<number>,
  finished: boolean,
  childAnimation: ContainerAnimationType
}

export const SkeletonContext = React.createContext<SkeletonContextProps>({} as SkeletonContextProps);
export const useSkeletonStyle = () => useContext(SkeletonContext);

interface SkeletonContainerProps {
  childAnimation?: ChildAnimationType;
  containerAnimation?: ContainerAnimationType;
  finished?: boolean;
  reverse?: boolean;
};

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
