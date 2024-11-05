import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TabView } from 'react-native-maui';

interface TabViewExampleProps {}

const tabs = ['tab1', 'tab2', 'this is tab3', 'tab5', '11', 'tab8', 'ta11'];

const TabViewExample: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;

  return (
    <View style={styles.container}>
      <TabView tabs={tabs} tabBarflex="equal-width">
        {tabs.map((tab, index) => {
          return (
            <View key={index} style={{ flex: 1, backgroundColor: 'pink' }}>
              <Text>{tab}</Text>
              <Text>{tab}</Text>
            </View>
          );
        })}
      </TabView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TabViewExample;
