import React, { useCallback, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';

import {
  TabViewContext,
  TabViewProps,
  TabStatus,
  TabViewRef,
} from '../TabView/type';
import TabViewContainer from '../TabView/TabViewContainer';
import DefaultTabBar from '../TabView/DefaultTabBar';

const TabView = forwardRef<TabViewRef, TabViewProps>((props, ref) => {
  const {
    tabBar,
    children,
    renderTabBar = () => <DefaultTabBar />,
    initialPage = 0,
    onChangeTab,
    style,
    canSwipe,
    scrollY,
  } = props;
  const contentWidth = useSharedValue(0);

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
      onChangeTab && runOnJS(onChangeTab)(value);
    }
  );

  // Every gesture move end and press tabbar will be invoked
  const handleMove = useCallback((index: number) => {
    'worklet';
    if (index < 0) index = 0;
    if (index > tabBar.length - 1) index = tabBar.length - 1;

    if (index === currentIndex.value) {
      tabStatus.value = TabStatus.StayCurrent;
    } else if (index > currentIndex.value) {
      tabStatus.value = TabStatus.MoveRight;
    } else {
      tabStatus.value = TabStatus.MoveLeft;
    }
    index = Math.round(index);
    nextIndex.value = index;
    translateX.value = withTiming(-index * contentWidth.value, {}, () => {
      currentIndex.value = index;
      tabStatus.value = TabStatus.NoMove;
      canSwipe.value = 0;
    });
  }, []);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onBegin(() => {
      // console.log('接受');
    })
    .onStart(() => {
      // console.log('onStart', canSwipe.value);
      if (canSwipe.value === 0) {
        offsetX.value = translateX.value;
        tabStatus.value = TabStatus.Moving;
        canSwipe.value = 2;
      }
    })
    .onUpdate(({ translationX }) => {
      if (canSwipe.value !== 1) {
        translateX.value = translationX + offsetX.value;
      }

      // TODO: update tabOffset immediately
      // tabOffset.value = interpolate(
      //   translateX.value,
      //   [0, -TOTAL_WIDTH],
      //   [0, TABBAR_WIDTH * tabBar.length]
      // );
    })
    .onEnd(({ velocityX }) => {
      if (canSwipe.value !== 1) {
        const page = -(translateX.value + 0.2 * velocityX) / contentWidth.value;
        const temp = interpolate(
          page,
          [
            currentIndex.value - 0.5,
            currentIndex.value,
            currentIndex.value + 0.5,
          ],
          [currentIndex.value - 1, currentIndex.value, currentIndex.value + 1],
          Extrapolate.CLAMP
        );
        handleMove(temp);
      }
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

  useImperativeHandle(
    ref,
    () => ({
      scrollTo: handleMove,
      previous: () => handleMove(currentIndex.value - 1),
      next: () => handleMove(currentIndex.value + 1),
    }),
    [handleMove]
  );

  const sticyStyle = useAnimatedStyle(() => {
    return {
      height: 44,
      zIndex: 99,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 100, 101],
            [0, 0, scrollY.value - 100],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

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
      <View style={[style]}>
        <Animated.View style={sticyStyle}>
          {renderTabBar && renderTabBar()}
        </Animated.View>
        <View onLayout={onLayout} style={[styles.main]}>
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.contentContainer,
                { width: contentWidth.value * tabBar.length },
                animatedStyle,
              ]}
            >
              {children &&
                children.map((component, index) => {
                  return (
                    <TabViewContainer
                      key={`TabViewItem_${index}`}
                      index={index}
                    >
                      {component}
                    </TabViewContainer>
                  );
                })}
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </TabViewContext.Provider>
  );
});

const styles = StyleSheet.create({
  main: {
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
  },
});

export default TabView;
