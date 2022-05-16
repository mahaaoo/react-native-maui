import {Text} from 'react-native';
import { render } from '@testing-library/react-native';
import Avatar from '../index';

describe('Test:Avatar', () => {
  it('base', () => {
    const { queryByText } = render(
      <Avatar
        size={60}
        placeholder={<Text>A</Text>}
      />
    );
    const element = queryByText('A');
    expect(element).not.toBeNull();  
  });
});
