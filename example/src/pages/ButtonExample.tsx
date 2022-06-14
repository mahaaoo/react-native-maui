import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Button, ButtonType} from "@maui";

export default function ButtonExample() {
  return (
    <View style={styles.container}>
      <Button onPress={() => {}}>
        <Text>默认样式</Text>
      </Button>
      <Button onPress={() => {}} disabled>
        <Text>默认样式</Text>
      </Button>
      <Button onPress={() => {}} type={ButtonType.Primary}>
        <Text>Primary样式</Text>
      </Button>
      <Button onPress={() => {}} type={ButtonType.Primary} disabled>
        <Text>Primary样式</Text>
      </Button>
      <Button onPress={() => {}} type={ButtonType.Link}>
        Link样式
      </Button>
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
