import React, { useRef } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TabView } from 'react-native-maui';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

interface TabViewExampleProps {}

const TabList = ['Tab1', 'Tab2'];
const TabListColor = [
  'pink',
  '#666',
  'cyan',
  'pink',
  'purple',
  'orange',
  '#666',
];

const HeadTabViewExample: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;
  const tabRef = useRef(null);
  const nativeRef = useRef();
  const panRef = useRef();
  const scrollRefs = useRef<any>([]);

  const refreshTransitionY = useSharedValue(0);
  const offset = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .withRef(panRef)
    .activeOffsetY([-10, 10])
    .simultaneousWithExternalGesture(nativeRef)
    .onBegin(() => {
      offset.value = refreshTransitionY.value;
    })
    .onUpdate(({ translationY }) => {
      console.log('pan', translationY);
    })
    .onEnd(() => {});

  const nativeGesture = Gesture.Native().withRef(nativeRef);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event, context) {
      // scrollViewTransitionY.value = event.contentOffset.y;
      console.log('onscroll', event.contentOffset.y);
    },
  });

  return (
    <GestureDetector gesture={panGesture}>
      <TabView ref={tabRef} tabBar={TabList}>
        {TabList.map((_, index) => {
          return (
            <GestureDetector gesture={nativeGesture}>
              <Animated.ScrollView
                ref={(r: any) => (scrollRefs.current[index] = r)}
                key={index}
                bounces={false}
                scrollEventThrottle={16}
                onScroll={onScroll}
              >
                <View
                  style={[
                    styles.itemContainer,
                    {
                      height: height * 2,
                    },
                    {
                      backgroundColor: TabListColor[index],
                    },
                  ]}
                >
                  <Text style={{ fontSize: 30 }} key={index}>{`Tab${
                    index + 1
                  }`}</Text>
                </View>
              </Animated.ScrollView>
            </GestureDetector>
          );
        })}
      </TabView>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeadTabViewExample;
