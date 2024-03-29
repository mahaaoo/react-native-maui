import { renderHook } from '@testing-library/react-hooks';
import { withReanimatedTimer } from 'react-native-reanimated/src/reanimated2/jestUtils';
import {
  useProps,
  useRange,
  judgeRange,
  getItemOffset,
  useAutoScroll,
  useIndexAtData,
  useTouching,
  getLayoutValue,
  judgeRelativePosition,
} from '../utils';

describe('Test:Carousel->hook/useJudgeRange', () => {
  it('dataSource is empty', () => {
    const test1 = {
      dataSource: [],
      renderItem: () => null,
    };
    expect(() => useProps(test1)).toThrow("dataSource can't be empty");
  });

  it('dataSource length is 1', () => {
    const test2 = {
      dataSource: [1],
      renderItem: () => null,
    };
    const result2 = useProps(test2);
    expect(result2.dataSource).toEqual([1, 1, 1]);
  });

  it('dataSource length is 2', () => {
    const test3 = {
      dataSource: [1, 2],
      renderItem: () => null,
    };
    const result3 = useProps(test3);
    expect(result3.dataSource).toEqual([1, 2, 2]);
  });

  it('defaultOptions test', () => {
    const test4 = {
      dataSource: new Array(5),
      renderItem: () => null,
    };
    const result4 = useProps(test4);
    expect(result4.options).toEqual({
      maxComputed: 2,
      maxRender: 2,
    });
  });

  it('defaultOptions test 2', () => {
    const test5 = {
      dataSource: new Array(10),
      renderItem: () => null,
    };
    const result5 = useProps(test5);
    expect(result5.options).toEqual({
      maxComputed: 4,
      maxRender: 4,
    });
  });

  it('defaultOptions mix options test', () => {
    const test6 = {
      dataSource: new Array(5),
      renderItem: () => null,
      options: {
        maxComputed: 3,
      },
    };
    const result6 = useProps(test6);
    expect(result6.options).toEqual({
      maxComputed: 3,
      maxRender: 2,
    });
  });

  it('defaultOptions mix options test 2', () => {
    const test7 = {
      dataSource: new Array(5),
      renderItem: () => null,
      options: {
        maxRender: 3,
      },
    };
    const result7 = useProps(test7);
    expect(result7.options).toEqual({
      maxComputed: 2,
      maxRender: 3,
    });
  });
});

describe('Test:Carousel->hook/useRange', () => {
  it('base', () => {
    withReanimatedTimer(() => {
      let range: {
        inputRange: number[];
        outputRange: number[];
      } = {
        inputRange: [],
        outputRange: [],
      };

      renderHook(() => {
        range = useRange({
          value: 1,
        }).value;
      });

      if (range) {
        expect(range.inputRange).toEqual([0.5, 1, 1.5]);
        expect(range.outputRange).toEqual([0, 1, 2]);
      }
    });
  });
});

describe('Test:Carousel->hook/useJudgeRange', () => {
  it('render min', () => {
    const useJudgeRangeOption = (index: number, size: number, now: number) => {
      return judgeRange(index, size, now, {
        maxComputed: 1,
        maxRender: 1,
      });
    };
    expect(useJudgeRangeOption(0, 10, 0)).toBe(true);
    expect(useJudgeRangeOption(0, 10, -1)).toBe(true);
    expect(useJudgeRangeOption(0, 10, 1)).toBe(true);
    expect(useJudgeRangeOption(0, 10, -3)).toBe(false);
    expect(useJudgeRangeOption(0, 10, 3)).toBe(false);
    expect(useJudgeRangeOption(0, 10, 9)).toBe(true);
    expect(useJudgeRangeOption(0, 10, -9)).toBe(true);

    expect(useJudgeRangeOption(3, 10, 0)).toBe(false);
    expect(useJudgeRangeOption(3, 10, 3)).toBe(false);
    expect(useJudgeRangeOption(3, 10, -2)).toBe(true);
    expect(useJudgeRangeOption(3, 10, -3)).toBe(true);
    expect(useJudgeRangeOption(3, 10, 9)).toBe(false);
  });

  it('render nomarlly', () => {
    const useJudgeRangeOption = (index: number, size: number, now: number) => {
      return judgeRange(index, size, now, {
        maxComputed: 3,
        maxRender: 3,
      });
    };
    expect(useJudgeRangeOption(0, 10, 0)).toBe(true);
    expect(useJudgeRangeOption(0, 10, -3)).toBe(true);
    expect(useJudgeRangeOption(0, 10, 3)).toBe(true);
    expect(useJudgeRangeOption(0, 10, 9)).toBe(true);
    expect(useJudgeRangeOption(0, 10, -9)).toBe(true);
    expect(useJudgeRangeOption(0, 10, 4)).toBe(false);
    expect(useJudgeRangeOption(0, 10, -4)).toBe(false);
  });
});

describe('Test:Carousel->hook/useItemOffset', () => {
  it('base', () => {
    const useItemOffsetOption = (
      offset: number,
      index: number,
      size: number,
      now: number
    ) => {
      return getItemOffset(offset, index, size, now, {
        maxComputed: 1,
        maxRender: 1,
      });
    };

    expect(useItemOffsetOption(0, 2, 3, 0)).toBe(-1);
    expect(useItemOffsetOption(2, 0, 3, -2)).toBe(1);
    expect(useItemOffsetOption(-1, 0, 3, 1)).toBe(0);
  });
});

describe('Test:Carousel->hook/useAutoScroll', () => {
  it('auto play', () => {
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
});

describe('Test:Carousel->hook/useTouching', () => {
  it('is touching', () => {
    withReanimatedTimer(() => {
      renderHook(() => {
        const startMock = jest.fn();
        const endMock = jest.fn();

        useTouching(startMock, endMock, { value: true });
        expect(startMock).toHaveBeenCalled();
      });
    });
  });
  it('not touching', () => {
    withReanimatedTimer(() => {
      renderHook(() => {
        const startMock = jest.fn();
        const endMock = jest.fn();

        useTouching(startMock, endMock, { value: false });
        expect(endMock).toHaveBeenCalled();
      });
    });
  });
});

describe('Test:Carousel->hook/useIndexAtData', () => {
  it('index at dataSource', () => {
    withReanimatedTimer(() => {
      renderHook(() => {
        const case1 = useIndexAtData({ value: 1 }, 4);
        expect(case1.value).toBe(3);

        const case2 = useIndexAtData({ value: -1 }, 4);
        expect(case2.value).toBe(1);

        const case3 = useIndexAtData({ value: -5 }, 4);
        expect(case3.value).toBe(1);

        const case4 = useIndexAtData({ value: 0 }, 4);
        expect(case4.value).toBe(0);
      });
    });
  });
});

// describe('Test:Carousel->hook/getLayoutValue', () => {
//   it('getLayoutValue', () => {
//     const value = getLayoutValue(
//       0,
//       { value: 0 },
//       { value: 0 },
//       { value: 0 },
//       { value: 0 },
//       200,
//       4,
//       false
//     );

//     expect(value).toBe(0);

//     const value2 = getLayoutValue(
//       0,
//       { value: 0 },
//       { value: 0.5 },
//       { value: 0 },
//       { value: 100 },
//       200,
//       4,
//       false
//     );

//     expect(value2).toBe(-3.5);
//   });
// });
