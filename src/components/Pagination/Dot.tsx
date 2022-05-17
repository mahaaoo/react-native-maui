import React from 'react';
import Animated, {Extrapolate, interpolate, useAnimatedStyle} from 'react-native-reanimated'

interface DotProps {
  index: number;
  currentIndex: Animated.SharedValue<number>;
}

const Dot: React.FC<DotProps> = (props) => {
  const {currentIndex, index} = props;

  const style = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];
    const opacity = interpolate(currentIndex.value, inputRange, [0.5, 1, 0.5], Extrapolate.CLAMP);
    const scale = interpolate(currentIndex.value, inputRange, [1, 1.25, 1], Extrapolate.CLAMP);
  
    return {
      opacity,
      transform: [{scale}]
    }
  })

  return (
    <Animated.View
      style={[{ 
        backgroundColor: 'white', 
        width: 8, 
        height: 8, 
        borderRadius: 4, 
        margin: 4,
      }, style]}
    />
  )
}

export default Dot;
