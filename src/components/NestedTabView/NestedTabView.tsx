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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TabBar, TabBarRef } from '../TabBar';
import { PageStateType, PageView, PageViewRef } from '../PageView';
import { NestedContext, useNestRegister, useVerifyProps } from './hooks';
import { scrollTo } from './util';
import { NestedTabViewProps } from './type';

const NestedTabView: React.FC<NestedTabViewProps> = (props) => {
  const {
    renderHeader,
    stickyHeight = 0,
    children,
    initialIndex = 0,
    style,
    tabProps,
    pageProps,
    onTabPress,
    onPageSelected,
    onPageScroll,
    onPageScrollStateChanged,
  } = useVerifyProps(props);
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

  const currentIdx = useSharedValue(initialIndex);

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
    <NestedContext.Provider
      value={{
        sharedTranslate,
        currentIdx,
        headerHeight,
        stickyHeight,
      }}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[style, containerStyle]}>
          <PageView
            {...{ ...pageProps }}
            ref={pageRef}
            onPageSelected={(currentPage) => {
              tabRef.current &&
                tabRef.current?.keepScrollViewMiddle(currentPage);
              onPageSelected && onPageSelected(currentPage);
              currentIdx.value = currentPage;
            }}
            onPageScroll={(translate) => {
              tabRef.current && tabRef.current?.syncCurrentIndex(translate);
              onPageScroll && onPageScroll(translate);
            }}
            onPageScrollStateChanged={(state: PageStateType) => {
              onPageScrollStateChanged && onPageScrollStateChanged(state);
            }}
          >
            {React.Children.map(children, (child: any, index) => {
              const injectProps = {
                registerNativeRef,
                registerChildInfo,
                index,
              };
              return React.cloneElement(child, injectProps);
            })}
          </PageView>
          <GestureDetector gesture={headerPan}>
            <Animated.View
              onLayout={handleHeaderLayout}
              style={[styles.headerContainer, headerStyle]}
            >
              {renderHeader && renderHeader()}
              <TabBar
                {...{ ...tabProps }}
                ref={tabRef}
                onTabPress={(index) => {
                  pageRef.current && pageRef.current?.setPage(index);
                  onTabPress && onTabPress(index);
                }}
              />
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </GestureDetector>
    </NestedContext.Provider>
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
