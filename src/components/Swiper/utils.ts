import { useCallback, useEffect, useRef } from 'react';
import Animated, {
  DerivedValue,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  SwiperProps,
  SwiperDefaultProps,
  UseAutoScrollReturn,
  TurnRange,
  SwiperDefaultOptions,
  SwiperCallBackFunction,
} from './type';

// min trggled swiper move distance, is percent width
const MIN_TRIGGER_DISTANCE = 0.5;

// 以下两个参数可以相等、为了防止滑动速度过快一般地 MAX_CAL  > 2 * MAX_RENDER
// const MAX_CAL = 1; // 最大计算范围
// const MAX_RENDER = 1; // 最大渲染范围

/**
 * pre check props
 * @param props SwiperProps
 * @returns SwiperProps
 */
const useProps = (props: SwiperProps): SwiperDefaultProps => {
  const { dataSource, options } = props;
  const length = dataSource.length;
  if (length <= 0) {
    throw new Error("dataSource can't be empty");
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
    defaultOptions.maxComputed = options?.maxComputed || Math.floor(length / 2);
    defaultOptions.maxRender = options?.maxRender || Math.floor(length / 2);
  }

  return { ...props, options: defaultOptions };
};

/**
 * current range
 * @param index current index
 * @returns TurnRange
 */
const useRange = (
  index: Animated.SharedValue<number>
): DerivedValue<TurnRange> => {
  const range = useDerivedValue(() => {
    const inputRange = [
      index.value - MIN_TRIGGER_DISTANCE,
      index.value,
      index.value + MIN_TRIGGER_DISTANCE,
    ];
    const outputRange = [index.value - 1, index.value, index.value + 1];

    return { inputRange, outputRange };
  });

  return range;
};

/**
 * get distance per move
 * @param distance distance
 * @param range TurnRange
 * @returns oneof [-1,0,1]
 */
const getStep = (distance: number, range: DerivedValue<TurnRange>): number => {
  'worklet';
  return Math.round(
    interpolate(
      distance,
      range.value.inputRange,
      range.value.outputRange,
      Extrapolate.CLAMP
    )
  );
};

/**
 * judge the index whether should be rendered
 * @param index item index
 * @param size datasource length
 * @param now current index
 * @returns boolean
 */
const judgeRange = (
  index: number,
  size: number,
  now: number,
  options: SwiperDefaultOptions
): boolean => {
  'worklet';
  const indexAtData = -(now % size);
  const leftEdge = (indexAtData - options.maxComputed) % size;
  const rightEdge = (indexAtData + options.maxComputed) % size;

  const leftIndx = leftEdge < 0 ? size + leftEdge : leftEdge;
  const rightIndx = rightEdge < 0 ? size + rightEdge : rightEdge;

  if (leftIndx < rightIndx) {
    if (!(index >= leftIndx && index <= rightIndx)) {
      return false;
    }
  }
  if (leftIndx > rightIndx) {
    if (
      !(
        (index >= 0 && index <= rightIndx) ||
        (index >= leftIndx && index <= size - 1)
      )
    ) {
      return false;
    }
  }

  return true;
};

/**
 * get move distance
 * @param offset distance
 * @param index item index
 * @param size datasource length
 * @param now distance index
 * @returns number
 */
const getItemOffset = (
  offset: number,
  index: number,
  size: number,
  now: number,
  options: SwiperDefaultOptions
): number => {
  'worklet';

  const renderSize = size;
  const isRange = judgeRange(index, renderSize, now, options);
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
    } else {
      return group + 1;
    }
  }
  if (currentIndex < index) {
    if (index - currentIndex <= options.maxRender) {
      return group;
    } else {
      return group - 1;
    }
  }
  return group;
};

/**
 * set autoplay for swiper
 * @param next next page
 * @param auto is autoplay
 * @param interval timeout ms
 * @returns useAutoScrollReturn
 */
const useAutoScroll = (
  next: SwiperCallBackFunction,
  auto: boolean,
  interval: number
): UseAutoScrollReturn => {
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
    return stop;
  }, [auto, start, stop]);

  return {
    start,
    stop,
    isRuning: isRuning.current,
  };
};

/**
 * when invoke gesture callback
 * @param start start autoplay
 * @param stop stop autoplay
 * @param touching current is touching
 */
const useTouching = (
  start: () => void,
  stop: () => void,
  touching: Animated.SharedValue<boolean>
) => {
  'worklet';
  const handleTouching = useCallback((value: boolean) => {
    if (value) {
      stop();
    } else {
      start();
    }
  }, []);

  useAnimatedReaction(
    () => touching.value,
    (value) => {
      runOnJS(handleTouching)(value);
    }
  );
};

/**
 * get index at data
 * @param currentIndex curentIndex
 * @param size datasource length
 * @returns index at data, range is [0, data.length-1]
 */
const useIndexAtData = (
  currentIndex: Animated.SharedValue<number>,
  size: number
): Animated.DerivedValue<number> => {
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
};

/**
 * animation layout interpolate value
 * @param index item index
 * @param translateIndex translate to index at data, the value is Dynamic
 * @param currentIndex pre index
 * @param translate translate value
 * @param stepDistance distance per move
 * @param size datasource length
 * @param converse animation value is converse, example: [-40, 0, 40] is true, [0.9, 1, 0.9] is false
 * @returns interpolate value
 */
const getLayoutValue = (
  index: number,
  translateIndex: Animated.SharedValue<number>,
  currentIndex: Animated.SharedValue<number>,
  translate: Animated.SharedValue<number>,
  stepDistance: number,
  size: number,
  converse: boolean
): number => {
  'worklet';
  let value = translateIndex.value;
  // current gesture dirction, left > 0 and right < 0, 0 is freeze
  const direction = currentIndex.value - translate.value / stepDistance;
  /**
   * when current index is 0, control 0 card's left card and right card to converse dirction
   */
  if (currentIndex.value === 0) {
    // left card
    if (index === size - 1 && converse) {
      if (direction >= 0) {
        value = size + translateIndex.value; // make value index + 1 to index + 2;
      }
    }
    // right card
    if (index === 0 || index === 1) {
      if (direction < 0) {
        value = translateIndex.value - size; // make value 0 to -1;
      }
    }
  }

  /**
   * when current index is last card, currentIndex.value === 1 and currentIndex.value === 1 - size are the same
   * control 0 card, make it value from -1 to 0
   */
  if (
    (currentIndex.value === 1 || currentIndex.value === 1 - size) &&
    index === 0
  ) {
    value = translateIndex.value - size;
  }

  return value;
};

export {
  useProps,
  useRange,
  getStep,
  getItemOffset,
  judgeRange,
  useAutoScroll,
  useTouching,
  useIndexAtData,
  getLayoutValue,
};
