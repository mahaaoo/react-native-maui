import React, { useContext, useEffect } from 'react';
import {ViewStyle} from 'react-native';
import { withRepeat } from 'react-native-reanimated';
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
  const {animationStyle, animation, animationValue, initialValue, reverse} = useBreath();

  useEffect(() => {
    if (finished) {
      animationValue.value = initialValue;
    } else {
      animationValue.value = withRepeat(
        animation , -1, reverse, () => {
      });
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
