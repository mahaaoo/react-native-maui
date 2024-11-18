import React, { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
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
import { NestedContext, useNestRegister } from './hooks';
import { scrollTo } from './util';
import NestedScene from './NestedScene';

const TABS = ['tab1', 'tab2'];

interface NestedTabViewProps {
  renderHeader: () => React.ReactNode;
  stickyHeight: number;
}

const NestedTabView: React.FC<NestedTabViewProps> = (props) => {
  const { renderHeader, stickyHeight } = props;
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

  const [headerHeight, setHeaderHeight] = useState(0);

  const {
    registerNativeRef,
    childNativeRefs,
    registerChildInfo,
    childInfo,
    isReady,
  } = useNestRegister();

  console.log('是否准备完毕', isReady);

  const handleHeaderLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (headerHeight === e.nativeEvent.layout.height) return;
      setHeaderHeight(e.nativeEvent.layout.height);
    },
    [headerHeight]
  );

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
      [0, headerHeight - stickyHeight],
      [0, -headerHeight + stickyHeight],
      Extrapolation.CLAMP
    );
  }, [integralY, headerHeight]);

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
      <NestedContext.Provider
        value={{
          sharedTranslate,
          currentIdx,
          headerHeight,
          stickyHeight,
        }}
      >
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
                        registerChildInfo,
                        index,
                      }}
                      key={tab}
                    />
                  );
                })}
            </PageView>
            <GestureDetector gesture={headerPan}>
              <Animated.View
                onLayout={handleHeaderLayout}
                style={[styles.headerContainer, headerStyle]}
              >
                {renderHeader && renderHeader()}
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
      </NestedContext.Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
  },
});

export default NestedTabView;
