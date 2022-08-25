/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface TabViewExampleProps {}

const TabList = ['Tab1', 'Tab2', 'Tab3', 'Tab4', 'Tab5', 'Tab6', 'Tab7'];
const TabListColor = [
  'orange',
  '#666',
  'cyan',
  '#e82c1c',
  'purple',
  'orange',
  '#666',
];
const TOTAL_WIDTH = width * TabList.length;
const TABBAR_WIDTH = 100;

const TabViewExample: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;

  const translateX = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const containerOffset = useSharedValue(0);
  const tabOffset = useSharedValue(0);

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
      if (nextIndex > TabList.length - 1) nextIndex = TabList.length - 1;

      nextIndex = Math.round(nextIndex);

      let dest = interpolate(
        -Math.round(nextIndex) * width,
        [0, -TOTAL_WIDTH],
        [0, TABBAR_WIDTH * TabList.length]
      );

      if (dest > width / 2) {
        const adjust = width - TABBAR_WIDTH * (nextIndex + 1 + 1);
        dest += adjust;
        if (nextIndex + 1 + 1 <= TabList.length) {
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
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            backgroundColor: 'white',
            alignItems: 'center',
            width: TABBAR_WIDTH * TabList.length,
          },
          tabContainerStyle,
        ]}
      >
        {TabList.map((item, index) => {
          return (
            <View
              style={{
                width: TABBAR_WIDTH,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
              }}
            >
              <Text>{item}</Text>
            </View>
          );
        })}
      </Animated.View>
      <Animated.View
        style={[
          {
            height: 4,
            width: TABBAR_WIDTH,
            backgroundColor: 'blue',
          },
          tarbarStyle,
        ]}
      />
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              width: TOTAL_WIDTH,
            },
            animatedStyle,
          ]}
        >
          {TabList.map((item, index) => {
            return (
              <View
                style={{
                  backgroundColor: TabListColor[index],
                  width,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 30 }}>{item}</Text>
              </View>
            );
          })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default TabViewExample;
