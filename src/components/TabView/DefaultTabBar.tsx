import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextStyle,
  View,
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

const { width } = Dimensions.get('window');
const TABBAR_WIDTH = 100;

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

const DefaultTabBar = () => {
  const {
    tabBar,
    handleMove,
    contentWidth,
    translateX,
    initialPage,
    tabBarUnderlineStyle,
    tabBarActiveTextColor,
    tabBarInactiveTextColor,
    tabBarTextStyle,
    next,
    // currentIndex,
    // tabStatus,
  } = useTabView();

  // Tabbar Container translateX, Make sure tabbar's and slider's position around middle of container
  let defaultContainerOffset = 0;
  if (initialPage * TABBAR_WIDTH >= contentWidth.value / 2) {
    defaultContainerOffset =
      -initialPage * TABBAR_WIDTH + contentWidth.value / 2;
  }
  const containerOffset = useSharedValue(defaultContainerOffset);

  // Slider translateX
  let defaultTabOffset = initialPage * TABBAR_WIDTH;
  if (initialPage * TABBAR_WIDTH >= contentWidth.value / 2) {
    defaultTabOffset = contentWidth.value / 2;
  }
  const tabOffset = useSharedValue(defaultTabOffset);

  const handleTabMove = useCallback((nextIndex: number) => {
    'worklet';
    let dest = interpolate(
      -Math.round(nextIndex) * contentWidth.value,
      [0, -contentWidth.value * tabBar.length],
      [0, TABBAR_WIDTH * tabBar.length]
    );

    /**
     * Control slider stay in the middle
     * if over middle of screen width, move tabbar
     */
    if (dest > contentWidth.value / 2) {
      const adjust = Math.min(
        contentWidth.value - TABBAR_WIDTH * (nextIndex + 1 + 1),
        0
      );
      dest += adjust;
      if (nextIndex + 1 + 1 <= tabBar.length) {
        containerOffset.value = withTiming(adjust);
      } else {
        dest += TABBAR_WIDTH;
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
            width: TABBAR_WIDTH * tabBar.length,
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
              tabWidth={TABBAR_WIDTH}
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
        style={[styles.slider, tabBarUnderlineStyle, animatedTarbarStyle]}
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
    width: TABBAR_WIDTH - 40,
    marginLeft: 20,
    backgroundColor: '#1e90ff',
  },
});

export default DefaultTabBar;
