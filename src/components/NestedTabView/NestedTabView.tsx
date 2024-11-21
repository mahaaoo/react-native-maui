import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { LayoutChangeEvent, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  withDecay,
  cancelAnimation,
  useDerivedValue,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TabBar, TabBarRef } from '../TabBar';
import { PageStateType, PageView, PageViewRef } from '../PageView';
import { NestedContext, useNestRegister, useVerifyProps } from './hooks';
import { mscrollTo } from './util';
import { NestedTabViewProps, NestedTabViewRef, RefreshStatus } from './type';
import { isInteger } from '../../utils/typeUtil';
import { GestureStateManagerType } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gestureStateManager';

const TRIGGERHEIGHT = 100 * 2;
const RESET_TIMING_EASING = Easing.bezier(0.33, 1, 0.68, 1);

const { height: HEIGHT } = Dimensions.get('window');

const NestedTabView = forwardRef<NestedTabViewRef, NestedTabViewProps>(
  (props, ref) => {
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
    const refreshStatus = useSharedValue<RefreshStatus>(RefreshStatus.Idle);

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
      if (refreshing) {
        refreshStatus.value = RefreshStatus.Holding;
        integralY.value = withTiming(TRIGGERHEIGHT, {
          easing: RESET_TIMING_EASING,
        });
      } else if (refreshStatus.value !== RefreshStatus.Idle) {
        refreshStatus.value = RefreshStatus.Done;
        // refresh animation
        integralY.value = withDelay(
          500,
          withTiming(
            0,
            {
              easing: RESET_TIMING_EASING,
            },
            () => {
              refreshStatus.value = RefreshStatus.Idle;
            }
          )
        );
      }
    }, [refreshing]);

    const handleRefresh = () => {
      console.log('下拉刷新开始');
      setRefreshing(true);
      const end = () => {
        setTimeout(() => {
          console.log('下拉刷新结束');
          setRefreshing(false);
        }, 2000);
      };
      // end();
    };

    useAnimatedReaction(
      () => refreshStatus.value,
      (value) => {
        console.log(value);
      }
    );

    const {
      registerNativeRef,
      childNativeRefs,
      registerChildInfo,
      childInfo,
      isReady,
    } = useNestRegister();

    const setPage = (index: number) => {
      if (!isInteger(index)) {
        throw new Error('index type must be Integer');
      }
      if (index < 0 || index >= tabProps.tabs.length) {
        throw new Error('setPage can only handle index [0, pageSize - 1]');
      }
      pageRef.current && pageRef.current?.setPage(index);
    };

    const getCurrentPage = useCallback(() => {
      return currentIdx.value || 0;
    }, []);

    const scrollTo = useCallback(
      (y: number) => {
        // 在ExpoGo中主动调用这个方法，不会滚动，在web端是可以正常滚动的
        mscrollTo(childInfo[currentIdx.value]?.scrollRef, 0, y, true);
      },
      [childInfo, currentIdx]
    );

    console.log('是否准备完毕', {
      isReady,
    });

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

    // useAnimatedReaction(
    //   () => integralY.value,
    //   (value) => {
    //     console.log(value);
    //   }
    // );

    useAnimatedReaction(
      () => sharedTranslate.value,
      (value) => {
        console.log(value);
      }
    );

    const panGesture = Gesture.Pan()
      .withRef(totalRef)
      .activeOffsetX([-500, 500])
      .activeOffsetY([-10, 10])
      .simultaneousWithExternalGesture(...childNativeRefs, headerRef)
      .onTouchesDown((_, stateManager: GestureStateManagerType) => {
        stopAnimation();
        if (sharedTranslate.value > 0) {
          console.log('手势触发失败', {
            sharedTranslate: sharedTranslate.value,
            integralY: integralY.value,
          });
          stateManager.fail();
        }
      })
      .onBegin(() => {
        integralYOffset.value = integralY.value;
      })
      .onUpdate(({ translationY }) => {
        const temp = translationY + integralYOffset.value;
        if (temp > 0) {
          if (sharedTranslate.value > 0) {
            sharedTranslate.value = 0;
          }
          integralY.value = temp;
          if (!refreshing) {
            if (Math.abs(integralY.value) >= TRIGGERHEIGHT) {
              refreshStatus.value = RefreshStatus.Reached;
            } else {
              refreshStatus.value = RefreshStatus.Pulling;
            }
          }
        } else {
          // console.log(temp);
        }
      })
      .onEnd(() => {
        if (integralY.value < 0) return;
        if (refreshing) {
          // 在已经是下拉刷新的状态下，如果继续向下拉，则会回到默认的最大triggleHeight位置处
          // 如果有向上收起的意图，则将下拉区全部收起
          if (integralY.value >= TRIGGERHEIGHT) {
            integralY.value = withTiming(TRIGGERHEIGHT, {
              easing: RESET_TIMING_EASING,
            });
          } else {
            // 这里要做一个snapPoint
            const dest =
              integralY.value <= TRIGGERHEIGHT / 2 ? 0 : TRIGGERHEIGHT;
            integralY.value = withTiming(
              dest,
              {
                easing: RESET_TIMING_EASING,
              },
              () => {
                if (dest === 0) {
                  refreshStatus.value = RefreshStatus.Idle;
                }
              }
            );
          }
        } else {
          if (integralY.value >= TRIGGERHEIGHT) {
            // 这里触发下拉刷新
            runOnJS(handleRefresh)();
          } else {
            integralY.value = withTiming(
              0,
              {
                easing: RESET_TIMING_EASING,
              },
              () => {
                refreshStatus.value = RefreshStatus.Idle;
              }
            );
          }
        }
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
            translateY: interpolate(
              integralY.value,
              [0, HEIGHT],
              [0, HEIGHT / 2]
            ),
          },
        ],
      };
    });

    const stopScrolling = () => {
      'worklet';
      mscrollTo(
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
          mscrollTo(
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

    useImperativeHandle(ref, () => ({
      getCurrentPage,
      setPage,
      scrollTo,
    }));

    return (
      <NestedContext.Provider
        value={{
          sharedTranslate,
          currentIdx,
          headerHeight,
          stickyHeight,
          refreshStatus,
          integralY,
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
  }
);

NestedTabView.displayName = 'NestedTabView';

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
  },
});

export default NestedTabView;
