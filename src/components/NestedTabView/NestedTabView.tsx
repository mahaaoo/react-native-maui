import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
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
  AnimatedRef,
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

const NestedTabView: React.FC<null> = (props) => {
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
    registerNativeRef,
    childNativeRefs,
    registerChildInfo,
    childInfo,
    isReady,
  } = useNest();

  console.log('是否准备完毕', isReady);

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
      // console.log('onBegin');
    })
    .onUpdate(({ translationY }) => {
      // console.log('integralY', translationY);

      integralY.value = translationY + integralYOffset.value;
      // scrollTo(animatedRef, 0, -integralY.value, false);
    })
    .onEnd(() => {
      // console.log('onEnd');
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
    if (!!childInfo[currentIdx.value]?.scrollRef) {
      scrollTo(
        childInfo[currentIdx.value]?.scrollRef,
        0,
        childInfo[currentIdx.value]?.scrollValue.value + 0.1,
        false
      );
    }
  };

  useAnimatedReaction(
    () => headerY.value,
    () => {
      'worklet';
      if (isHeaderDecay.value) {
        scrollTo(
          childInfo[currentIdx.value]?.scrollRef,
          0,
          headerY.value,
          false
        );
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
        headerYOffset.value = childInfo[currentIdx.value]?.scrollValue.value;
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
                  <NestedScene
                    {...{
                      registerNativeRef,
                      index,
                      sharedTranslate,
                      currentIdx,
                      registerChildInfo,
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

interface NestedSceneProps {
  registerNativeRef: (ref: React.RefObject<any>) => void;
  registerChildInfo: (
    index: number,
    scrollValue: SharedValue<number>,
    scrollRef: AnimatedRef<any>
  ) => void;
  index: number;
  sharedTranslate: SharedValue<number>;
  currentIdx: SharedValue<number>;
}

const NestedScene: React.FC<NestedSceneProps> = ({
  registerNativeRef,
  registerChildInfo,
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
        // 当任意一个scroll滑动展示head区域，则重置所有的scrollValue
        let syncTanslate = 0;
        if (sharedTranslate < HEADE_HEIGHT - TABBAR_HEIGHT) {
          syncTanslate = clamp(
            sharedTranslate,
            0,
            HEADE_HEIGHT - TABBAR_HEIGHT
          );
          scrollValue.value = syncTanslate;
        } else {
          syncTanslate = scrollValue.value;
        }
        scrollTo(animatedRef, 0, syncTanslate, false);
      }
    }
  );

  useEffect(() => {
    if (nativeRef) {
      registerNativeRef && registerNativeRef(nativeRef);
    }
  }, [nativeGes]);

  useEffect(() => {
    if (!!scrollValue && !!animatedRef) {
      registerChildInfo && registerChildInfo(index, scrollValue, animatedRef);
    }
  }, [scrollValue, animatedRef, index]);

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
      // console.log('onMomentumEnd', scrollValue.value);
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

interface ChildInfoType {
  scrollValue: SharedValue<number>;
  scrollRef: AnimatedRef<any>;
}

const useNest = () => {
  const [childInfo, setChildInfo] = useState<{
    [index: number]: ChildInfoType;
  }>({});

  // 子scroll的Native容器引用ref
  const [childNativeRefs, setChildNativeRefs] = useState<
    React.RefObject<any>[]
  >([]);

  const isReady = useMemo(() => {
    return Object.keys(childInfo).length > 0 && childNativeRefs.length > 0;
  }, [childInfo, childNativeRefs]);

  // 用Gesture.Native包裹内部scrollview并获取此ref
  const registerNativeRef = useCallback(
    (ref: React.RefObject<any>) => {
      if (!ref) return;
      const findRef = childNativeRefs?.find(
        (item) => item.current === ref.current
      );
      if (findRef) return;
      setChildNativeRefs((prechildRefs) => {
        return [...prechildRefs, ref];
      });
    },
    [childNativeRefs]
  );

  const registerChildInfo = useCallback(
    (
      index: number,
      scrollValue: SharedValue<number>,
      scrollRef: AnimatedRef<any>
    ) => {
      setChildInfo((preChildInfo) => {
        return {
          ...preChildInfo,
          [index]: {
            scrollValue,
            scrollRef,
          },
        };
      });
    },
    []
  );

  return {
    registerNativeRef,
    childNativeRefs,
    registerChildInfo,
    childInfo,
    isReady,
  };
};

export default NestedTabView;
