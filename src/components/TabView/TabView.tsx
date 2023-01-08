import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
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

import { TabViewContext, TabViewProps, TabStatus } from './type';
import TabViewContainer from './TabViewContainer';
import DefaultTabBar from './DefaultTabBar';

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
  const tabStatus = useSharedValue(TabStatus.Normal);
  const next = useSharedValue(initialPage);

  useAnimatedReaction(
    () => currentIndex.value,
    (value) => {
      onChangeTab && onChangeTab(value);
    }
  );

  // Every gesture move end and press tabbar will be invoked
  const handleMove = useCallback((nextIndex: number) => {
    'worklet';
    translateX.value = withTiming(-nextIndex * contentWidth.value, {}, () => {
      currentIndex.value = nextIndex;
    });
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      offsetX.value = translateX.value;
      tabStatus.value = TabStatus.Scrolling;
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
      next.value = nextIndex;
      tabStatus.value = TabStatus.Normal;
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
    <TabViewContext.Provider
      value={{
        tabBar,
        handleMove,
        contentWidth,
        currentIndex,
        next,
        translateX,
        initialPage,
        tabBarUnderlineStyle,
        tabBarActiveTextColor,
        tabBarInactiveTextColor,
        tabBarTextStyle,
        tabStatus,
      }}
    >
      <DefaultTabBar />
      <View onLayout={onLayout} style={[styles.main]}>
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
                  <TabViewContainer key={`TabViewItem_${index}`} index={index}>
                    {component}
                  </TabViewContainer>
                );
              })}
          </Animated.View>
        </GestureDetector>
      </View>
    </TabViewContext.Provider>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default TabView;
