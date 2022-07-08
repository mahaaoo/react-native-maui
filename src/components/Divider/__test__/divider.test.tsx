import * as React from 'react';
import { Divider } from '../index';
import { render } from '@testing-library/react-native';

describe('Test:Divider', () => {
  it('render correctly', () => {
    const tree = render(<Divider start={0} end={200} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
