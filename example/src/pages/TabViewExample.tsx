import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';
import { snapPoint } from 'react-native-maui';

const { width } = Dimensions.get('window');

interface TabViewExampleProps {}

const TabList = ['Tab1', 'Tab2', 'Tab3', 'Tab4', 'Tab5'];
const TabListColor = ['orange', '#666', 'cyan', '#e82c1c', 'purple'];

const TabViewExample: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;
  const translateX = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const snapPoints = TabList.map((_, index) => -index * width);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      offsetX.value = translateX.value;
    })
    .onUpdate(({ translationX }) => {
      translateX.value = translationX + offsetX.value;
    })
    .onEnd(({ velocityX }) => {
      const dest = snapPoint(translateX.value, velocityX, snapPoints);
      translateX.value = withTiming(dest);
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

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          backgroundColor: 'white',
          alignItems: 'center',
        }}
      >
        {TabList.map((item, index) => {
          return (
            <View style={{ marginHorizontal: 30 }}>
              <Text>{item}</Text>
            </View>
          );
        })}
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              width: width * TabList.length,
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
  },
});

export default TabViewExample;
