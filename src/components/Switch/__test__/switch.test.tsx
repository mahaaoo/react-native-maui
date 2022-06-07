import Switch from '../index';
import { fireEvent, render } from '@testing-library/react-native';
import {
  withReanimatedTimer
} from 'react-native-reanimated/src/reanimated2/jestUtils'

describe('Test:Switch', () => {
  it('base', () => {
    withReanimatedTimer(() => {
      const onChangeMock = jest.fn();
      const { getByTestId  } = render(
        <Switch value={true} onChange={onChangeMock} />
      );

      const switch1 = getByTestId('test-switch')
      expect(switch1).not.toBeNull();
    
      // fireEvent(switch1, 'onPress');
      // jest.setTimeout(1000); 
      // expect(onChangeMock).toHaveBeenCalledTimes(1);
    })
  });
});
