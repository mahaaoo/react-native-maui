import { useCallback, useEffect, useRef } from "react";
import Animated, { DerivedValue, Extrapolate, interpolate, runOnJS, useAnimatedReaction, useDerivedValue } from "react-native-reanimated";
import {SwiperProps, SwiperDefaultProps, UseAutoScrollReturn, TurnRange, SwiperDefaultOptions, SwiperCallBackFunction} from './type';

const MIN_TRIGGER_DISTANCE = 0.5; // 最小触发翻页移动距离
// 以下两个参数可以相等、为了防止滑动速度过快一般地 MAX_CAL  > 2 * MAX_RENDER
// const MAX_CAL = 1; // 最大计算范围
// const MAX_RENDER = 1; // 最大渲染范围

/**
 * 处理参数
 * @param props SwiperProps
 * @returns SwiperProps
 */
const useProps = (props: SwiperProps): SwiperDefaultProps => {
  const {dataSource, options} = props;
  const length = dataSource.length;
  if (length <= 0) {
    throw new Error('dataSource can\'t be empty');
  }
  if (length === 1) {
    dataSource.push(dataSource[0]);
    dataSource.push(dataSource[0]);
  }
  if (length === 2) {
    dataSource.push(dataSource[1]);
  }

  const defaultOptions = {
    maxComputed: 0,
    maxRender: 0,
  };

  if (length >= 10) {
    defaultOptions.maxComputed = options?.maxComputed || 4;
    defaultOptions.maxRender = options?.maxRender || 4;
  } else {
    defaultOptions.maxComputed = options?.maxComputed || Math.floor(length/2);
    defaultOptions.maxRender = options?.maxRender || Math.floor(length/2);
  }

  return {...props, options: defaultOptions};
}

/**
 * 
 * @param index 当前所处的视图索引
 * @returns []
 */
const useRange = (index: Animated.SharedValue<number>): DerivedValue<TurnRange> => {
  const range = useDerivedValue(() => {
    const inputRange = [
      index.value - MIN_TRIGGER_DISTANCE,
      index.value,
      index.value + MIN_TRIGGER_DISTANCE,
    ];
    const outputRange = [
      index.value - 1, 
      index.value, 
      index.value + 1, 
    ];
    return {inputRange, outputRange}
  }, [index]);

  return range;
}

/**
 * 
 * @param distance 本次移动距离与width比值
 * @param range 本次移动的距离是否构成一次移动（上一页、保持不动、下一页）
 * @returns -1、0、1
 */
const useStep = (distance: number, range: DerivedValue<TurnRange>): number => {
  'worklet'
  return Math.round(interpolate(distance, range.value.inputRange, range.value.outputRange, Extrapolate.CLAMP));
}

/**
 * 判断当前index是否处于渲染范围内
 * @param index 子视图索引
 * @param size 数据规模
 * @param now 当前指向
 * @returns boolean
 */
const useJudgeRange = (index: number, size: number, now: number, options: SwiperDefaultOptions): boolean => {
  'worklet';
  const indexAtData = -(now % size);
  let leftEdge = (indexAtData - options.maxComputed) % size;
  let rightEdge = (indexAtData + options.maxComputed) % size;

  let leftIndx = leftEdge < 0 ? size + leftEdge : leftEdge;
  let rightIndx = rightEdge < 0 ? size + rightEdge : rightEdge;

  if(leftIndx < rightIndx) {
    if (!(index >= leftIndx && index <= rightIndx)) {
      return false;
    }  
  }
  if (leftIndx > rightIndx) {
    if (!((index >= 0 && index <= rightIndx) || (index >= leftIndx && index <= size - 1))) {
      return false;
    }
  }

  return true;
}

/**
 * 
 * @param offset 本次移动距离
 * @param index 本视图索引
 * @param size data.length
 * @param now 当前swiper所展示的视图索引
 * @returns number
 */
 const useItemOffset = (offset: number, index: number, size: number, now: number, options: SwiperDefaultOptions): number => {
  'worklet';

  const renderSize = size;
  const isRange = useJudgeRange(index, renderSize, now, options);
  if (!isRange) return 0;

  const group = Math.floor(offset / renderSize);
  let currentIndex;
  if (offset >= 0) {
    currentIndex = Math.abs(offset % size);
  } else {
    currentIndex = Math.abs((offset + Math.abs(group) * size) % size);
  }
  
  if (currentIndex > index) {
    if (currentIndex - index <= options.maxRender) {
      return group;
    }  else {
      return group + 1;
    }
  }
  if (currentIndex < index) {
    if (index - currentIndex <= options.maxRender) {
      return group;
    }  else {
      return group - 1;
    }
  }
  return group;
}


/**
 * 
 * @param next 下一页
 * @param auto 是否自动播放
 * @param interval 播放间隔
 * @returns useAutoScrollReturn
 */
const useAutoScroll = (next: SwiperCallBackFunction, auto: boolean, interval: number): UseAutoScrollReturn => {
  const timeout = useRef<NodeJS.Timer>();
  const isRuning = useRef<boolean>(auto);

  const run = useCallback(() => {
    if (isRuning.current) {
      timeout.current && clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        next(run);
      }, interval);  
    }
  }, [next, interval, auto]);

  const start = useCallback(() => {
    if (auto) {
      isRuning.current = true;
      run();  
    }
  }, [run, auto]);

  const stop = useCallback(() => {
    isRuning.current = false;
    timeout.current && clearTimeout(timeout.current);
  }, []);

  useEffect(() => {
    if (auto) {
      start();
    } else {
      stop();
    }
    return stop
  }, [auto, start, stop]);

  return {
    start,
    stop,
    isRuning: isRuning.current,
  }
}

/**
 * 
 * @param start 开始播放
 * @param stop 停止播放
 * @param touching 当前是否处于被触摸状态
 */
const useTouching = (start: () => void, stop: () => void, touching: Animated.SharedValue<boolean>) => {
  'worklet';
  const handleTouching = useCallback((value: boolean) => {
    if (value) {
      stop();
    } else {
      start();
    }  
  }, []);

  useAnimatedReaction(() => touching.value, (value) => {
    runOnJS(handleTouching)(value)
  });
}

/**
 * 获取当前所处数据源中的索引
 * @param currentIndex 当前位置
 * @param size 数据源
 * @returns 当前位置在数据源中的索引
 */
const useIndexAtData = (currentIndex: Animated.SharedValue<number>, size: number): Animated.DerivedValue<number> => {
  const index = useDerivedValue(() => {
    let group = currentIndex.value % size;
    if (group < 0) {      
      group = Math.abs(group);
    } else if (group > 0) {
      group = size - group;
    }    
    return group;
  });

  return index;
}

export {
  useProps,
  useRange,
  useStep,
  useItemOffset,
  useJudgeRange,
  useAutoScroll,
  useTouching,
  useIndexAtData,
}