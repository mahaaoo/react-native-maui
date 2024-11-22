import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
} from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { snapPoint, clamp } from '../../utils/redash';
import { PageViewRef, PageViewProps, PageStateType, DURATION } from './type';
import { useVerifyProps } from './hook';
import { isInteger } from '../../utils/typeUtil';
import SinglePage from './SinglePage';

const PageView = forwardRef<PageViewRef, PageViewProps>((props, ref) => {
  const {
    children,
    style,
    contentSize,
    pageSize,
    snapPoints,
    initialPage = 0,
    scrollEnabled = true,
    bounces = true,
    gestureBack = true,
    lazy = false,
    lazyPreloadNumber = 0,
    pageMargin = 0,
    orientation,
    onPageScroll,
    onPageSelected,
    onPageScrollStateChanged,
  } = useVerifyProps(props);

  const isHorizontal = useMemo(() => {
    return orientation === 'horizontal';
  }, [orientation]);

  const getMoveFromIndex = useCallback(
    (page: number) => {
      'worklet';
      return snapPoints[page];
    },
    [snapPoints]
  );

  // 这个暂时没什么用，可能后续ltr or rtl会用到
  const needDirection = useCallback(
    (n: number) => {
      'worklet';
      return -n;
    },
    [orientation]
  );

  const pageMove = useSharedValue(needDirection(getMoveFromIndex(initialPage)));
  const offset = useSharedValue(0);
  const currentIndex = useSharedValue(initialPage);
  const pageState = useSharedValue<PageStateType>('idle');
  const pageScrollEnabled = useSharedValue(scrollEnabled);

  const pageSelected = (nextPage: number) => {
    onPageSelected && onPageSelected(nextPage);
  };

  const pageScrollStateChanged = (state: PageStateType) => {
    onPageScrollStateChanged && onPageScrollStateChanged(state);
  };

  const pageScroll = (translate: number) => {
    onPageScroll && onPageScroll(-translate);
  };

  const setPage = (index: number) => {
    if (!isInteger(index)) {
      throw new Error('index type must be Integer');
    }
    if (index < 0 || index >= pageSize) {
      throw new Error('setPage can only handle index [0, pageSize - 1]');
    }

    moveTo(index);
  };

  const setPageWithoutAnimation = (index: number) => {
    if (!isInteger(index)) {
      throw new Error('index type must be Integer');
    }
    if (index < 0 || index >= pageSize) {
      throw new Error(
        'setPageWithoutAnimation can only handle index [0, pageSize]'
      );
    }

    pageMove.value = needDirection(getMoveFromIndex(index));
    currentIndex.value = index;
    pageState.value = 'idle';
    runOnJS(pageSelected)(index);
  };

  const setScrollEnabled = (scrollEnabled: boolean) => {
    'worklet';
    pageScrollEnabled.value = scrollEnabled;
  };

  const getCurrentPage = () => {
    return currentIndex.value;
  };

  useImperativeHandle(
    ref,
    () => ({
      setPage,
      setPageWithoutAnimation,
      setScrollEnabled,
      getCurrentPage,
    }),
    []
  );

  useAnimatedReaction(
    () => pageState.value,
    (value) => {
      runOnJS(pageScrollStateChanged)(value);
    }
  );

  useAnimatedReaction(
    () => pageMove.value,
    (value) => {
      runOnJS(pageScroll)(value);
    }
  );

  const moveTo = (page: number) => {
    'worklet';
    pageMove.value = withTiming(
      needDirection(getMoveFromIndex(page)),
      { duration: DURATION },
      () => {
        currentIndex.value = page;
        pageState.value = 'idle';
        runOnJS(pageSelected)(page);
      }
    );
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .activeOffsetY([-10, 10])
    .onTouchesDown((event, stateManager) => {
      if (currentIndex.value === 0 && gestureBack) {
        const allTouches = event.allTouches[0];
        if (allTouches.x <= 35) {
          stateManager.fail();
        }
      }
      if (!pageScrollEnabled.value) {
        stateManager.fail();
      }
    })
    .onBegin(() => {
      offset.value = pageMove.value;
    })
    .onUpdate(({ translationX, translationY }) => {
      pageState.value = 'dragging';
      const translation = isHorizontal ? translationX : translationY;
      if (bounces) {
        pageMove.value = translation + offset.value;
      } else {
        pageMove.value = clamp(
          needDirection(translation + offset.value),
          0,
          getMoveFromIndex(pageSize - 1)
        );
      }
    })
    .onEnd(({ velocityX, velocityY }) => {
      pageState.value = 'settling';
      const velocity = isHorizontal ? velocityX : velocityY;
      const dest = snapPoint(
        needDirection(pageMove.value),
        needDirection(velocity),
        snapPoints
      );
      // 每次移动只能切换一个page
      const willToPage = Math.abs(Math.round(dest / contentSize));
      const toValue = clamp(
        willToPage,
        currentIndex.value - 1,
        currentIndex.value + 1
      );

      moveTo(toValue);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: isHorizontal ? pageMove.value : 0,
        },
        {
          translateY: !isHorizontal ? pageMove.value : 0,
        },
      ],
    };
  });

  const directionStyle: any = useMemo(() => {
    return isHorizontal
      ? {
          container: { width: contentSize },
          sence: {
            height: '100%',
            flexDirection: 'row',
            width: getMoveFromIndex(pageSize - 1),
          },
        }
      : {
          container: { height: contentSize },
          sence: {
            width: '100%',
            height: getMoveFromIndex(pageSize - 1),
            backgroundColor: 'red',
          },
        };
  }, [isHorizontal, orientation, contentSize, pageSize, getMoveFromIndex]);

  return (
    <View style={[style, directionStyle.container, { overflow: 'hidden' }]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[directionStyle.sence, animatedStyle]}>
          {React.Children.map(children, (child, index) => {
            return (
              <SinglePage
                contentSize={contentSize}
                currentIndex={currentIndex}
                index={index}
                lazy={lazy}
                lazyPreloadNumber={lazyPreloadNumber}
                pageMargin={pageMargin}
                isHorizontal={isHorizontal}
              >
                {child}
              </SinglePage>
            );
          })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

PageView.displayName = 'PageView';

export default PageView;
