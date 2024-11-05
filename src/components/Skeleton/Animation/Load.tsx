import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

interface LoadProps {}

const Load: React.FC<LoadProps> = (props) => {
  return (
    <View style={styles.mask}>
      <ActivityIndicator color="#1e90ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Load;
