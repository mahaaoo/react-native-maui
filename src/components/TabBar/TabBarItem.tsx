import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { TabBarItemProps } from './type';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

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
    activeScale = 1,
    onLayout,
    onPress,
  } = props;

  const input = useMemo(() => [index - 1, index, index + 1], [index]);

  const animatedText = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        currentIndex.value,
        input,
        [0.8, 1, 0.8],
        Extrapolation.CLAMP
      ),
      color: interpolateColor(
        currentIndex.value,
        input,
        [inactiveTextColor, activeTextColor, inactiveTextColor],
        'RGB'
      ),
      transform: [
        {
          scale: interpolate(
            currentIndex.value,
            input,
            [1, activeScale, 1],
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
      activeOpacity={1}
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
