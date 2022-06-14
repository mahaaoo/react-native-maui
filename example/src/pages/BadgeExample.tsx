import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {Badge} from "@maui";

export default function BadgeExample() {
  return (
    <View style={styles.container}>
      <Badge number={2} />
      <Badge number={10} />
      <Badge number={102} />
      <Badge number={2} size={20} />
      <Badge number={10} size={20}  />
      <Badge number={102} size={20}  />
      <Badge number={102} color={'green'} />
      <Badge number={2} size={20} color={'green'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
