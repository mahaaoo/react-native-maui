import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import { TabView } from 'react-native-maui';

const { height } = Dimensions.get('window');

interface TabViewExampleProps {}

const TabList = ['Tab1', 'Tab2', 'Tab3', 'Tab4', 'Tab5', 'Tab6', 'Tab7'];
const TabListColor = [
  'orange',
  '#666',
  'cyan',
  'pink',
  'purple',
  'orange',
  '#666',
];

const TabViewExample: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;
  const tabRef = useRef(null);

  useEffect(() => {
    // setTimeout(() => {
    //   tabRef.current && tabRef.current?.previous();
    // }, 3000);
  }, []);

  return (
    <View style={styles.container}>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TabViewExample;
