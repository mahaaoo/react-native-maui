import { render } from '@testing-library/react-native';
import {
  withReanimatedTimer
} from 'react-native-reanimated/src/reanimated2/jestUtils'
import { Dimensions, Image } from 'react-native';
import { Swiper } from '../index';

const {width} = Dimensions.get('window');

describe('Testing:Swiper', () => {
  it('base', () => {
    withReanimatedTimer(async () => {
      const card = [
        {
          source: require('../../../../assets/a.jpg'),
        },
        {
          source: require('../../../../assets/b.jpg'),
        },
        {
          source: require('../../../../assets/c.jpg'),
        },
        {
          source: require('../../../../assets/d.jpg'),
        },
      ];
  
      const onScollStartMock = jest.fn();
      const onScollEndMock = jest.fn();
  
      const previousMock = jest.fn();
      const nextMock =  jest.fn();
      const getCurrentIndexMock = jest.fn();
      const useRef = {
        current: {
          previous: previousMock,
          next: nextMock,
          getCurrentIndex: getCurrentIndexMock,
        }
      };
  
      const { getByTestId } = render(
        <Swiper
          ref={useRef}
          interval={1000}
          dataSource={card}
          renderItem={(item) => {
            return <Image source={item.source} style={{ width: '100%', height: '100%'}} />
          }}
          onScollStart={onScollStartMock}
          onScollEnd={onScollEndMock}
          auto={false}
          horizontal={true}
          style={{
            width,
            height: 200,
          }}
        />
      );
  
      const swiper = getByTestId('test-swiper');
      expect(getCurrentIndexMock).toHaveBeenCalledWith(1);

      useRef.current.previous();
      expect(onScollStartMock).toHaveBeenCalled();
      expect(onScollEndMock).toHaveBeenCalled();
    });
  });
})