import React, { useRef } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  withDecay,
  cancelAnimation,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { TabBar, TabBarRef } from '../TabBar';
import { PageView, PageViewRef } from '../PageView';
import { useNest } from './hooks';
import { scrollTo } from './util';
import NestedScene from './NestedScene';

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
    scrollTo(
      childInfo[currentIdx.value]?.scrollRef,
      0,
      childInfo[currentIdx.value]?.scrollValue.value + 0.1,
      false
    );
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

export default NestedTabView;
