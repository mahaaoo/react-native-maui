import { Dimensions } from 'react-native';
import { TabBarProps, TabBarVerifyProps } from './type';
const { width } = Dimensions.get('window');

export const useVerifyProps = (props: TabBarProps): TabBarVerifyProps => {
  const { tabs, defaultSliderStyle, style } = props;

  if (!Array.isArray(tabs)) {
    throw new Error('TabBar tabs must be array');
  }
  if (tabs.length <= 0) {
    throw new Error("TabBar tabs can't be empty");
  }

  let contentSize: number = width;
  if (style && style.width) {
    if (typeof style.width === 'number') {
      contentSize = style.width;
    } else {
      throw new Error('PageView width only support number');
    }
  }

  let defalutSliderWidth: number = 20;
  if (!!defaultSliderStyle && !!defaultSliderStyle?.width) {
    if (typeof defaultSliderStyle.width === 'number') {
      defalutSliderWidth = defaultSliderStyle.width;
    } else {
      throw new Error('TabBar defaultSliderStyle width only support number');
    }
  }

  return {
    ...props,
    defalutSliderWidth,
    contentSize,
  };
};
