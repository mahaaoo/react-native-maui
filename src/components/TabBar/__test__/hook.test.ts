import { useVerifyProps } from '../hook';

describe('Test:TabBar->hook/useVerifyProps', () => {
  it('tabs is not array', () => {
    const errorProps = {
      tabs: 'string',
    };
    expect(() => useVerifyProps(errorProps)).toThrow(
      'TabBar tabs must be array'
    );
  });
  it("tabs can't be empty", () => {
    const errorProps = {
      tabs: [],
    };
    expect(() => useVerifyProps(errorProps)).toThrow(
      "TabBar tabs can't be empty"
    );
  });
  it('contentSize must be number', () => {
    const errorProps = {
      tabs: ['1'],
      style: {
        width: 'auto',
      },
    };
    expect(() => useVerifyProps(errorProps)).toThrow(
      'TabBar width only support number'
    );
  });
  it('contentSize default and normal', () => {
    // const { contentSize: contentSize1 } = useVerifyProps({
    //   tabs: ['1'],
    // });
    // expect(contentSize1).toEqual(width);

    const { contentSize } = useVerifyProps({
      tabs: ['1'],
      style: {
        width: 200,
      },
    });
    expect(contentSize).toEqual(200);
  });
  it('defalutSliderWidth must be number', () => {
    const errorProps = {
      tabs: ['1'],
      defaultSliderStyle: {
        width: 'auto',
      },
    };
    expect(() => useVerifyProps(errorProps)).toThrow(
      'TabBar defaultSliderStyle width only support number'
    );
  });
  it('defalutSliderWidth default and normal', () => {
    const { defalutSliderWidth } = useVerifyProps({
      tabs: ['1'],
    });
    expect(defalutSliderWidth).toEqual(20);

    const { defalutSliderWidth: defalutSliderWidth2 } = useVerifyProps({
      tabs: ['1'],
      defaultSliderStyle: {
        width: 50,
      },
    });
    expect(defalutSliderWidth2).toEqual(50);
  });
});
