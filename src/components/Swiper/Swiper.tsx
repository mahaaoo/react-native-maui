import React, {
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  useRange,
  getStep,
  useAutoScroll,
  useTouching,
  useProps,
} from './utils';
import ItemWrapper from './ItemWrapper';
import { SwiperRef, SwiperProps, SwiperCallBack } from './type';

import BaseLayout from './BaseLayout';
import ScaleLayout from './ScaleLayout';
import { Dot, Pagination } from '../Pagination';
import RotateLayout from './RotateLayout';

const { width } = Dimensions.get('window');

const Swiper = forwardRef<SwiperRef, SwiperProps>((props, ref) => {
  const {
    dataSource,
    renderItem,
    onScollStart,
    onScollEnd,
    auto = false,
    interval = 1000,
    horizontal = false,
    options,
    style,
    layoutOption,
  } = useProps(props);

  const offset = useSharedValue(0);
  const translate = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const touching = useSharedValue<boolean>(false);

  const container = useMemo(() => {
    if (style) {
      return {
        width: Number(style.width) || width,
        height: Number(style.height) || 200,
      };
    }
    return {
      width,
      height: 200,
    };
  }, []);

  const stepDistance = useMemo<number>(() => {
    if (layoutOption?.layout === ScaleLayout) {
      return (
        layoutOption?.options.mainAxisSize + 2 * layoutOption?.options.margin
      );
    } else if (layoutOption?.layout === RotateLayout) {
      return layoutOption?.options.mainAxisSize;
    } else {
      if (horizontal) {
        return container.width;
      }
      return container.height;
    }
  }, []);

  const indexAtData = useDerivedValue(() => {
    let group = currentIndex.value % dataSource.length;
    if (group < 0) {
      group = Math.abs(group);
    } else if (group > 0) {
      group = dataSource.length - group;
    }
    return group;
  });

  const translateIndex = useDerivedValue(() => {
    let group = (translate.value / stepDistance) % dataSource.length;
    if (group < 0) {
      group = Math.abs(group);
    } else if (group > 0) {
      group = dataSource.length - group;
    }

    return group;
  });

  const range = useRange(currentIndex);
  // reset values
  useAnimatedReaction(
    () => translate.value,
    (value: number) => {
      const isReturn =
        Math.abs(value) % (dataSource.length * stepDistance) === 0;

      if (isReturn) {
        currentIndex.value = 0;
        translate.value = 0;
      }
    }
  );

  const handleScollStart = useCallback(() => {
    onScollStart && onScollStart();
  }, []);

  const handleScollEnd = useCallback(() => {
    onScollEnd && onScollEnd(indexAtData.value);
  }, []);

  const scrollTo = useCallback(
    (step, callback: () => void) => {
      'worklet';
      translate.value = withSpring(
        step * stepDistance,
        { overshootClamping: true },
        () => {
          currentIndex.value = step;
          runOnJS(callback)();
        }
      );
    },
    [stepDistance]
  );

  const previous = useCallback(
    (callback?: SwiperCallBack) => {
      handleScollStart();
      scrollTo(currentIndex.value + 1, () => {
        handleScollEnd();
        callback && callback(indexAtData.value);
      });
    },
    [scrollTo]
  );

  const next = useCallback(
    (callback?: SwiperCallBack) => {
      handleScollStart();
      scrollTo(currentIndex.value - 1, () => {
        handleScollEnd();
        callback && callback(indexAtData.value);
      });
    },
    [scrollTo]
  );

  const { start, stop } = useAutoScroll(next, auto, interval);
  useTouching(start, stop, touching);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(handleScollStart)();
      touching.value = true;
      offset.value = translate.value;
    })
    .onUpdate(({ translationX, translationY }) => {
      if (horizontal) {
        translate.value = translationX + offset.value;
      } else {
        translate.value = translationY + offset.value;
      }
    })
    .onEnd(({ velocityX, velocityY }) => {
      const velocity = horizontal ? velocityX : velocityY;
      const distance = (translate.value + 0.2 * velocity) / stepDistance;
      const step = getStep(distance, range);
      touching.value = false;

      scrollTo(step, handleScollEnd);
    });

  useImperativeHandle(
    ref,
    () => ({
      previous,
      next,
      getCurrentIndex: () => Math.abs(indexAtData.value),
    }),
    [currentIndex, scrollTo, dataSource]
  );

  const renderSwiperItem = useCallback(
    (item: any, index: number) => {
      const Layout = layoutOption?.layout || BaseLayout;

      return (
        <ItemWrapper
          size={dataSource.length}
          key={`LazyWrapper${index}`}
          {...{ index, currentIndex, options }}
        >
          <Layout
            size={dataSource.length}
            {...{
              index,
              indexAtData,
              currentIndex,
              translate,
              options,
              stepDistance,
              horizontal,
              layoutOption,
              container,
              translateIndex,
            }}
          >
            {renderItem && renderItem(item)}
          </Layout>
        </ItemWrapper>
      );
    },
    [layoutOption]
  );

  const direction: { flexDirection: 'row' | 'column' } = useMemo(() => {
    if (horizontal) {
      return {
        flexDirection: 'row',
      };
    }
    return {
      flexDirection: 'column',
    };
  }, [horizontal]);

  return (
    <View style={[styles.container, style]} testID={'test-swiper'}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.swiperContainer}>
          <View style={[styles.swiper, direction]}>
            {dataSource.map(renderSwiperItem)}
          </View>
          <View style={styles.paginationContainer}>
            <Pagination currentIndex={translateIndex} total={dataSource.length}>
              <Dot activeColor="red" inActiveColor="pink" />
            </Pagination>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width,
    backgroundColor: 'white',
  },
  swiperContainer: {
    flex: 1,
  },
  swiper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  paginationContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 30,
  },
});

export default Swiper;
