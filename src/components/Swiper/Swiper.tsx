import React, {useCallback, forwardRef, useImperativeHandle, useMemo} from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  interpolate,
  runOnJS, 
  useDerivedValue, 
  useSharedValue, 
  withSpring
} from 'react-native-reanimated';
import Pagination from '../Pagination';
import {useRange, useStep, useAutoScroll, useTouching, useProps} from './hook';
import ItemWrapper from './ItemWrapper';
import {SwiperRef, SwiperProps, SwiperCallBack} from './type';

const {width} = Dimensions.get('window');

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
    style
  } = useProps(props);
  const translate = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const touching = useSharedValue<boolean>(false);
  const offset = useSharedValue(0);

  const container = useMemo(() => {
    if (style) {
      return {
        width: Number(style.width) || width,
        height: Number(style.height) || 200,
      }
    }
    return {
      width,
      height: 200,
    }
  }, [style]);

  const stepDistance = useMemo<number>(() => {
    currentIndex.value = 0;
    translate.value = 0;
    if (horizontal) {
      return container.width;
    }
    return container.height;
  }, [horizontal, container])

  const index = useDerivedValue(() => {
    const group = currentIndex.value % dataSource.length;
    return interpolate(group, [-1, 0, 1], [1, 0, dataSource.length - 1]);
  });

  const range = useRange(currentIndex);

  const handleScollStart = useCallback(() => {
    onScollStart && onScollStart();
  }, [onScollStart]);

  const handleScollEnd = useCallback(() => {
    onScollEnd && onScollEnd();
  }, [onScollEnd]);

  const scrollTo = useCallback((step, callback: () => void) => {
    'worklet';
    currentIndex.value = step;
    translate.value = withSpring((step) * stepDistance, {overshootClamping: true}, () => runOnJS(callback)());
  }, [stepDistance]);

  const previous = useCallback((callback?: SwiperCallBack) => {
    handleScollStart();
    scrollTo(currentIndex.value + 1, () => {
      handleScollEnd();
      callback && callback(index.value);
    });
  }, [scrollTo]);

  const next = useCallback((callback?: SwiperCallBack) => {
    handleScollStart();
    scrollTo(currentIndex.value - 1, () => {
      handleScollEnd();
      callback && callback(index.value);
    });
  }, [scrollTo]);

  const {start, stop} = useAutoScroll(next, auto, interval);
  useTouching(start, stop, touching);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(handleScollStart)();
      touching.value = true;
      offset.value = translate.value;
    })
    .onUpdate(({translationX, translationY}) => {
      if (horizontal) {
        translate.value = translationX + offset.value;
      } else {
        translate.value = translationY + offset.value;
      }
    })
    .onEnd(({velocityX, velocityY}) => {
      const velocity = horizontal ? velocityX : velocityY;
      const distance = (translate.value + 0.2 * velocity) / stepDistance;
      const step = useStep(distance, range);
      touching.value = false;
      scrollTo(step, handleScollEnd);
    })

  useImperativeHandle(ref, () => ({
    previous,
    next,
    getCurrentIndex: () => index.value,
  }), [currentIndex, scrollTo, dataSource]);

  return (
    <View style={[styles.container, style]} testID={"test-swiper"}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={{flex: 1}}>
          <View style={[styles.swiper , {
            flexDirection: horizontal ? 'row' : 'column',
          }]}>
            {dataSource.map((item: any, index: number) => {
              return (
                <ItemWrapper 
                  size={dataSource.length}
                  item={item}
                  renderItem={renderItem}
                  index={index} 
                  key={`LazyWrapper${index}`} 
                  {...{currentIndex, translate, options, stepDistance, horizontal}}
                />
              )
            })}
            <View style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 30,
            }}>
              <Pagination currentIndex={index} dataNumber={dataSource.length} />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width,
  },
  swiper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  }
});

export default Swiper;
