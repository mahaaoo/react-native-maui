import React, { useCallback } from 'react';
import { Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';

import TabViewItem from './TabViewItem';

const { width } = Dimensions.get('window');
const TABBAR_WIDTH = 100;

interface TabViewProps {
  tabBar: Array<string>;
}

const TabView: React.FC<TabViewProps> = (props) => {
  const { tabBar } = props;
  const TOTAL_WIDTH = width * tabBar.length;

  const translateX = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const containerOffset = useSharedValue(0);
  const tabOffset = useSharedValue(0);

  const handleMove = useCallback((nextIndex: number) => {
    'worklet';
    let dest = interpolate(
      -Math.round(nextIndex) * width,
      [0, -TOTAL_WIDTH],
      [0, TABBAR_WIDTH * tabBar.length]
    );

    if (dest > width / 2) {
      const adjust = Math.min(width - TABBAR_WIDTH * (nextIndex + 1 + 1), 0);
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
    translateX.value = withTiming(-nextIndex * width, {}, () => {
      currentIndex.value = nextIndex;
    });
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      offsetX.value = translateX.value;
    })
    .onUpdate(({ translationX }) => {
      translateX.value = translationX + offsetX.value;
    })
    .onEnd(({ velocityX }) => {
      const page = -(translateX.value + 0.2 * velocityX) / width;
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

  const tarbarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: tabOffset.value,
        },
      ],
    };
  });

  return (
    <>
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
            <TouchableOpacity
              onPress={() => {
                handleMove(index);
              }}
              style={styles.tabbarItem}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
      <Animated.View style={[styles.slider, tarbarStyle]} />
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.contentContainer,
            { width: TOTAL_WIDTH },
            animatedStyle,
          ]}
        >
          {tabBar.map((_, index) => {
            return <TabViewItem currentIndex={currentIndex} index={index} />;
          })}
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  tarbarContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  tabbarItem: {
    width: TABBAR_WIDTH,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  slider: {
    height: 4,
    width: TABBAR_WIDTH,
    backgroundColor: 'blue',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default TabView;
