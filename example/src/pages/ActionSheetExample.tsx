import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  Button,
  ActionSheet,
  ActionSheetUtil,
  ActionSheetFull,
} from 'react-native-maui';

interface ActionSheetExampleProps {}

const options = ['option1', 'option2', 'option3', 'option4', 'option5'];
const ActionSheetExample: React.FC<ActionSheetExampleProps> = (props) => {
  const {} = props;

  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          ActionSheetUtil.show(
            <ActionSheet
              options={options}
              onSelect={(item) => {
                console.log('选择了:', item);
              }}
              onDisappear={() => {
                console.log('关闭');
              }}
            />
          );
        }}
      >
        <Text>样式1</Text>
      </Button>
      <Button
        onPress={() => {
          ActionSheetUtil.show(
            <ActionSheetFull
              options={options}
              onSelect={(item) => {
                console.log('选择了:', item);
              }}
              onDisappear={() => {
                console.log('关闭');
              }}
            />
          );
        }}
      >
        <Text>样式2</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ActionSheetExample;
