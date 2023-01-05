import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
interface TabViewBarProps {
  index: number;
  translateX: Animated.SharedValue<number>;
  onPress: (index: number) => void;
  tabBarActiveTextColor?: string;
  tabBarInactiveTextColor?: string;
  tabBarTextStyle?: TextStyle;
  tabWidth: number;
}

const TabViewBar: React.FC<TabViewBarProps> = (props) => {
  const {
    index,
    translateX,
    onPress,
    children,
    tabBarActiveTextColor = '#1e90ff',
    tabBarInactiveTextColor = 'black',
    tabBarTextStyle,
    tabWidth,
  } = props;

  const tabbarTitleColor = useAnimatedStyle(() => {
    const active = -translateX.value / width;
    return {
      color: interpolateColor(
        active,
        [index - 1, index, index + 1],
        [
          tabBarInactiveTextColor,
          tabBarActiveTextColor,
          tabBarInactiveTextColor,
        ]
      ),
    };
  });

  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress(index);
      }}
      style={[styles.tabbarItem, { width: tabWidth }]}
    >
      <Animated.Text style={[tabBarTextStyle, tabbarTitleColor]}>
        {children}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabbarItem: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabViewBar;
