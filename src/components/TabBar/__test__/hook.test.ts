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
    // const { contentSize } = useVerifyProps({
    //   tabs: ['1'],
    // });
    // expect(contentSize).toEqual();
    const { contentSize } = useVerifyProps({
      tabs: ['1'],
      style: {
        width: 200,
      },
    });
    expect(contentSize).toEqual(200);
  });
});
