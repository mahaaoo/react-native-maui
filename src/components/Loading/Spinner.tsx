import React, { useEffect } from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface SpinnerProps {
};

const Spinner: React.FC<SpinnerProps> = props => {
  const {} = props;
  const currentIndex = useSharedValue(0);

  useEffect(() => {
    currentIndex.value = withRepeat(
      withTiming(2, {duration: 1000}),
      -1,
      false,
    )
  }, [])

  return (
    <View style={{ flexDirection: 'row' }}>
      {
        new Array(3).fill(0).map((_, index) => {
          const animationStyle = useAnimatedStyle(() => {
            return {
              backgroundColor: interpolateColor(currentIndex.value, [index-1, index, index+1], ['white', '#1e90ff', 'white']),
            }
          });

          return <Animated.View key={`spinner_dot${index}`} style={[styles.dot, animationStyle]} />
        })
      }
    </View>
  )
};

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  }
})

export default Spinner;
