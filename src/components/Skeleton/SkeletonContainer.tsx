import React, { useContext, useEffect } from 'react';
import {ViewStyle} from 'react-native';
import { useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import {useBreath} from './hook';

interface SkeletonContextProps {
  animationStyle: ViewStyle,
  finished: boolean
}

export const SkeletonContext = React.createContext<SkeletonContextProps>({} as SkeletonContextProps);
export const useSkeletonStyle = () => useContext(SkeletonContext);

interface SkeletonContainerProps {
  animatedType?: string;
  finished?: boolean;
};

const SkeletonContainer: React.FC<SkeletonContainerProps> = props => {
  const {children, finished = false} = props;
  const initialValue = 1;
  const toValue = 0;
  const animationProgress = useSharedValue(initialValue);

  const {animationStyle, reverse} = useBreath(animationProgress);

  useEffect(() => {
    if (finished) {
      animationProgress.value = initialValue;
    } else {
      animationProgress.value = withRepeat(
        withSequence(withTiming(toValue, {duration: 1000}), withTiming(initialValue, {duration: 1000})) , -1, reverse);
    }
  }, [finished])

  return (
    <SkeletonContext.Provider value={{
      animationStyle,
      finished
    }}>
      {children}
    </SkeletonContext.Provider>
  )
};



export default SkeletonContainer;
