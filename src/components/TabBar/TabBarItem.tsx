import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TabBarItemProps } from './type';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';

const TabBarItem: React.FC<TabBarItemProps> = (props) => {
  const {
    index,
    title,
    width = 'auto',
    style,
    titleStyle,
    currentIndex,
    onLayout,
    onPress,
  } = props;

  const animatedText = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        currentIndex.value,
        [index - 1, index, index + 1],
        [0.8, 1, 0.8],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          scale: interpolate(
            currentIndex.value,
            [index - 1, index, index + 1],
            [0.9, 1.1, 0.9],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      onPress={() => onPress(index)}
      onLayout={(event) => onLayout(index, event.nativeEvent.layout)}
      style={[styles.container, { width: width }, style]}
    >
      <Animated.Text style={[titleStyle, animatedText]}>{title}</Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: '100%',
  },
});

export default TabBarItem;
