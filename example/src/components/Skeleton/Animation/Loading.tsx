import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

interface LoadingProps {
};

const Loading: React.FC<LoadingProps> = props => {
  const {} = props;

  return (
    <View style={styles.mask}>
      <ActivityIndicator />
    </View>
  )
};

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Loading;
