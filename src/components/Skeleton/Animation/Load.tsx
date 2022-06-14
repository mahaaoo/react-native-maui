import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

interface LoadProps {
};

const Load: React.FC<LoadProps> = props => {
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

export default Load;
