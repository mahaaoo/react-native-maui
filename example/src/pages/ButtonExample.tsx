import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Button, ButtonType, GradientButton} from "react-native-maui";

export default function ButtonExample() {
  return (
    <View style={styles.container}>
      <Button onPress={() => {}}>
        <Text>Normal</Text>
      </Button>
      <Button onPress={() => {}} disabled type={ButtonType.Disabled}>
        <Text>Normal Disabled</Text>
      </Button>
      <Button onPress={() => {}} type={ButtonType.Primary}>
        <Text>Primary</Text>
      </Button>
      <Button onPress={() => {}} type={ButtonType.Link}>
        Link
      </Button>
      <GradientButton
        colors={['pink', 'orange', 'pink']}
      />
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
