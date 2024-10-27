import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedRef,
  scrollTo,
  withTiming,
  useAnimatedReaction,
  withDecay,
  cancelAnimation,
  useDerivedValue,
  SharedValue,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureType,
} from 'react-native-gesture-handler';
import { TabBar } from '../TabBar';
import { PageView } from '../PageView';

const HEADE_HEIGHT = 180;
const TABBAR_HEIGHT = 55;
const TABS = ['tab1', 'tab2'];

const HeadTabView: React.FC<null> = (props) => {
  const headerY = useSharedValue(0);
  const headerYOffset = useSharedValue(0);

  const integralY = useSharedValue(0);
  const integralYOffset = useSharedValue(0);

  const totalRef = useRef();
  const headerRef = useRef();

  const isHeaderDecay = useSharedValue(false);

  const currentIdx = useSharedValue(0);

  const [childScrollValues, setChildScrollValues] = useState<{
    [index: number]: SharedValue<number>;
  }>({});
  const [childScrollRefs, setChildScrollRefs] = useState<{
    [index: number]: any;
  }>({});
  const [childNativeRefs, setChildNativeRefs] = useState<
    React.RefObject<any>[]
  >([]);

  const stopAnimation = () => {
    'worklet';
    cancelAnimation(headerY);
  };

  console.log('childScrollRefs', childScrollRefs);
  console.log('childScrollValues', childScrollValues);
  console.log('setChildNativeRef', childNativeRefs);

  // 用Gesture.Native包裹内部scrollview并获取此ref
  const setChildNativeRef = useCallback(
    (ref: React.RefObject<any>) => {
      if (!ref) return;
      const findRef = childNativeRefs.find(
        (item) => item.current === ref.current
      );
      if (findRef) return;
      setChildNativeRefs((prechildRefs) => {
        return [...prechildRefs, ref];
      });
    },
    [childNativeRefs]
  );

  // 获取内部scrollview的ref
  const setChildScrollRef = useCallback(
    (index: number, scrollRef: React.RefObject<any>) => {
      if (!scrollRef) return;
      setChildScrollRefs((preChildRef) => {
        return { ...preChildRef, [index]: scrollRef };
      });
    },
    []
  );

  // 获取内部scrollview的value
  const setChildScrolls = useCallback(
    (index: number, scrollValue: SharedValue<number>) => {
      if (!scrollValue) return;
      setChildScrollValues((preChildScrollValues) => {
        return { ...preChildScrollValues, [index]: scrollValue };
      });
    },
    []
  );

  const panGesture = Gesture.Pan()
    .withRef(totalRef)
    .activeOffsetX([-500, 500])
    .activeOffsetY([-10, 10])
    .simultaneousWithExternalGesture(...childNativeRefs, headerRef)
    .onTouchesDown(() => {
      stopAnimation();
    })
    .onBegin(() => {
      integralYOffset.value = integralY.value;
      console.log('onBegin');
    })
    .onUpdate(({ translationY }) => {
      console.log('integralY', translationY);

      integralY.value = translationY + integralYOffset.value;
      // scrollTo(animatedRef, 0, -integralY.value, false);
    })
    .onEnd(() => {
      console.log('onEnd');
      // if (integralY.value > 0) {
      //     integralY.value = withTiming(0);
      // }
    });

  const headerStyleInter = useDerivedValue(() => {
    return interpolate(
      integralY.value,
      [0, HEADE_HEIGHT - TABBAR_HEIGHT],
      [0, -HEADE_HEIGHT + TABBAR_HEIGHT],
      Extrapolation.CLAMP
    );
  }, [integralY]);

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: 0,
        },
        {
          scale: 1,
        },
      ],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: 0,
        },
      ],
    };
  });

  const stopScrolling = () => {
    'worklet';
    if (!!childScrollRefs[currentIdx.value]) {
      scrollTo(
        childScrollRefs[currentIdx.value],
        0,
        childScrollValues[currentIdx.value].value + 0.1,
        false
      );
    }
  };

  useAnimatedReaction(
    () => headerY.value,
    () => {
      'worklet';
      if (isHeaderDecay.value) {
        scrollTo(childScrollRefs[currentIdx.value], 0, headerY.value, false);
      }
    }
  );

  const headerPan = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .withRef(headerRef)
    .simultaneousWithExternalGesture(totalRef)
    .onTouchesDown(() => {
      stopScrolling();
    })
    .onBegin(() => {
      headerYOffset.value = 0;
    })
    .onUpdate(({ translationY }) => {
      console.log('value:', childScrollValues[currentIdx.value].value);
      if (!isHeaderDecay.value) {
        headerYOffset.value = childScrollValues[currentIdx.value].value;
        isHeaderDecay.value = true;
      }
      headerY.value = -translationY + headerYOffset.value;
    })
    .onEnd(({ velocityY }) => {
      headerYOffset.value = 0;
      headerY.value = withDecay({ velocity: -velocityY }, () => {
        isHeaderDecay.value = false;
      });
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flex: 1 }, containerStyle]}>
          <PageView
            style={{ flex: 1 }}
            onPageSelected={(currentPage) => {
              // tabRef.current && tabRef.current?.keepScrollViewMiddle(currentPage);
              // onPageSelected && onPageSelected(currentPage)
            }}
            onPageScroll={(translate) => {
              // tabRef.current && tabRef.current?.syncCurrentIndex(translate);
              // onPageScroll && onPgeScroll(translate);
            }}
            onPageScrollStateChanged={() => {}}
          >
            {TABS.length > 0 &&
              TABS.map((tab, index) => {
                return (
                  <HeadTabSigle
                    {...{
                      setChildNativeRef,
                      setChildScrollRef,
                      setChildScrolls,
                      index,
                    }}
                    key={tab}
                  />
                );
              })}
          </PageView>
          <GestureDetector gesture={headerPan}>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  backgroundColor: 'orange',
                  width: '100%',
                  height: HEADE_HEIGHT,
                },
                headerStyle,
              ]}
            >
              <View style={{ height: HEADE_HEIGHT - TABBAR_HEIGHT }}>
                <Text>Header View</Text>
              </View>
              <TabBar
                tabs={TABS}
                tabBarflex={'equal-width'}
                onTabPress={(index) => {
                  // pageRef.current && pageRef.current?.setPage(index);
                  // onTabPress && onTabPress(index);
                }}
              />
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const HeadTabSigle = ({
  setChildNativeRef,
  setChildScrollRef,
  setChildScrolls,
  index,
}) => {
  const animatedRef = useAnimatedRef();

  const nativeRef = useRef();
  const nativeGes = Gesture.Native().withRef(nativeRef);

  const scrollValue = useSharedValue(0);

  useEffect(() => {
    setChildNativeRef && setChildNativeRef(nativeRef);
  }, [nativeGes]);

  useEffect(() => {
    setChildScrollRef && setChildScrollRef(index, animatedRef);
  }, [animatedRef]);

  useEffect(() => {
    setChildScrolls && setChildScrolls(index, scrollValue);
  }, [scrollValue]);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {},
    onScroll: (event) => {
      scrollValue.value = event.contentOffset.y;
    },
    onMomentumEnd: () => {
      console.log('onMomentumEnd', scrollValue.value);
    },
  });

  return (
    <GestureDetector gesture={nativeGes}>
      <Animated.ScrollView
        ref={animatedRef}
        onScroll={scrollHandler}
        style={{ flex: 1, backgroundColor: 'pink' }}
        contentContainerStyle={{ paddingTop: HEADE_HEIGHT }}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: HEADE_HEIGHT - 44 }}
        bounces={false}
      >
        {new Array(80).fill(0).map((item, index) => {
          return (
            <Text key={index} style={{ margin: 10, fontSize: 20 }}>
              {index}
            </Text>
          );
        })}
      </Animated.ScrollView>
    </GestureDetector>
  );
};

export default HeadTabView;
