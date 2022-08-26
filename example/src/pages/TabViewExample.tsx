import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TabView } from 'react-native-maui';

interface TabViewExampleProps {}

const TabList = ['Tab1', 'Tab2', 'Tab3', 'Tab4', 'Tab5', 'Tab6', 'Tab7'];

const TabViewExample: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;

  return (
    <View style={styles.container}>
      <TabView tabBar={TabList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default TabViewExample;
