import React, { useCallback, useEffect, useRef } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useAnimatedRef,
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  clamp,
  useAnimatedScrollHandler,
  useAnimatedProps,
  cancelAnimation,
  withTiming,
} from 'react-native-reanimated';
import { mscrollTo, mergeProps } from './util';
import { useNested } from './hooks';
import { NestedSceneProps, RefreshStatus } from './type';

const NestedScene: React.FC<NestedSceneProps> = (props) => {
  const {
    registerNativeRef,
    registerChildInfo,
    nestedIndex,
    ScrollableComponent,
    ...restProps
  } = props;
  const {
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
  } = useNested();
  const mergedProps = mergeProps(restProps, headerHeight, childMinHeight);
  const animatedRef = useAnimatedRef<any>();

  const nativeRef = useRef();
  const nativeGes = Gesture.Native().withRef(nativeRef);

  const checkEndScroll = useSharedValue(0);
  const scrollValue = useSharedValue(0);

  const isTouchingPrev = useSharedValue(false);
  const isHeaderDecayPrev = useSharedValue(false);

  // 非当前活动的scrollview不允许滚动
  const scrollEnabledValue = useDerivedValue(() => {
    return (
      currentIdx.value === nestedIndex &&
      refreshStatus.value === RefreshStatus.Idle &&
      integralY.value === 0
    );
  });

  const canSnap = () => {
    'worklet';
    return (
      snapEnabled &&
      currentIdx.value === nestedIndex &&
      refreshStatus.value === RefreshStatus.Idle &&
      integralY.value === 0 &&
      !isTouching.value &&
      !isHeaderDecay.value
    );
  };

  const snap = useCallback(() => {
    'worklet';
    if (!snapEnabled) return;
    cancelAnimation(checkEndScroll);
    if (canSnap() && scrollValue.value < headerHeight - stickyHeight) {
      checkEndScroll.value = 0;
      checkEndScroll.value = withTiming(1, { duration: 100 }, (finished) => {
        if (finished && canSnap()) {
          if (scrollValue.value < (headerHeight - stickyHeight) / 2) {
            mscrollTo(animatedRef, 0, 0, true);
          } else {
            mscrollTo(animatedRef, 0, headerHeight - stickyHeight, true);
          }
        }
      });
    }
  }, [
    snapEnabled,
    animatedRef,
    headerHeight,
    stickyHeight,
    checkEndScroll,
    scrollValue,
    mscrollTo,
  ]);

  useAnimatedReaction(
    () => isTouching.value !== isTouchingPrev.value,
    (result) => {
      if (!result) return;
      isTouchingPrev.value = isTouching.value;
      if (isTouching.value) return;
      snap();
    }
  );

  useAnimatedReaction(
    () => isHeaderDecay.value !== isHeaderDecayPrev.value,
    (result) => {
      if (!result) return;
      isHeaderDecayPrev.value = isHeaderDecay.value;
      if (isHeaderDecay.value) return;
      snap();
    }
  );

  // 向其他非活动的scrollview同步当前滚动距离
  useAnimatedReaction(
    () => {
      return sharedTranslate.value;
    },
    (sharedTranslate) => {
      if (currentIdx.value !== nestedIndex) {
        // 处理切换tab之间，scroll是否重置
        // 当任意一个scroll滑动展示head区域，则重置所有的scrollValue
        let syncTanslate = 0;
        if (sharedTranslate < headerHeight - stickyHeight) {
          syncTanslate = clamp(sharedTranslate, 0, headerHeight - stickyHeight);
          scrollValue.value = syncTanslate;
        } else {
          syncTanslate = scrollValue.value;
        }
        mscrollTo(animatedRef, 0, syncTanslate, false);
      }
    }
  );

  useEffect(() => {
    if (nativeRef) {
      registerNativeRef && registerNativeRef(nativeRef);
    }
  }, [nativeGes]);

  useEffect(() => {
    if (!!scrollValue && !!animatedRef && typeof nestedIndex === 'number') {
      registerChildInfo &&
        registerChildInfo(nestedIndex, scrollValue, animatedRef);
    }
  }, [scrollValue, animatedRef, nestedIndex]);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onBeginDrag: () => {},
      onScroll: (event) => {
        if (
          currentIdx.value === nestedIndex &&
          refreshStatus.value === RefreshStatus.Idle
        ) {
          snap();
          const moveY = Math.max(0, event.contentOffset.y);
          scrollValue.value = moveY;
          sharedTranslate.value = moveY;
        }
      },
      onMomentumEnd: () => {
        // console.log('onMomentumEnd', scrollValue.value);
      },
    },
    [currentIdx, refreshStatus, scrollValue, sharedTranslate]
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      scrollEnabled: scrollEnabledValue.value,
    };
  });

  return (
    <GestureDetector gesture={nativeGes}>
      <ScrollableComponent
        {...mergedProps}
        animatedProps={animatedProps}
        ref={animatedRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={false}
      />
    </GestureDetector>
  );
};

export default NestedScene;
