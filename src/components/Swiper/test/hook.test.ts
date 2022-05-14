import {renderHook} from '@testing-library/react-hooks';
import {
  withReanimatedTimer
} from 'react-native-reanimated/src/reanimated2/jestUtils'
import {
  useProps,
  useRange,
  useJudgeRange,
  useItemOffset,
  useAutoScroll
} from '../hook';

test('Test:Swiper->hook/useJudgeRange', () => {
  // dataSource is empty
  const test1 = {
    dataSource: [],
    renderItem: () => null
  }
  expect(() => useProps(test1)).toThrow('dataSource can\'t be empty');  
  // dataSource's length is 1
  const test2 = {
    dataSource: [1],
    renderItem: () => null
  }
  const result2 = useProps(test2);
  expect(result2.dataSource).toEqual([1, 1, 1]);
  
  // dataSource's length is 2
  const test3 = {
    dataSource: [1, 2],
    renderItem: () => null
  }
  const result3 = useProps(test3);
  expect(result3.dataSource).toEqual([1, 2, 2]);
  
  // defaultOptions test
  const test4 = {
    dataSource: new Array(5),
    renderItem: () => null
  }
  const result4 = useProps(test4);
  expect(result4.options).toEqual({
    maxComputed: 2,
    maxRender: 2,
  });

  const test5 = {
    dataSource: new Array(10),
    renderItem: () => null
  }
  const result5 = useProps(test5);
  expect(result5.options).toEqual({
    maxComputed: 4,
    maxRender: 4,
  });

  // defaultOptions mix options test
  const test6 = {
    dataSource: new Array(5),
    renderItem: () => null,
    options: {
      maxComputed: 3
    }
  }
  const result6 = useProps(test6);
  expect(result6.options).toEqual({
    maxComputed: 3,
    maxRender: 2,
  });

  const test7 = {
    dataSource: new Array(5),
    renderItem: () => null,
    options: {
      maxRender: 3
    }
  }
  const result7 = useProps(test7);
  expect(result7.options).toEqual({
    maxComputed: 2,
    maxRender: 3,
  });
});

test('Test:Swiper->hook/useRange', async () => {
  withReanimatedTimer(() => {
    let range: {
      inputRange: number[],
      outputRange: number[],
    } = {
      inputRange: [],
      outputRange: [],
    };

    renderHook(() => {
      range = useRange({
        value: 1,
      }).value;
    });

    if (!!range) {
      expect(range.inputRange).toEqual([0.5, 1, 1.5]);
      expect(range.outputRange).toEqual([0, 1, 2])    
    }
  })
});

test('Test:Swiper->hook/useJudgeRange', () => {
  const case1 = (index: number, size: number, now: number) => {
    return useJudgeRange(index, size, now, {
      maxComputed: 1,
      maxRender: 1,
    });
  }
  expect(case1(0, 10, 0)).toBe(true);
  expect(case1(0, 10, -1)).toBe(true);
  expect(case1(0, 10, 1)).toBe(true);
  expect(case1(0, 10, -3)).toBe(false);
  expect(case1(0, 10, 3)).toBe(false);
  expect(case1(0, 10, 9)).toBe(true);
  expect(case1(0, 10, -9)).toBe(true);

  expect(case1(3, 10, 0)).toBe(false);
  expect(case1(3, 10, 3)).toBe(false);
  expect(case1(3, 10, -2)).toBe(true);
  expect(case1(3, 10, -3)).toBe(true);
  expect(case1(3, 10, 9)).toBe(false);

  const case2 = (index: number, size: number, now: number) => {
    return useJudgeRange(index, size, now, {
      maxComputed: 3,
      maxRender: 3,
    });
  }
  expect(case2(0, 10, 0)).toBe(true);
  expect(case2(0, 10, -3)).toBe(true);
  expect(case2(0, 10, 3)).toBe(true);
  expect(case2(0, 10, 9)).toBe(true);
  expect(case2(0, 10, -9)).toBe(true);
  expect(case2(0, 10, 4)).toBe(false);
  expect(case2(0, 10, -4)).toBe(false);
});

test('Test:Swiper->hook/useItemOffset', () => {
  const case1 = (offset: number, index: number, size: number, now: number) => {
    return useItemOffset(offset, index, size, now, {
      maxComputed: 1,
      maxRender: 1,
    })
  }

  expect(case1(0, 2, 3, 0)).toBe(-1);
  expect(case1(2, 0, 3, -2)).toBe(1);
  expect(case1(-1, 0, 3, 1)).toBe(0);
});

test('Test:Swiper->hook/useAutoScroll', () => {
  const next = (callback: any) => {
    callback();
  };

  renderHook(() => {
    const case1 = useAutoScroll(next, true, 1000);
    expect(case1.isRuning).toBe(true);

    const case2 = useAutoScroll(next, false, 1000);
    expect(case2.isRuning).toBe(false);
  });
});