import React, { useEffect, useMemo } from 'react';
import {View} from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface SpinnerProps {
  activeColor?: string;
  inactiveColor?: string;
  duration?: number;
  size?: number;
  number?: number;
};

const Spinner: React.FC<SpinnerProps> = props => {
  const {activeColor = '#1e90ff', inactiveColor = 'white', duration=1000, size=8, number=3} = props;
  const currentIndex = useSharedValue(0);

  useEffect(() => {
    currentIndex.value = withRepeat(
      withTiming(number-1, {duration}),
      -1,
      false,
    )
  }, [])

  const dot = useMemo(() => {
    return {
      width: size,
      height: size,
      borderRadius: size/2,
      marginHorizontal: 4,  
    }
  }, [size]);

  return (
    <View style={{ flexDirection: 'row' }}>
      {
        new Array(number).fill(0).map((_, index) => {
          const animationStyle = useAnimatedStyle(() => {
            return {
              backgroundColor: interpolateColor(currentIndex.value, [index-1, index, index+1], [inactiveColor, activeColor, inactiveColor]),
            }
          });

          return <Animated.View key={`spinner_dot${index}`} style={[dot, animationStyle]} />
        })
      }
    </View>
  )
};

export default Spinner;
