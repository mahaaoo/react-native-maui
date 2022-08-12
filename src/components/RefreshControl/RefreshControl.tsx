import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
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
} from 'react-native-reanimated';
import { Loading } from '../Loading';

const { width, height } = Dimensions.get('window');
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface RefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;

  triggleHeight?: number;
}

const RefreshControl: React.FC<RefreshControlProps> = (props) => {
  const { children, refreshing, onRefresh, triggleHeight = 100 } = props;

  const scrollRef = useRef();

  const scrollViewTransitionY = useSharedValue(0);

  const refreshTransitionY = useSharedValue(0);
  const offset = useSharedValue(0);
  const refreshHeight = useSharedValue(0);

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

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollViewTransitionY.value = event.contentOffset.y;
      // console.log(scrollViewTransitionY.value);
    },
  });

  const panGesture = Gesture.Pan()
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
      // console.log(refreshHeight.value);
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
              <Loading size="large" />
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
