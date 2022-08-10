import React, { useRef } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import {
  NativeViewGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const { width } = Dimensions.get('window');

interface RefreshControlExampleProps {}

const mockArray = (): number[] => {
  const data = new Array(20).fill(0);
  const randomIndex = Math.floor(Math.random() * 100);
  for (let index = 0; index < data.length; index++) {
    data[index] = randomIndex + index;
  }
  return data;
};

const RefreshControlExample: React.FC<RefreshControlExampleProps> = (props) => {
  const {} = props;
  const scrollRef = useRef();
  const refreshRef = useRef();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      console.log('onScroll', event.contentOffset.y);
    },
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onActive: (event, context) => {
      console.log('onGestureEvent', event.translationY);
    },
  });

  return (
    <PanGestureHandler
      ref={refreshRef}
      simultaneousHandlers={[refreshRef, scrollRef]}
      onGestureEvent={onGestureEvent}
    >
      <AnimatedScrollView
        ref={scrollRef}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {mockArray().map((item) => {
          return (
            <View key={item} style={styles.item}>
              <Text>{item}</Text>
            </View>
          );
        })}
      </AnimatedScrollView>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
});

export default RefreshControlExample;
