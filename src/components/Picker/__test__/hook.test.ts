import {renderHook} from '@testing-library/react-hooks';
import { Easing } from 'react-native-reanimated';
import {
  useProps,
  useInitialValue,
} from '../hook';

describe('Test:Picker->hook/useProps', () => {
  it('dataSource empty', () => {
    const renderItem = () => null;

    const test1 = {
      renderItem,
      dataSource: [],
    }
    expect(() => useProps(test1)).toThrow('dataSource can\'t be empty');    
  });

  it('default options', () => {
    const renderItem = () => null;

    const {options} = useProps({
      renderItem,
      dataSource: [1],
    });
    
    expect(options.itemHeight).toEqual(30);
    expect(options.maxRender).toEqual(2);
  });

  it('mix options', () => {
    const renderItem = () => null;

    const {options} = useProps({
      renderItem,
      dataSource: [1],
      options: {
        itemHeight: 50,
        maxRender: 3,
      }
    });
    
    expect(options.itemHeight).toEqual(50);
    expect(options.maxRender).toEqual(3);
  });
});

describe('Test:Picker->hook/useInitialValue', () => {
  it('base', () => {
    renderHook(() => {
      const timingOptionsMock = {
        duration: 1000,
        easing: Easing.bezier(0.22, 1, 0.36, 1),  
      }
    
      const {
        translateY,
        offset,
        currentIndex,
        snapPoints,
        timingOptions,
      } = useInitialValue({
        itemHeight: 30,
        maxRender: 2,
      }, [1,2,3])
  
      expect(translateY.value).toEqual(2 * 30);
      expect(offset.value).toEqual(0);
      expect(currentIndex.value).toEqual(0);
      expect(snapPoints).toEqual([60, 30, 0]);
      expect(timingOptions).toEqual(timingOptionsMock);
    })
  });
});