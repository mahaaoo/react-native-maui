import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  Button,
  ActionSheet,
  ActionSheetUtil,
  ActionSheetFull,
} from 'react-native-maui';

import Section from '../components/Section';

interface ActionSheetExampleProps {}

const options = ['option1', 'option2', 'option3', 'option4', 'option5'];
const ActionSheetExample: React.FC<ActionSheetExampleProps> = (props) => {
  const {} = props;

  return (
    <View style={styles.container}>
      <Section title="基础用法">
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
          style={styles.marginLeft}
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
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 15,
  },
});

export default ActionSheetExample;
