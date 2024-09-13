import React from 'react';
import { Dimensions } from 'react-native';
import { PageViewProps, PageViewVerifyProps } from './type';

const { width } = Dimensions.get('window');

export const useVerifyProps = (props: PageViewProps): PageViewVerifyProps => {
  const { children, style } = props;
  const pageSize = React.Children.count(children);
  if (pageSize === 0) {
    throw new Error('PageView must be contains at least one chid');
  }
  let contentSize: number = width;
  if (style && style.width) {
    if (typeof style.width === 'number') {
      contentSize = style.width;
    } else {
      throw new Error('PageView width only support number');
    }
  }

  const snapPoints = new Array(pageSize)
    .fill(0)
    .map((_, index) => -index * contentSize);

  return {
    ...props,
    pageSize,
    contentSize,
    snapPoints,
  };
};
