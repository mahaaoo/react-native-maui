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

const TabView: React.FC<TabViewProps> = (props) => {
  const {
    tabBar,
    children,
    renderTabBar,
    initialPage = 0,
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
  const tabStatus = useSharedValue(TabStatus.NoMove);
  const nextIndex = useSharedValue(initialPage);

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
      tabStatus.value = TabStatus.NoMove;
    });
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      offsetX.value = translateX.value;
      tabStatus.value = TabStatus.Moving;
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
      let temp = interpolate(
        page,
        [
          currentIndex.value - 0.5,
          currentIndex.value,
          currentIndex.value + 0.5,
        ],
        [currentIndex.value - 1, currentIndex.value, currentIndex.value + 1],
        Extrapolate.CLAMP
      );

      if (temp < 0) temp = 0;
      if (temp > tabBar.length - 1) temp = tabBar.length - 1;

      if (temp === currentIndex.value) {
        // 本次移动和上次保持一致
        tabStatus.value = TabStatus.StayCurrent;
      } else if (temp > currentIndex.value) {
        // tab向右移动
        tabStatus.value = TabStatus.MoveRight;
      } else {
        // tab向左移动
        tabStatus.value = TabStatus.MoveLeft;
      }

      temp = Math.round(temp);
      nextIndex.value = temp;
      handleMove(temp);
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
        nextIndex,
        translateX,
        initialPage,
        tabStatus,
      }}
    >
      {renderTabBar && renderTabBar()}
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
