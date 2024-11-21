import React, { useEffect, useRef } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useAnimatedRef,
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  clamp,
  useAnimatedScrollHandler,
  useAnimatedProps,
} from 'react-native-reanimated';
import { mscrollTo, mergeProps } from './util';
import { useNested } from './hooks';
import { NestedSceneProps, RefreshStatus } from './type';

const NestedScene: React.FC<NestedSceneProps> = (props) => {
  const {
    registerNativeRef,
    registerChildInfo,
    index,
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
  } = useNested();
  const mergedProps = mergeProps(restProps, headerHeight);
  const animatedRef = useAnimatedRef<any>();

  const nativeRef = useRef();
  const nativeGes = Gesture.Native().withRef(nativeRef);

  const scrollValue = useSharedValue(0);

  // 非当前活动的scrollview不允许滚动
  const scrollEnabledValue = useDerivedValue(() => {
    return (
      currentIdx.value === index &&
      refreshStatus.value === RefreshStatus.Idle &&
      integralY.value === 0
    );
  });

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
    if (!!scrollValue && !!animatedRef && typeof index === 'number') {
      registerChildInfo && registerChildInfo(index, scrollValue, animatedRef);
    }
  }, [scrollValue, animatedRef, index]);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onBeginDrag: () => {},
      onScroll: (event) => {
        if (
          currentIdx.value === index &&
          refreshStatus.value === RefreshStatus.Idle
        ) {
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
