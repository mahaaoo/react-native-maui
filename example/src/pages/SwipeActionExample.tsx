import React from 'react';
import { Dimensions, View, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { snapPoint } from 'react-native-maui';

const { width } = Dimensions.get('window');
const snapPoints = [-width, -100, 0];

interface SwipeActionExampleProps {}

const SwipeActionExample: React.FC<SwipeActionExampleProps> = (props) => {
  const {} = props;
  const translateX = useSharedValue(0);
  const offset = useSharedValue(0);
  const canDelete = useSharedValue(false);
  const height = useSharedValue(50);

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
      if (dest === 0) {
        translateX.value = withTiming(0);
        canDelete.value = false;
      } else if (dest === -100) {
        translateX.value = withTiming(dest);
        canDelete.value = true;
      } else if (dest === -width && canDelete.value) {
        translateX.value = withTiming(dest);
        height.value = withTiming(0);
        canDelete.value = false;
      } else {
        translateX.value = withTiming(-100);
        canDelete.value = true;
      }
    });

  const swiperStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const silderStyle = useAnimatedStyle(() => {
    return {
      width: Math.abs(translateX.value) * 0.5,
    };
  });

  const silderStyle2 = useAnimatedStyle(() => {
    return {
      width: Math.abs(translateX.value),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.item} />
      <GestureDetector gesture={panGesture}>
        <View style={{ overflow: 'hidden' }}>
          <Animated.View style={[styles.item, swiperStyle]}>
            <Text>contentcontentcontentcontentcontent</Text>
          </Animated.View>
          <Animated.View style={[styles.silder2, silderStyle2]}>
            <Text
              numberOfLines={1}
              style={[styles.cancel]}
              onPress={() => {
                translateX.value = withTiming(-width);
                height.value = withTiming(0);
              }}
            >
              删除
            </Text>
          </Animated.View>
          <Animated.View style={[styles.silder, silderStyle]}>
            <Text
              numberOfLines={1}
              style={[styles.cancel]}
              onPress={() => {
                translateX.value = withTiming(0);
                canDelete.value = false;
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
    backgroundColor: 'orange',
    height: 50,
    justifyContent: 'center',
    alignContent: 'center',
  },
  silder2: {
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
