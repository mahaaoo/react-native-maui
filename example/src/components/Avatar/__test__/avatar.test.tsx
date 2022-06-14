import { render } from '@testing-library/react-native';
import {
  withReanimatedTimer
} from 'react-native-reanimated/src/reanimated2/jestUtils'
import {Text} from 'react-native';
import {Avatar} from '../index';

describe('Test:Avatar', () => {
  it('render correctly', () => {
    withReanimatedTimer(() => {
      const tree = render(
        <Avatar
          style={{ width: 60, height: 60, borderRadius: 30 }}
          url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
          placeholder={<Text>加载中</Text>}
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('base', () => {
    withReanimatedTimer(() => {
      const { queryByText } = render(
        <Avatar
          style={{ width: 60, height: 60, borderRadius: 30 }}
          url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
          placeholder={<Text>加载中</Text>}
        />
      );
      const element = queryByText('加载中');
      expect(element).not.toBeNull();
    });
  });
});
