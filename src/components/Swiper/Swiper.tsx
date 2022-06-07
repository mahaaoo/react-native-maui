import React, {useCallback, forwardRef, useImperativeHandle, useMemo} from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  runOnJS, 
  useDerivedValue, 
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Pagination from './Pagination';
import {useRange, useStep, useAutoScroll, useTouching, useProps} from './hook';
import ItemWrapper from './ItemWrapper';
import {SwiperRef, SwiperProps, SwiperCallBack} from './type';

import BaseLayout from './BaseLayout';
import ScaleLayout from './ScaleLayout';

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
    style,
    layoutOption,
  } = useProps(props);

  const translate = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const touching = useSharedValue<boolean>(false);
  const offset = useSharedValue(0);
  const scrolling = useSharedValue(0);
  
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
  }, []);

  const stepDistance = useMemo<number>(() => {
    currentIndex.value = 0;
    translate.value = 0;
    offset.value = 0;

    if (layoutOption?.layout === ScaleLayout) {
      return layoutOption?.options.mainAxisSize + 2 * layoutOption?.options.margin;
    } else {
      if (horizontal) {
        return container.width;
      }
      return container.height;  
    }
  }, [horizontal, container, layoutOption])

  const indexAtData = useDerivedValue(() => {
    let group = currentIndex.value % dataSource.length;
    if (group < 0) {      
      group = Math.abs(group);
    } else if (group > 0) {
      group = dataSource.length - group;
    }    
    return group;
  });

  const range = useRange(currentIndex);

  const handleScollStart = useCallback(() => {
    setTimeout(() => {
      if (scrolling.value <= 0) {
        onScollStart && onScollStart();
      }
    }, 100)
  }, []);

  const handleScollEnd = useCallback(() => {
    // 100ms后再次检查滚动状态
    setTimeout(() => {
      if (scrolling.value <= 0) {
        onScollEnd && onScollEnd();
      }
    }, 100)
  }, []);

  const scrollTo = useCallback((step, callback: () => void) => {
    'worklet';
    currentIndex.value = step;
    if(scrolling.value <= 0) {
      runOnJS(handleScollStart)();
    }
    scrolling.value = scrolling.value + 1;
    translate.value = withSpring((step) * stepDistance, {overshootClamping: true}, () => {
      scrolling.value = scrolling.value - 1;
      if(scrolling.value <= 0) {
        runOnJS(callback)();
      }
    });
  }, [stepDistance]);

  const previous = useCallback((callback?: SwiperCallBack) => {
    scrollTo(currentIndex.value + 1, () => {
      handleScollEnd();
      callback && callback(indexAtData.value);
    });
  }, [scrollTo]);

  const next = useCallback((callback?: SwiperCallBack) => {
    scrollTo(currentIndex.value - 1, () => {
      handleScollEnd();
      callback && callback(indexAtData.value);
    });
  }, [scrollTo]);

  const {start, stop} = useAutoScroll(next, auto, interval);
  useTouching(start, stop, touching);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
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
    getCurrentIndex: () => Math.abs(indexAtData.value),
  }), [currentIndex, scrollTo, dataSource]);

  const renderSwiperItem = useCallback((item: any, index: number) => {
    const Layout = layoutOption?.layout || BaseLayout;

    return (
      <ItemWrapper 
        size={dataSource.length}
        key={`LazyWrapper${index}`}
        {...{index, currentIndex, options}}
      >
        <Layout
          size={dataSource.length}
          {...{index, indexAtData, currentIndex, translate, options, stepDistance, horizontal, layoutOption, container}}
        >
          {renderItem && renderItem(item)}
        </Layout>
      </ItemWrapper>
    )
  }, [layoutOption]);

  return (
    <View style={[styles.container, style]} testID={"test-swiper"}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={{flex: 1}}>
          <View style={[styles.swiper , {
            flexDirection: horizontal ? 'row' : 'column',
          }]}>
            {dataSource.map(renderSwiperItem)}
            <View style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 30,
            }}>
              <Pagination currentIndex={indexAtData} dataNumber={dataSource.length} />
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
