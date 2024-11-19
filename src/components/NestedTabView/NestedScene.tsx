import React, { useEffect, useRef } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useAnimatedRef,
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  clamp,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { scrollTo } from './util';
import { useNested } from './hooks';
import { NestedSceneProps } from './type';

const NestedScene: React.FC<NestedSceneProps> = (props) => {
  const {
    registerNativeRef,
    registerChildInfo,
    index,
    ScrollableComponent,
    ...restProps
  } = props;
  const { sharedTranslate, currentIdx, headerHeight, stickyHeight } =
    useNested();
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
        if (sharedTranslate < headerHeight - stickyHeight) {
          syncTanslate = clamp(sharedTranslate, 0, headerHeight - stickyHeight);
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
    if (!!scrollValue && !!animatedRef && index) {
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
      <ScrollableComponent
        {...restProps}
        ref={animatedRef}
        onScroll={scrollHandler}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: headerHeight }}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: headerHeight - 44 }}
        bounces={false}
      />
    </GestureDetector>
  );
};

export default NestedScene;
