import React from 'react';
import { Dimensions } from 'react-native';
import { PageViewProps, PageViewVerifyProps } from './type';

const { width, height } = Dimensions.get('window');

export const useVerifyProps = (props: PageViewProps): PageViewVerifyProps => {
  const { children, style, pageMargin = 0, orientation = 'horizontal' } = props;
  const pageSize = React.Children.count(children);
  if (pageSize === 0) {
    throw new Error('PageView must be contains at least one chid');
  }
  if (orientation !== 'horizontal' && orientation !== 'vertical') {
    throw new Error('orientation only support horizontal or vertical');
  }

  let contentSize: number = orientation === 'horizontal' ? width : height;
  if (orientation === 'horizontal') {
    if (style && style.width) {
      if (typeof style.width === 'number') {
        contentSize = style.width;
      } else {
        throw new Error('PageView width only support number');
      }
    }
  } else {
    if (style && style.height) {
      if (typeof style.height === 'number') {
        contentSize = style.height;
      } else {
        throw new Error('PageView height only support number');
      }
    }
  }

  const snapPoints = new Array(pageSize)
    .fill(0)
    .map((_, index) => index * contentSize + index * pageMargin);

  return {
    ...props,
    orientation,
    pageSize,
    contentSize,
    snapPoints,
  };
};
