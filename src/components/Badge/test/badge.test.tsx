import { render } from '@testing-library/react-native';
import Badge from '../index';

describe('Test:Avatar', () => {
  it('base', () => {
    const { queryByText: queryByText1  } = render(<Badge number={10} size={20} />);
    const element1 = queryByText1('10');
    expect(element1).not.toBeNull();  
  });
  it('over 99', () => {
    const { queryByText: queryByText2 } = render(<Badge number={102} size={20} />);
    const element2 = queryByText2('99+');
    expect(element2).not.toBeNull();  
  });
});
