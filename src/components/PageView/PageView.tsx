import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { snapPoint, clamp } from '../../index';
import { PageViewRef, PageViewProps, PageStateType, DURATION } from './type';
import { useVerifyProps } from './hook';
import SiglePage from './SiglePage';

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
    onPageScroll,
    onPageSelected,
    onPageScrollStateChanged,
  } = useVerifyProps(props);

  const pageMove = useSharedValue(-initialPage * contentSize);
  const offset = useSharedValue(0);
  const currentPage = useSharedValue(initialPage);
  const pageState = useSharedValue<PageStateType>('idle');

  const pageSelected = (nextPage: number) => {
    onPageSelected && onPageSelected(nextPage);
  };

  const pageScrollStateChanged = (state: PageStateType) => {
    onPageScrollStateChanged && onPageScrollStateChanged(state);
  };

  const pageScroll = (translate: number) => {
    onPageScroll && onPageScroll(Math.abs(translate));
  };

  const setPage = (index: number) => {
    moveTo(index);
  };

  const setPageWithoutAnimation = (index: number) => {
    pageMove.value = -index * contentSize;
    currentPage.value = index;
    pageState.value = 'idle';
    runOnJS(pageSelected)(index);
  };

  const getCurrentPage = () => {
    return currentPage.value;
  };

  useImperativeHandle(
    ref,
    () => ({
      setPage,
      setPageWithoutAnimation,
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
      -page * contentSize,
      { duration: DURATION },
      () => {
        const nextPage = Math.abs(Math.round(pageMove.value / contentSize));
        currentPage.value = nextPage;
        pageState.value = 'idle';
        runOnJS(pageSelected)(nextPage);
      }
    );
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onTouchesDown((event, stateManager) => {
      if (currentPage.value === 0 && gestureBack) {
        const allTouches = event.allTouches[0];
        if (allTouches.x <= 35) {
          stateManager.fail();
        }
      }
      if (scrollEnabled === false) {
        stateManager.fail();
      }
    })
    .onBegin(() => {
      offset.value = pageMove.value;
    })
    .onUpdate(({ translationX }) => {
      pageState.value = 'dragging';
      if (bounces) {
        pageMove.value = translationX + offset.value;
      } else {
        pageMove.value = clamp(
          translationX + offset.value,
          -(pageSize - 1) * contentSize,
          0
        );
      }
    })
    .onEnd(({ velocityX }) => {
      pageState.value = 'settling';
      const dest = snapPoint(pageMove.value, velocityX, snapPoints);
      // 每次移动只能切换一个page
      const willToPage = Math.abs(Math.round(dest / contentSize));
      const toValue = clamp(
        willToPage,
        currentPage.value - 1,
        currentPage.value + 1
      );

      moveTo(toValue);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: pageMove.value,
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1, width: contentSize, overflow: 'hidden' }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            style,
            {
              flexDirection: 'row',
              width: contentSize * pageSize,
            },
            animatedStyle,
          ]}
        >
          {React.Children.map(children, (child) => {
            return <SiglePage contentSize={contentSize}>{child}</SiglePage>;
          })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

export default PageView;
