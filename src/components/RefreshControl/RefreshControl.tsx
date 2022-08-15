import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Dimensions, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  interpolate,
  useAnimatedScrollHandler,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withSequence,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface RefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;

  triggleHeight?: number;
}

const MAX_SCROLL_VELOCITY_Y = 20;

const RefreshControl: React.FC<RefreshControlProps> = (props) => {
  const { children, refreshing, onRefresh, triggleHeight = 100 } = props;

  const scrollRef = useRef();
  const panRef = useRef();

  const scrollViewTransitionY = useSharedValue(0);

  const refreshTransitionY = useSharedValue(0);
  const offset = useSharedValue(0);
  const refreshHeight = useSharedValue(0);

  const scrollBounse = useSharedValue(false);

  const canRefresh = useDerivedValue(() => {
    return scrollViewTransitionY.value < 1;
  });

  useEffect(() => {
    if (refreshing) {
      refreshTransitionY.value = withTiming(triggleHeight);
      refreshHeight.value = withTiming(2 * triggleHeight);
    } else {
      refreshTransitionY.value = withTiming(0);
      refreshHeight.value = withTiming(0);
    }
  }, [refreshing]);

  const handleOnRefresh = useCallback(() => {
    if (refreshing) return;
    onRefresh && onRefresh();
  }, []);

  const onScroll = useAnimatedScrollHandler<{
    scrollBeginTime: number;
    scrollBeginY: number;
  }>({
    onBeginDrag: (event, context) => {
      context.scrollBeginTime = new Date().valueOf();
      context.scrollBeginY = event.contentOffset.y;
    },
    onScroll: (event, context) => {
      const { scrollBeginY, scrollBeginTime } = context;
      scrollViewTransitionY.value = event.contentOffset.y;
      if (scrollViewTransitionY.value === 0) {
        const endTime = new Date().valueOf();
        const velocityY = Math.min(
          Math.abs(
            (scrollViewTransitionY.value - scrollBeginY) /
              (endTime - scrollBeginTime)
          ),
          MAX_SCROLL_VELOCITY_Y
        );
        const ratio = (Math.PI / 2 / MAX_SCROLL_VELOCITY_Y) * velocityY;
        const bounceDistance = triggleHeight * 2 * Math.sin(ratio);
        const duration = 50 + 100 * Math.cos(ratio);

        scrollBounse.value = true;
        refreshTransitionY.value = withSequence(
          withTiming(bounceDistance, { duration }),
          withTiming(0, { duration }, () => {
            scrollBounse.value = false;
          })
        );
      }
    },
  });

  const panGesture = Gesture.Pan()
    .withRef(panRef)
    .activeOffsetY([-10, 10])
    .simultaneousWithExternalGesture(scrollRef)
    .onBegin(() => {
      offset.value = refreshTransitionY.value;
      refreshHeight.value = refreshTransitionY.value;
    })
    .onUpdate(({ translationY }) => {
      if (!canRefresh.value) {
        return;
      }
      refreshHeight.value = translationY + offset.value;
      refreshTransitionY.value = interpolate(
        translationY + offset.value,
        [0, height],
        [0, height / 2]
      );
    })
    .onEnd(() => {
      if (refreshing) {
        refreshTransitionY.value = withTiming(triggleHeight);
        refreshHeight.value = withTiming(2 * triggleHeight);
        return;
      }
      if (refreshTransitionY.value >= triggleHeight) {
        runOnJS(handleOnRefresh)();
      } else {
        refreshTransitionY.value = withTiming(0);
        refreshHeight.value = withTiming(0);
      }
    });

  const nativeGesture = Gesture.Native().withRef(scrollRef);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: refreshTransitionY.value,
        },
      ],
    };
  });

  const animatedProps = useAnimatedProps(() => {
    const top = -refreshTransitionY.value;

    return {
      scrollIndicatorInsets: {
        top: top,
        left: 0,
        bottom: 0,
        right: 0,
      },
    };
  });

  const refreshView = useAnimatedStyle(() => {
    if (scrollBounse.value) {
      return {
        height: 0,
        opacity: 0,
      };
    }
    return {
      height: refreshHeight.value / 2,
      opacity: interpolate(
        refreshTransitionY.value,
        [0, triggleHeight],
        [0, 1]
      ),
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View>
        <GestureDetector gesture={nativeGesture}>
          <AnimatedScrollView
            bounces={false}
            scrollEventThrottle={16}
            onScroll={onScroll}
            animatedProps={animatedProps}
          >
            <Animated.View style={[styles.refresh, refreshView]}>
              <Text>刷新中...</Text>
            </Animated.View>
            <Animated.View style={animatedStyle}>{children}</Animated.View>
          </AnimatedScrollView>
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  refresh: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
});

export default RefreshControl;
