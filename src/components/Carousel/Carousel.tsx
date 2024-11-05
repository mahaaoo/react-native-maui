import React, {
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  useRange,
  getStep,
  useAutoScroll,
  useTouching,
  useProps,
} from './utils';
import ItemWrapper from './ItemWrapper';
import {
  CarouselRef,
  CarouselProps,
  CarouselCallBack,
  CarouselContext,
} from './type';

import BaseLayout from './BaseLayout';
import ScaleLayout from './ScaleLayout';
import { Dot, Pagination } from '../Pagination';
import RotateLayout from './RotateLayout';

import { clamp } from '../../utils/redash';
const { width } = Dimensions.get('window');

const Carousel = forwardRef<CarouselRef, CarouselProps>((props, ref) => {
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
    snapToInterval,
    itemSize,
  } = useProps(props);

  // swiper translate: Vertical OR Horizontal, only one direction can work at one time
  const translate = useSharedValue(0);
  const offset = useSharedValue(0);

  // swiper current position
  const currentIndex = useSharedValue(0);
  // fingers is touching the swiper, autoplay will be paused
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

  // Every Carousel move distance
  const stepDistance = useMemo<number>(() => {
    if (snapToInterval) return snapToInterval;
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

  // map curentIndex to index at dataSource
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

  // next index must be in range
  const range = useRange(currentIndex);

  // Reset value, Prevent integer overflow, ONLY autoplay mode effect
  useAnimatedReaction(
    () => translate.value,
    (value: number) => {
      const isReturn =
        Math.abs(value) % (dataSource.length * stepDistance) === 0;

      if (isReturn && auto) {
        console.log('carousel重置数据');
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

  // Carousel Animation will be move actually in this function
  const scrollTo = useCallback(
    (step: number, callback: () => void) => {
      'worklet';
      translate.value = withTiming(
        step * stepDistance,
        {
          duration: 600,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        },
        () => {
          currentIndex.value = step;
          runOnJS(callback)();
        }
      );
    },
    [stepDistance]
  );

  // Pre Page
  const previous = useCallback(
    (callback?: CarouselCallBack) => {
      handleScollStart();
      scrollTo(currentIndex.value + 1, () => {
        handleScollEnd();
        callback && callback(indexAtData.value);
      });
    },
    [scrollTo]
  );

  // Next Page
  const next = useCallback(
    (callback?: CarouselCallBack) => {
      handleScollStart();
      scrollTo(currentIndex.value - 1, () => {
        handleScollEnd();
        callback && callback(indexAtData.value);
      });
    },
    [scrollTo]
  );

  // inital autoplay props
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
        translate.value = clamp(
          translationX + offset.value,
          (currentIndex.value - 1) * stepDistance,
          (currentIndex.value + 1) * stepDistance
        );
      } else {
        translate.value = clamp(
          translationY + offset.value,
          (currentIndex.value - 1) * stepDistance,
          (currentIndex.value + 1) * stepDistance
        );
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

  const renderCarouselItem = useCallback(
    (item: any, index: number) => {
      const Layout = layoutOption?.layout || BaseLayout;

      return (
        <ItemWrapper index={index} key={`LazyWrapper${index}`}>
          <Layout index={index}>{renderItem && renderItem(item)}</Layout>
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
    <CarouselContext.Provider
      value={{
        size: dataSource.length,
        indexAtData,
        currentIndex,
        translate,
        options,
        stepDistance,
        horizontal,
        layoutOption,
        container,
        translateIndex,
        itemSize,
      }}
    >
      <View style={[styles.container, style]} testID={'MAUI-SWIPER-ID'}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={styles.swiperContainer}>
            <View style={[direction]}>
              {dataSource.map(renderCarouselItem)}
            </View>
            <View style={styles.paginationContainer}>
              <Pagination
                currentIndex={translateIndex}
                total={dataSource.length}
              >
                <Dot activeColor="red" inActiveColor="pink" />
              </Pagination>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </CarouselContext.Provider>
  );
});

Carousel.displayName = 'Carousel';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  swiperContainer: {
    flex: 1,
  },
  paginationContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 30,
  },
});

export default Carousel;
