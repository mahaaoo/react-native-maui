import React, { useCallback } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated';

import TabViewContainer from './TabViewContainer';
import TabViewBar from './TabViewBar';

const TABBAR_WIDTH = 100;

interface TabViewProps {
  tabBar: Array<string>;
  children: Array<React.ReactNode>;

  onChangeTab?: (index: number) => void;
  initialPage?: number;
  tabBarUnderlineStyle?: ViewStyle;
  tabBarActiveTextColor?: string;
  tabBarInactiveTextColor?: string;
  tabBarTextStyle?: TextStyle;
}

const TabView: React.FC<TabViewProps> = (props) => {
  const {
    tabBar,
    children,
    initialPage = 0,
    tabBarUnderlineStyle,
    tabBarActiveTextColor,
    tabBarInactiveTextColor,
    tabBarTextStyle,
    onChangeTab,
  } = props;
  const contentWidth = useSharedValue(0);
  const totalWidth = useDerivedValue(() => {
    return contentWidth.value * tabBar.length;
  });

  // TabView Content translateX
  const translateX = useSharedValue(-initialPage * contentWidth.value);
  const offsetX = useSharedValue(0);

  // Current TabView Index
  const currentIndex = useSharedValue(initialPage);

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

  useAnimatedReaction(
    () => currentIndex.value,
    (value) => {
      onChangeTab && onChangeTab(value);
    }
  );

  // Every gesture move end and press tabbar will be invoked
  const handleMove = useCallback((nextIndex: number) => {
    'worklet';
    let dest = interpolate(
      -Math.round(nextIndex) * contentWidth.value,
      [0, -totalWidth.value],
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
    translateX.value = withTiming(-nextIndex * contentWidth.value, {}, () => {
      currentIndex.value = nextIndex;
    });
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      offsetX.value = translateX.value;
    })
    .onUpdate(({ translationX }) => {
      translateX.value = translationX + offsetX.value;

      // TODO: update tabOffset immediately
      // tabOffset.value = interpolate(
      //   translateX.value,
      //   [0, -TOTAL_WIDTH],
      //   [0, TABBAR_WIDTH * tabBar.length]
      // );
    })
    .onEnd(({ velocityX }) => {
      const page = -(translateX.value + 0.2 * velocityX) / contentWidth.value;
      let nextIndex = interpolate(
        page,
        [
          currentIndex.value - 0.5,
          currentIndex.value,
          currentIndex.value + 0.5,
        ],
        [currentIndex.value - 1, currentIndex.value, currentIndex.value + 1],
        Extrapolate.CLAMP
      );

      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex > tabBar.length - 1) nextIndex = tabBar.length - 1;

      nextIndex = Math.round(nextIndex);
      handleMove(nextIndex);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

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

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width: w },
      },
    }) => {
      contentWidth.value = w;
    },
    []
  );

  return (
    <View onLayout={onLayout} style={[styles.main]}>
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
                onPress={(index: number) => handleMove(index)}
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
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.contentContainer,
            { width: totalWidth.value },
            animatedStyle,
          ]}
        >
          {children &&
            children.map((component, index) => {
              return (
                <TabViewContainer
                  key={`TabViewItem_${index}`}
                  contentWidth={contentWidth}
                  currentIndex={currentIndex}
                  index={index}
                >
                  {component}
                </TabViewContainer>
              );
            })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    overflow: 'hidden',
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
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default TabView;
