import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
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
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TabBar, TabBarRef } from '../TabBar';
import { PageStateType, PageView, PageViewRef } from '../PageView';
import { NestedContext, useNestRegister, useVerifyProps } from './hooks';
import { mscrollTo } from './util';
import {
  NestedTabViewProps,
  NestedTabViewRef,
  RefreshStatus,
  RESET_TIMING_EASING,
} from './type';
import { isInteger } from '../../utils/typeUtil';
import RefreshController from './RefreshController';

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
      triggerHeight = 100 * 2,
      refreshing = false,
      refreshControl,
      refreshAnimateType = 'pull',
      needRefresh = false,
      waitForRefresh = true,
      snapEnabled = false,
      onRefresh,
      onNestedScroll,
      onTabPress,
      onPageSelected,
      onPageScroll,
      onPageScrollStateChanged,
    } = useVerifyProps(props);
    const { height: HEIGHT } = useWindowDimensions();
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
    const [tabViewHeight, setTabViewHeight] = useState(0);
    const refreshStatus = useSharedValue<RefreshStatus>(RefreshStatus.Idle);
    const isTouching = useSharedValue(false);

    const isRefreshing = useDerivedValue(() => {
      return !(
        integralY.value === 0 && refreshStatus.value === RefreshStatus.Idle
      );
    }, [refreshStatus, integralY]);

    useAnimatedReaction(
      () => isRefreshing.value,
      (isRefreshing) => {
        pageRef?.current?.setScrollEnabled(!isRefreshing);
      }
    );

    useAnimatedReaction(
      () => sharedTranslate.value,
      (value) => {
        onNestedScroll && runOnJS(onNestedScroll)(value);
      }
    );

    useEffect(() => {
      if (!needRefresh) return;
      if (refreshing) {
        refreshStatus.value = RefreshStatus.Holding;
        const waitingHeight = waitForRefresh ? triggerHeight : 0;
        integralY.value = withTiming(waitingHeight, {
          easing: RESET_TIMING_EASING,
        });
      } else if (refreshStatus.value !== RefreshStatus.Idle) {
        refreshStatus.value = RefreshStatus.Done;
        // refresh animation
        if (waitForRefresh) {
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
        } else {
          refreshStatus.value = RefreshStatus.Idle;
        }
      }
    }, [refreshing, needRefresh, waitForRefresh]);

    const handleRefresh = () => {
      onRefresh && onRefresh();
    };

    const {
      isReady,
      childInfo,
      childNativeRefs,
      registerNativeRef,
      registerChildInfo,
    } = useNestRegister(pageRef, tabRef);

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

    const handleTabViewHeightLayout = useCallback(
      (e: LayoutChangeEvent) => {
        if (tabViewHeight === e.nativeEvent.layout.height) return;
        setTabViewHeight(e.nativeEvent.layout.height);
      },
      [tabViewHeight]
    );

    const childMinHeight = useMemo(() => {
      return headerHeight + tabViewHeight - stickyHeight;
    }, [headerHeight, tabViewHeight, stickyHeight]);

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
        isTouching.value = true;
      })
      .onTouchesUp(() => {
        isTouching.value = false;
      })
      .onBegin(() => {
        integralYOffset.value = integralY.value;
      })
      .onUpdate(({ translationY }) => {
        if (sharedTranslate.value > 0) return;
        if (!needRefresh) return;
        const temp = translationY + integralYOffset.value;
        if (temp > 0) {
          if (sharedTranslate.value > 0) {
            sharedTranslate.value = 0;
          }
          integralY.value = temp;
          if (!refreshing) {
            if (Math.abs(integralY.value) >= triggerHeight) {
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
        if (sharedTranslate.value > 0) return;
        if (!needRefresh) return;
        if (integralY.value < 0) return;
        if (refreshing) {
          if (!waitForRefresh) {
            integralY.value = withTiming(0, {
              easing: RESET_TIMING_EASING,
            });
          } else {
            // 在已经是下拉刷新的状态下，如果继续向下拉，则会回到默认的最大triggleHeight位置处
            // 如果有向上收起的意图，则将下拉区全部收起
            if (integralY.value >= triggerHeight) {
              integralY.value = withTiming(triggerHeight, {
                easing: RESET_TIMING_EASING,
              });
            } else {
              // 这里要做一个snapPoint
              const dest =
                integralY.value <= triggerHeight / 2 ? 0 : triggerHeight;
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
          }
        } else {
          if (integralY.value >= triggerHeight) {
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

    const headerStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: interpolate(
              sharedTranslate.value,
              [0, headerHeight - stickyHeight],
              [0, -headerHeight + stickyHeight],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    });

    const containerStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY:
              refreshAnimateType === 'pull'
                ? interpolate(integralY.value, [0, HEIGHT], [0, HEIGHT / 2])
                : 0,
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
      .onTouchesDown((_, stateManager) => {
        stopScrolling();
        if (isRefreshing.value) {
          stateManager.fail();
        }
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
          childMinHeight,
          isTouching,
          isHeaderDecay,
          snapEnabled,
        }}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[style, containerStyle]}
            onLayout={handleTabViewHeightLayout}
          >
            <PageView
              {...{ ...pageProps }}
              ref={pageRef}
              // 只支持横向滚动
              orientation={'horizontal'}
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
                  nestedIndex: index,
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
        <RefreshController
          scrollOffset={integralY}
          refreshStatus={refreshStatus}
          triggerHeight={triggerHeight}
        >
          {needRefresh && refreshControl && refreshControl()}
        </RefreshController>
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
