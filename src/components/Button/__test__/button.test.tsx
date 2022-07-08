import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Button } from '../index';

describe('Test:Button', () => {
  it('render correctly', () => {
    const tree = render(
      <Button onPress={() => {}}>
        <Text>默认样式</Text>
      </Button>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('base button', async () => {
    const onPressMock = jest.fn();
    const { queryByText: queryByText1 } = render(
      <Button onPress={onPressMock}>
        <Text>默认样式</Text>
      </Button>
    );
    const element1 = queryByText1('默认样式');
    expect(element1).not.toBeNull();

    // onPressMock被调用了
    fireEvent(element1, 'onPress'); // 触发Button里的组件方法
    expect(onPressMock).toHaveBeenCalled();
  });

  it('button disabled', async () => {
    const onPressMock2 = jest.fn();
    const { queryByText: queryByText2 } = render(
      <Button onPress={onPressMock2} disabled>
        <Text>禁止点击</Text>
      </Button>
    );

    const element2 = queryByText2('禁止点击');
    expect(element2).not.toBeNull();

    // 不可点击
    fireEvent(element2, 'onPress');
    expect(onPressMock2).not.toHaveBeenCalled();
  });
});
