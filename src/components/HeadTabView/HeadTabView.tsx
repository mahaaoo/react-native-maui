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
  useAnimatedReaction,
  withDecay,
  cancelAnimation,
  useDerivedValue,
  SharedValue,
  clamp,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { TabBar, TabBarRef } from '../TabBar';
import { PageView, PageViewRef } from '../PageView';

const HEADE_HEIGHT = 180;
const TABBAR_HEIGHT = 55;
const TABS = ['tab1', 'tab2'];

const HeadTabView: React.FC<null> = (props) => {
  const pageRef = useRef<PageViewRef>(null);
  const tabRef = useRef<TabBarRef>(null);

  // 头部Header
  const headerY = useSharedValue(0);
  const headerYOffset = useSharedValue(0);
  const headerRef = useRef();
  // 头部Header是否正在惯性滚动
  const isHeaderDecay = useSharedValue(false);

  // 最外层
  const integralY = useSharedValue(0);
  const integralYOffset = useSharedValue(0);
  const totalRef = useRef();

  const currentIdx = useSharedValue(0);

  // 所有scroll共享的滚动距离，用于控制Header以及顶吸
  const sharedTranslate = useSharedValue(0);

  const {
    setNativeRef,
    setScrollRef,
    setScrollValue,
    childNativeRefs,
    childScrollValues,
    childScrollRefs,
  } = useHeadTab();

  const stopAnimation = () => {
    'worklet';
    cancelAnimation(headerY);
    cancelAnimation(sharedTranslate);
  };

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
      sharedTranslate.value,
      [0, HEADE_HEIGHT - TABBAR_HEIGHT],
      [0, -HEADE_HEIGHT + TABBAR_HEIGHT],
      Extrapolation.CLAMP
    );
  }, [integralY]);

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: headerStyleInter.value,
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
            ref={pageRef}
            style={{ flex: 1 }}
            onPageSelected={(currentPage) => {
              tabRef.current &&
                tabRef.current?.keepScrollViewMiddle(currentPage);
              // onPageSelected && onPageSelected(currentPage)
              currentIdx.value = currentPage;
            }}
            onPageScroll={(translate) => {
              tabRef.current && tabRef.current?.syncCurrentIndex(translate);
              // onPageScroll && onPgeScroll(translate);
            }}
            onPageScrollStateChanged={() => {}}
          >
            {TABS.length > 0 &&
              TABS.map((tab, index) => {
                return (
                  <HeadTabSigle
                    {...{
                      setNativeRef,
                      setScrollRef,
                      setScrollValue,
                      index,
                      sharedTranslate,
                      currentIdx,
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
                ref={tabRef}
                tabs={TABS}
                tabBarflex={'equal-width'}
                onTabPress={(index) => {
                  pageRef.current && pageRef.current?.setPage(index);
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
  setNativeRef,
  setScrollRef,
  setScrollValue,
  index,
  sharedTranslate,
  currentIdx,
}) => {
  const animatedRef = useAnimatedRef<any>();

  const nativeRef = useRef();
  const nativeGes = Gesture.Native().withRef(nativeRef);

  const scrollValue = useSharedValue(0);

  // 非当前活动的scrollview不允许滚动
  const scrollEnabledValue = useDerivedValue(() => {
    return currentIdx.value === index;
  });

  // 设置scrollEnabled
  useAnimatedReaction(
    () => {
      return scrollEnabledValue.value;
    },
    (enabled) => {
      animatedRef &&
        animatedRef.current &&
        animatedRef.current.setNativeProps({ scrollEnabled: enabled });
    },
    [scrollEnabledValue, animatedRef]
  );

  // 向其他非活动的scrollview同步当前滚动距离
  useAnimatedReaction(
    () => {
      return sharedTranslate.value;
    },
    (sharedTranslate) => {
      if (currentIdx.value !== index) {
        // 处理切换tab之间，scroll是否重置
        let syncTanslate = 0;
        if (scrollValue.value >= HEADE_HEIGHT - TABBAR_HEIGHT) {
          if (sharedTranslate === 0) {
            syncTanslate = 0;
            scrollValue.value = 0;
          } else {
            syncTanslate = scrollValue.value;
          }
        } else {
          syncTanslate = clamp(
            sharedTranslate,
            0,
            HEADE_HEIGHT - TABBAR_HEIGHT
          );
        }
        scrollTo(animatedRef, 0, syncTanslate, false);
      }
    }
  );

  useEffect(() => {
    if (nativeRef) {
      setNativeRef && setNativeRef(nativeRef);
    }
  }, [nativeGes]);

  useEffect(() => {
    if (animatedRef) {
      setScrollRef && setScrollRef(index, animatedRef);
    }
  }, [animatedRef, index]);

  useEffect(() => {
    if (scrollValue) {
      setScrollValue && setScrollValue(index, scrollValue);
    }
  }, [scrollValue, index]);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {},
    onScroll: (event) => {
      if (currentIdx.value === index) {
        const moveY = Math.max(0, event.contentOffset.y);
        scrollValue.value = moveY;
        sharedTranslate.value = moveY;
      }
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

const useHeadTab = () => {
  // 子scroll当前滚动距离
  const [childScrollValues, setChildScrollValues] = useState<{
    [index: number]: SharedValue<number>;
  }>({});
  // 子scroll的引用ref
  const [childScrollRefs, setChildScrollRefs] = useState<{
    [index: number]: any;
  }>({});
  // 子scroll的Native容器引用ref
  const [childNativeRefs, setChildNativeRefs] = useState<
    React.RefObject<any>[]
  >([]);

  // 用Gesture.Native包裹内部scrollview并获取此ref
  const setNativeRef = useCallback(
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
  const setScrollRef = useCallback(
    (index: number, scrollRef: React.RefObject<any>) => {
      if (!scrollRef) return;
      setChildScrollRefs((preChildRef) => {
        return { ...preChildRef, [index]: scrollRef };
      });
    },
    []
  );

  // 获取内部scrollview的value
  const setScrollValue = useCallback(
    (index: number, scrollValue: SharedValue<number>) => {
      if (!scrollValue) return;
      setChildScrollValues((preChildScrollValues) => {
        return { ...preChildScrollValues, [index]: scrollValue };
      });
    },
    []
  );

  return {
    setNativeRef,
    setScrollRef,
    setScrollValue,
    childNativeRefs,
    childScrollValues,
    childScrollRefs,
  };
};

export default HeadTabView;
