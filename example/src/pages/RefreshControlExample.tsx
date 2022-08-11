import React, { useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Loading } from 'react-native-maui';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const { width, height } = Dimensions.get('window');

interface RefreshControlExampleProps {}

const RefreshControlExample: React.FC<RefreshControlExampleProps> = (props) => {
  const {} = props;
  const scrollRef = useRef();

  const scrollViewTransitionY = useSharedValue(0);
  const refreshTransitionY = useSharedValue(0);
  const offset = useSharedValue(0);
  const canRefresh = useSharedValue(true);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollViewTransitionY.value = event.contentOffset.y;
      if (scrollViewTransitionY.value < 1) {
        canRefresh.value = true;
      } else {
        canRefresh.value = false;
      }
    },
  });

  const panGesture = Gesture.Pan()
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
    })
    .onEnd(() => {
      let dest = 0;
      if (refreshTransitionY.value >= 100) {
        dest = 100;
      }

      refreshTransitionY.value = withTiming(dest);
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
      top: -100 + refreshTransitionY.value,
      opacity: interpolate(refreshTransitionY.value, [0, 100], [0, 1]),
    };
  });

  const stickey = useAnimatedStyle(() => {
    return {
      zIndex: 10,
      transform: [
        {
          translateY: interpolate(
            scrollViewTransitionY.value,
            [0, height, height + 1],
            [0, 0, 1]
          ),
        },
      ],
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
            directionalLockEnabled={true}
            animatedProps={animatedProps}
          >
            <Animated.View style={[styles.refresh, refreshView]}>
              <Loading />
            </Animated.View>
            <Animated.View style={animatedStyle}>
              <View style={styles.item} />
              <Animated.View style={[styles.stickey, stickey]} />
              <View style={styles.item} />
              <View style={styles.item} />
            </Animated.View>
          </AnimatedScrollView>
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width,
    height,
    backgroundColor: 'pink',
  },
  stickey: {
    width,
    height: 30,
    backgroundColor: 'red',
  },
  refresh: {
    width,
    height: 100,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default RefreshControlExample;
