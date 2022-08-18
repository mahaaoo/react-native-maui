import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollView, Dimensions } from 'react-native';
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
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { RefreshContainerContext, RefreshStatus } from './type';
import NormalControl from './NormalControl';

const { height } = Dimensions.get('window');
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type ControlType = typeof NormalControl | React.ReactNode;

interface RefreshContainerProps {
  refreshing: boolean;
  refreshControl: ControlType;
  onRefresh: () => void;

  triggleHeight?: number;
  canOffset?: boolean;
}

const MAX_SCROLL_VELOCITY_Y = 20;
const MIN_SCROLL_VELOCITY_Y = 0.5;
const DEFAULT_TRIGGLE_HEIGHT = 80;
const RESET_TIMING_EASING = Easing.bezier(0.33, 1, 0.68, 1);

const RefreshContainer: React.FC<RefreshContainerProps> = (props) => {
  const {
    children,
    refreshing,
    onRefresh,
    refreshControl,
    triggleHeight = DEFAULT_TRIGGLE_HEIGHT,
    canOffset = true,
  } = props;

  const scrollRef = useRef();
  const panRef = useRef();

  const scrollViewTransitionY = useSharedValue(0);
  const refreshTransitionY = useSharedValue(0);
  const offset = useSharedValue(0);
  const scrollBounse = useSharedValue(false);

  const refreshStatus = useSharedValue<RefreshStatus>(RefreshStatus.Idle);

  const canRefresh = useDerivedValue(() => {
    return scrollViewTransitionY.value < 1;
  });

  useEffect(() => {
    if (refreshing) {
      refreshStatus.value = RefreshStatus.Holding;
      refreshTransitionY.value = withTiming(triggleHeight);
    } else {
      if (refreshTransitionY.value > 0) {
        refreshStatus.value = RefreshStatus.Done;
        refreshTransitionY.value = withDelay(
          500,
          withTiming(
            0,
            {
              easing: RESET_TIMING_EASING,
            },
            () => {
              refreshStatus.value = RefreshStatus.Idle;
            }
          )
        );
      }
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
      if (scrollViewTransitionY.value === 0 && !scrollBounse.value) {
        const endTime = new Date().valueOf();
        const velocityY = Math.min(
          Math.abs(
            (scrollViewTransitionY.value - scrollBeginY) /
              (endTime - scrollBeginTime)
          ),
          MAX_SCROLL_VELOCITY_Y
        );
        if (velocityY < MIN_SCROLL_VELOCITY_Y) return;

        const ratio = (Math.PI / 2 / MAX_SCROLL_VELOCITY_Y) * velocityY;
        const bounceDistance = (height / 3) * Math.sin(ratio);
        const duration = 50 + 100 * Math.cos(ratio);

        scrollBounse.value = true;
        refreshTransitionY.value = withSequence(
          withTiming(bounceDistance, { duration }),
          withTiming(
            0,
            {
              duration,
              easing: RESET_TIMING_EASING,
            },
            () => {
              scrollBounse.value = false;
            }
          )
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
    })
    .onUpdate(({ translationY }) => {
      if (!canRefresh.value) {
        return;
      }
      refreshTransitionY.value = interpolate(
        translationY + offset.value,
        [0, height],
        [0, height / 2]
      );
      if (!refreshing) {
        if (refreshTransitionY.value >= triggleHeight) {
          refreshStatus.value = RefreshStatus.Reached;
        } else {
          refreshStatus.value = RefreshStatus.Pulling;
        }
      }
    })
    .onEnd(() => {
      if (refreshing) {
        refreshTransitionY.value = withTiming(triggleHeight);
        return;
      }
      if (refreshTransitionY.value >= triggleHeight) {
        runOnJS(handleOnRefresh)();
      } else {
        refreshTransitionY.value = withTiming(
          0,
          {
            easing: RESET_TIMING_EASING,
          },
          () => {
            refreshStatus.value = RefreshStatus.Idle;
          }
        );
      }
    });

  const nativeGesture = Gesture.Native().withRef(scrollRef);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: canOffset ? refreshTransitionY.value : 0,
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

  return (
    <RefreshContainerContext.Provider
      value={{
        transitionY: refreshTransitionY,
        scrollBounse: scrollBounse,
        triggleHeight,
        refreshing,
        refreshStatus,
      }}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View>
          <GestureDetector gesture={nativeGesture}>
            <AnimatedScrollView
              bounces={false}
              scrollEventThrottle={16}
              onScroll={onScroll}
              animatedProps={animatedProps}
            >
              <Animated.View style={animatedStyle}>{children}</Animated.View>
              {refreshControl}
            </AnimatedScrollView>
          </GestureDetector>
        </Animated.View>
      </GestureDetector>
    </RefreshContainerContext.Provider>
  );
};

export default RefreshContainer;
