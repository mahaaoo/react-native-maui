import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureType,
} from 'react-native-gesture-handler';
import { TabView } from 'react-native-maui';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useAnimatedReaction } from 'react-native-reanimated';
import { useAnimatedStyle } from 'react-native-reanimated';

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

const HEADER_HEIGHT = 100;

const HeadTabViewExample: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;
  const tabRef = useRef(null);
  const panRef = useRef();

  const [nativeRefs, setNativeRefs] = useState<
    Array<React.MutableRefObject<GestureType | undefined>>
  >([]);

  const refreshTransitionY = useSharedValue(0);
  const offset = useSharedValue(0);
  const canPan = useSharedValue(true);

  const panGesture = Gesture.Pan()
    .withRef(panRef)
    .activeOffsetY([-10, 10])
    .simultaneousWithExternalGesture(...nativeRefs)
    .onBegin(() => {
      offset.value = refreshTransitionY.value;
    })
    .onUpdate(({ translationY }) => {
      if (!canPan.value) return;

      console.log('pan', translationY + offset.value);

      refreshTransitionY.value = interpolate(
        translationY + offset.value,
        [-100, 0],
        [-100, 0],
        Extrapolate.CLAMP
      );
    })
    .onEnd(() => {});

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: refreshTransitionY.value,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <Animated.View style={{ height: HEADER_HEIGHT }} />
        <TabView ref={tabRef} tabBar={TabList}>
          {TabList.map((_, index) => {
            return (
              <MScrollView
                canPan={canPan}
                panRef={panRef}
                refreshTransitionY={refreshTransitionY}
                setRef={(
                  ref: React.MutableRefObject<GestureType | undefined>
                ) => {
                  if (!ref) return;
                  const findItem = nativeRefs.find(
                    (item) => item.current === ref.current
                  );
                  if (findItem) return;
                  setNativeRefs((prechildRefs) => {
                    return [...prechildRefs, ref];
                  });
                }}
                key={index}
                nativeRefs={nativeRefs}
                index={index}
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
              </MScrollView>
            );
          })}
        </TabView>
      </Animated.View>
    </GestureDetector>
  );
};

const MScrollView = (props) => {
  const {
    children,
    nativeRefs,
    index,
    setRef,
    canPan,
    refreshTransitionY,
    panRef,
  } = props;

  const nativeRef = useRef();
  const nativeGesture = Gesture.Native().withRef(nativeRef);

  const scrollY = useSharedValue(0);

  useAnimatedReaction(
    () => refreshTransitionY.value,
    (value) => {
      if (value === -HEADER_HEIGHT) {
        canPan.value = false;
      }
    }
  );

  useEffect(() => {
    // nativeRefs.value.push(nativeRef);
    // nativeRefs.value[index] = nativeRef;
    setRef && setRef(nativeRef);
    console.log(nativeRefs.value);
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag(event, context) {
      if (canPan.value) return;
    },
    onScroll(event) {
      // scrollViewTransitionY.value = event.contentOffset.y;
      console.log('onscroll', event.contentOffset.y);
      scrollY.value = event.contentOffset.y;
      if (event.contentOffset.y === 0) {
        canPan.value = true;
      }
    },
  });

  return (
    <GestureDetector gesture={nativeGesture}>
      <Animated.ScrollView
        bounces={false}
        scrollEventThrottle={1}
        onScroll={onScroll}
      >
        {children}
      </Animated.ScrollView>
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
