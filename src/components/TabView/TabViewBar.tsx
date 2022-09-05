import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const TABBAR_WIDTH = 120;

interface TabViewBarProps {
  index: number;
  translateX: Animated.SharedValue<number>;
  onPress: (index: number) => void;
}

const TabViewBar: React.FC<TabViewBarProps> = (props) => {
  const { index, translateX, onPress, children } = props;

  const tabbarTitleColor = useAnimatedStyle(() => {
    const active = -translateX.value / width;
    return {
      color: interpolateColor(
        active,
        [index - 1, index, index + 1],
        ['black', '#1e90ff', 'black']
      ),
    };
  });

  return (
    <TouchableOpacity
      onPress={() => {
        onPress(index);
      }}
      style={styles.tabbarItem}
    >
      <Animated.Text style={tabbarTitleColor}>{children}</Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabbarItem: {
    width: TABBAR_WIDTH,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabViewBar;
