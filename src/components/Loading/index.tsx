import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const Loading: React.FC<{}> = () => {
  return (
    <View>
      <ActivityIndicator color={'blue'} animating={true} />
    </View>
  );
}

export default Loading;
