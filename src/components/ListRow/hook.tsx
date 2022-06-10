import React from 'react';
import {Text} from 'react-native';
import {ContentType, ListRowProps} from './ListRow';

const componentByType = (content: ContentType): (React.ReactNode | null) => {
  if (content === null) return null;
  if (typeof content === 'string') {
    return (<Text>{content}</Text>)
  }
  return content;
}

export const useProps = (props: ListRowProps) => {
  const {left, mid, right} = props;
  return {
    ...props,
    left: componentByType(left),
    mid: componentByType(mid),
    right: componentByType(right),
  }
}

