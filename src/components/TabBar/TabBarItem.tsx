import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { TabBarItemProps } from './type';
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

const TabBarItem: React.FC<TabBarItemProps> = (props) => {
  const {
    index,
    title,
    width = 'auto',
    style,
    titleStyle,
    currentIndex,
    activeTextColor = 'black',
    inactiveTextColor = 'black',  
    onLayout,
    onPress,
  } = props;

  const input = [index - 1, index, index + 1];

  const animatedText = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        currentIndex.value,
        input,
        [0.8, 1, 0.8],
        Extrapolation.CLAMP
      ),
      color: interpolateColor(currentIndex.value, input, [inactiveTextColor, activeTextColor, inactiveTextColor], 'RGB'),
      transform: [
        {
          scale: interpolate(
            currentIndex.value,
            input,
            [0.9, 1, 0.9],
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
