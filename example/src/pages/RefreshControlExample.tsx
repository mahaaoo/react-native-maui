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
            <Animated.View style={animatedStyle}>
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
    height: 4 * height,
    backgroundColor: 'pink',
  },
});

export default RefreshControlExample;
