import React from 'react';
import { Dimensions, View, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { snapPoint } from 'react-native-maui';

const { width } = Dimensions.get('window');
const snapPoints = [-100, 0];

interface SwipeActionExampleProps {}

const SwipeActionExample: React.FC<SwipeActionExampleProps> = (props) => {
  const {} = props;
  const translateX = useSharedValue(0);
  const offset = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      offset.value = translateX.value;
    })
    .onUpdate(({ translationX }) => {
      if (offset.value + translationX > 0) return;
      translateX.value = offset.value + translationX;
    })
    .onEnd(({ velocityX }) => {
      const dest = snapPoint(translateX.value, velocityX, snapPoints);
      translateX.value = withTiming(dest);
    });

  const swiperStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(translateX.value, [-width, -100, 0], [0, 50, 50]),
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const silderStyle = useAnimatedStyle(() => {
    return {
      width: Math.abs(translateX.value),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.item} />
      <GestureDetector gesture={panGesture}>
        <View>
          <Animated.View style={[styles.item, swiperStyle]} />
          <Animated.View style={[styles.silder, silderStyle]}>
            <Text
              numberOfLines={1}
              style={[styles.cancel]}
              onPress={() => {
                translateX.value = withTiming(-width);
              }}
            >
              取消
            </Text>
          </Animated.View>
        </View>
      </GestureDetector>
      <View style={styles.item} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width,
    marginTop: 1,
    height: 50,
    backgroundColor: 'white',
  },
  silder: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'red',
    height: 50,
    justifyContent: 'center',
    alignContent: 'center',
  },
  cancel: {
    color: 'white',
  },
});

export default SwipeActionExample;
