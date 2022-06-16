import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Button, ButtonType} from "react-native-maui";

export default function ButtonExample() {
  return (
    <View style={styles.container}>
      <Button onPress={() => {}}>
        <Text>Normal</Text>
      </Button>
      <Button onPress={() => {}} disabled>
        <Text>Normal Disabled</Text>
      </Button>
      <Button onPress={() => {}} type={ButtonType.Primary}>
        <Text>Primary</Text>
      </Button>
      <Button onPress={() => {}} type={ButtonType.Primary} disabled>
        <Text>Primary Disabled</Text>
      </Button>
      <Button onPress={() => {}} type={ButtonType.Link}>
        Link
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
