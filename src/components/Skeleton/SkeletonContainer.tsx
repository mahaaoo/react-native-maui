import React, { useContext, useEffect } from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

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
  const fade = useSharedValue(1);

  useEffect(() => {
    // progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    if (finished) {
      fade.value = 1;
    } else {
      fade.value = withRepeat(
        withSequence(withTiming(0, {duration: 1000}), withTiming(1, {duration: 1000})), -1, true, () => {
      })  
    }
  }, [finished])


  const animationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(fade.value, [0,1], ['white', '#D8D8D8'])
    }
  });


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
