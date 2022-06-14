import React from 'react';
import {ActivityIndicator, View} from 'react-native';

interface LoadingProps {
  color?: string;
}

const Loading: React.FC<LoadingProps> = props => {
  const {color = '#1e90ff'} = props;
  return (
    <View>
      <ActivityIndicator color={color} animating={true} />
    </View>
  );
}

export default Loading;
