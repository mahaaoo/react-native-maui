import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTabView } from './type';

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

  const { contentWidth } = useTabView();

  const tabbarTitleColor = useAnimatedStyle(() => {
    const active = -translateX.value / contentWidth.value;
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

interface DefaultTabBarProps {
  tabBarUnderlineStyle?: ViewStyle;
  tabBarActiveTextColor?: string;
  tabBarInactiveTextColor?: string;
  tabBarTextStyle?: TextStyle;
  tabBarWidth?: number;
}

const DefaultTabBar: React.FC<DefaultTabBarProps> = (props) => {
  const {
    tabBarUnderlineStyle,
    tabBarActiveTextColor,
    tabBarInactiveTextColor,
    tabBarTextStyle,
    tabBarWidth = 100,
  } = props;

  const {
    tabBar,
    handleMove,
    contentWidth,
    translateX,
    initialPage,
    next,
    // currentIndex,
    // tabStatus,
  } = useTabView();

  // Tabbar Container translateX, Make sure tabbar's and slider's position around middle of container
  let defaultContainerOffset = 0;
  if (initialPage * tabBarWidth >= contentWidth.value / 2) {
    defaultContainerOffset =
      -initialPage * tabBarWidth + contentWidth.value / 2;
  }
  const containerOffset = useSharedValue(defaultContainerOffset);

  // Slider translateX
  let defaultTabOffset = initialPage * tabBarWidth;
  if (initialPage * tabBarWidth >= contentWidth.value / 2) {
    defaultTabOffset = contentWidth.value / 2;
  }
  const tabOffset = useSharedValue(defaultTabOffset);

  const handleTabMove = useCallback((nextIndex: number) => {
    'worklet';
    let dest = interpolate(
      -Math.round(nextIndex) * contentWidth.value,
      [0, -contentWidth.value * tabBar.length],
      [0, tabBarWidth * tabBar.length]
    );

    /**
     * Control slider stay in the middle
     * if over middle of screen width, move tabbar
     */
    if (dest > contentWidth.value / 2) {
      const adjust = Math.min(
        contentWidth.value - tabBarWidth * (nextIndex + 1 + 1),
        0
      );
      dest += adjust;
      if (nextIndex + 1 + 1 <= tabBar.length) {
        containerOffset.value = withTiming(adjust);
      } else {
        dest += tabBarWidth;
      }
    } else {
      containerOffset.value = withTiming(0);
    }

    tabOffset.value = withTiming(dest);
  }, []);

  useAnimatedReaction(
    () => next.value,
    (value) => {
      handleTabMove(value);
    }
  );

  const tabContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: containerOffset.value,
        },
      ],
    };
  });

  const animatedTarbarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: tabOffset.value,
        },
      ],
    };
  });

  return (
    <View style={{ backgroundColor: 'white' }}>
      <Animated.View
        style={[
          styles.tarbarContainer,
          {
            width: tabBarWidth * tabBar.length,
          },
          tabContainerStyle,
        ]}
      >
        {tabBar.map((item, index) => {
          return (
            <TabViewBar
              key={`tab_index_${index}`}
              index={index}
              translateX={translateX}
              tabWidth={tabBarWidth}
              onPress={(index: number) => {
                handleTabMove(index);
                handleMove && handleMove(index);
              }}
              {...{
                tabBarActiveTextColor,
                tabBarInactiveTextColor,
                tabBarTextStyle,
              }}
            >
              {item}
            </TabViewBar>
          );
        })}
      </Animated.View>
      <Animated.View
        style={[
          styles.slider,
          { width: tabBarWidth - 40 },
          tabBarUnderlineStyle,
          animatedTarbarStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabbarItem: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tarbarContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  slider: {
    height: 2,
    marginLeft: 20,
    backgroundColor: '#1e90ff',
  },
});

export default DefaultTabBar;
