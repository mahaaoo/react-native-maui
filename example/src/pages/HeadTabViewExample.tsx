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
  useAnimatedReaction,
  useAnimatedStyle,
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

  const panStatus = useSharedValue(0);

  useAnimatedReaction(
    () => refreshTransitionY.value,
    (value) => {
      if (panStatus.value === 0 && value <= -100) {
        canPan.value = false;
        panStatus.value = 1;
      }
    }
  );

  // const panEnabled = useDerivedValue(() => refreshTransitionY.value > -100);

  const panGesture = Gesture.Pan()
    .withRef(panRef)
    .enabled(canPan.value)
    .shouldCancelWhenOutside(true)
    .simultaneousWithExternalGesture(...nativeRefs)
    .onBegin(() => {
      'worklet';
      console.log('onBegin');
      offset.value = refreshTransitionY.value;
    })
    .onTouchesMove((event, stateManager) => {
      'worklet';
      console.log('onTouchesMove');
      if (!canPan.value) {
        stateManager.fail();
      } else {
        panStatus.value = 0;
      }
    })
    .onUpdate(({ translationY }) => {
      'worklet';
      console.log('pan', refreshTransitionY.value);
      if (!canPan.value) {
        // GestureStateManager.fail();
        console.log('当前panGesture是否', {
          refreshTransitionY: refreshTransitionY.value,
        });
        return;
      }
      refreshTransitionY.value = translationY + offset.value;
      // console.log('pan', refreshTransitionY.value);
    })
    .onEnd(({}) => {
      'worklet';
      // console.log(refreshTransitionY.value);
      let temp = refreshTransitionY.value;
      if (temp <= -HEADER_HEIGHT) {
        temp = -HEADER_HEIGHT;
      }
      if (temp >= 0) temp = 0;
      refreshTransitionY.value = temp;
    })
    .onFinalize((event, success) => {
      'worklet';
      console.log('onFinalize', success);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            refreshTransitionY.value,
            [-HEADER_HEIGHT, 0],
            [-HEADER_HEIGHT, 0],
            Extrapolate.CLAMP
          ),
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
                panGesture={panGesture}
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
                      height: height * 1.5,
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
    panGesture,
    setPanEnabled,
  } = props;

  const nativeRef = useRef();
  const nativeGesture = Gesture.Native()
    .withRef(nativeRef)
    .requireExternalGestureToFail(panGesture);

  const scrollY = useSharedValue(0);
  const scrollRef = useRef();

  useEffect(() => {
    // nativeRefs.value.push(nativeRef);
    // nativeRefs.value[index] = nativeRef;
    setRef && setRef(nativeRef);
    console.log(nativeRefs.value);
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag(event, context) {
      // scrollRef.current?.scrollTo({ y: 0 });
    },
    onScroll(event) {
      // scrollViewTransitionY.value = event.contentOffset.y;
      console.log('onscroll', event.contentOffset.y);
      scrollY.value = event.contentOffset.y;
      if (event.contentOffset.y === 0) {
        console.log('允许pan滚动');
        canPan.value = true;
        // runOnJS(setPanEnabled)(true);
      }
    },
  });

  return (
    <GestureDetector gesture={nativeGesture}>
      <Animated.ScrollView
        ref={scrollRef}
        bounces={false}
        scrollEventThrottle={16}
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
