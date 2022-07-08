import React from 'react';
import { ActivityIndicator } from 'react-native';

export interface LoadingProps {
  color?: string;
  size?: 'small' | 'large';
  animating?: boolean;
}

const Loading: React.FC<LoadingProps> = (props) => {
  const { color, size, animating = true } = props;
  return <ActivityIndicator {...{ color, size, animating }} />;
};

export default Loading;
