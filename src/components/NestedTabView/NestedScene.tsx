import React, { useEffect, useRef } from 'react';
import { Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  AnimatedRef,
  useAnimatedRef,
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  clamp,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { scrollTo } from './util';

const HEADE_HEIGHT = 180;
const TABBAR_HEIGHT = 55;

interface NestedSceneProps {
  registerNativeRef: (ref: React.RefObject<any>) => void;
  registerChildInfo: (
    index: number,
    scrollValue: SharedValue<number>,
    scrollRef: AnimatedRef<any>
  ) => void;
  index: number;
  sharedTranslate: SharedValue<number>;
  currentIdx: SharedValue<number>;
}

const NestedScene: React.FC<NestedSceneProps> = ({
  registerNativeRef,
  registerChildInfo,
  index,
  sharedTranslate,
  currentIdx,
}) => {
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
        if (sharedTranslate < HEADE_HEIGHT - TABBAR_HEIGHT) {
          syncTanslate = clamp(
            sharedTranslate,
            0,
            HEADE_HEIGHT - TABBAR_HEIGHT
          );
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
    if (!!scrollValue && !!animatedRef) {
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
      <Animated.ScrollView
        ref={animatedRef}
        onScroll={scrollHandler}
        style={{ flex: 1, backgroundColor: 'pink' }}
        contentContainerStyle={{ paddingTop: HEADE_HEIGHT }}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: HEADE_HEIGHT - 44 }}
        bounces={false}
      >
        {new Array(80).fill(0).map((item, index) => {
          return (
            <Text key={index} style={{ margin: 10, fontSize: 20 }}>
              {index}
            </Text>
          );
        })}
      </Animated.ScrollView>
    </GestureDetector>
  );
};

export default NestedScene;
