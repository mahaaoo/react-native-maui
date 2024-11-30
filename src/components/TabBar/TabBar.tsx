import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { View, ScrollView, LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import TabBarItem from './TabBarItem';
import TabBarSlider from './TabBarSlider';
import Separator from './Separator';

import { TabBarProps, TabBarItemLayout, TabBarRef } from './type';
import { useVerifyProps } from './hook';
import { isInteger } from '../../utils/typeUtil';

const TabBar = forwardRef<TabBarRef, TabBarProps>((props, ref) => {
  const {
    tabs,
    style,
    tabBarflex = 'auto',
    spacing = 0,
    showSeparator = false,
    tabScrollEnabled = true,
    hideSlider = false,
    defaultSliderStyle,
    tabBarItemStyle,
    tabBarItemTitleStyle,
    separatorComponent,
    sliderComponent,
    onTabPress,
    onLayout,
    activeTextColor,
    inactiveTextColor,

    initialTab = 0,
    defalutSliderWidth,
    contentSize,
  } = useVerifyProps(props);

  const currentIndex = useSharedValue(initialTab);
  const sliderOffset = useSharedValue(0);
  const scrollSize = useRef(0);
  const scrollRef = useRef<ScrollView>(null);
  const layouts = useRef<TabBarItemLayout[]>([]).current;
  const sliderWidth = useRef(defalutSliderWidth);
  const sliderOutput = useRef<number[]>([]);
  const intput = tabs.map((_, index) => index);

  useImperativeHandle(
    ref,
    () => ({
      setTab: handleOnPress,
      getCurrent: () => currentIndex.value,
      syncCurrentIndex,
      keepScrollViewMiddle,
    }),
    []
  );

  const syncCurrentIndex = (offset: number) => {
    const index = offset / contentSize;
    currentIndex.value = index;
    sliderOffset.value = interpolate(index, intput, sliderOutput.current);
  };

  const handleOnPress = (index: number) => {
    currentIndex.value = withTiming(index);
    calculateSliderOffset(index);
    onTabPress && onTabPress(index);
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    onLayout && onLayout(e);
  };

  const onTabBarItemLayout = (index: number, layout: TabBarItemLayout) => {
    layouts[index] = layout;
    const length = layouts.filter((layout) => layout.width > 0).length;

    if (length === tabs.length) {
      sliderOutput.current = layouts.map((layout: TabBarItemLayout) => {
        const { x, y, width, height } = layout;
        const toValue = x + (width - sliderWidth.current) / 2;
        return toValue;
      });
      calculateSliderOffset(initialTab);
    }
  };

  const onContentSizeChange = (w: number) => {
    scrollSize.current = w;
  };

  const onSliderLayout = (event: LayoutChangeEvent) => {
    const { width = 0, height } = event.nativeEvent.layout;
    sliderWidth.current = width;
  };

  const keepScrollViewMiddle = (index: number) => {
    const toValue = sliderOutput.current[index];
    if (toValue > contentSize / 2) {
      scrollRef.current &&
        scrollRef.current?.scrollTo({
          x: toValue - contentSize / 2,
          y: 0,
          animated: true,
        });
    } else {
      scrollRef.current &&
        scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const calculateSliderOffset = (index: number) => {
    'worklet';
    if (!isInteger(index)) {
      throw new Error('index type must be Integer');
    }
    if (index < 0 || index >= tabs.length) {
      throw new Error(
        'calculateSliderOffset can only handle index [0, tabs.length - 1]'
      );
    }

    keepScrollViewMiddle(index);
    const toValue = sliderOutput.current[index];
    sliderOffset.value = withTiming(toValue);
  };

  const tabBarItemWidth = useMemo(() => {
    return tabBarflex === 'auto'
      ? 'auto'
      : (contentSize - (tabs.length + 1) * spacing) / tabs.length;
  }, [tabBarflex, contentSize, tabs, spacing]);

  const animatedSlider = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: sliderOffset.value,
        },
      ],
    };
  });

  return (
    <View style={[{ height: 55 }, style]} onLayout={handleLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal
        scrollEnabled={tabScrollEnabled}
        onContentSizeChange={onContentSizeChange}
        contentContainerStyle={styles.contentContainerStyle}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {tabs?.length > 0 &&
          tabs.map((tab, index) => {
            return (
              <React.Fragment key={index}>
                {index === 0 ? <Separator spacing={spacing} /> : null}
                <TabBarItem
                  width={tabBarItemWidth}
                  style={tabBarItemStyle}
                  titleStyle={tabBarItemTitleStyle}
                  index={index}
                  currentIndex={currentIndex}
                  activeTextColor={activeTextColor}
                  inactiveTextColor={inactiveTextColor}
                  title={tab}
                  onLayout={onTabBarItemLayout}
                  onPress={handleOnPress}
                />
                <Separator spacing={spacing}>
                  {index !== tabs.length - 1 &&
                    showSeparator &&
                    separatorComponent &&
                    separatorComponent(index)}
                </Separator>
              </React.Fragment>
            );
          })}
        {!hideSlider ? (
          <Animated.View style={[styles.sliderContainer, animatedSlider]}>
            {sliderComponent ? (
              <View onLayout={onSliderLayout}>{sliderComponent()}</View>
            ) : (
              <TabBarSlider style={defaultSliderStyle} />
            )}
          </Animated.View>
        ) : null}
      </ScrollView>
    </View>
  );
});

TabBar.displayName = 'TabBar';

const styles = StyleSheet.create({
  sliderContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  contentContainerStyle: {
    alignItems: 'center',
  },
});

export default TabBar;
