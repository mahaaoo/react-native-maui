import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function OverlayExample() {
  return (
    <View style={styles.main}>
      <Text style={styles.text}>已迁移至react-native-ma-modal单独维护</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});
