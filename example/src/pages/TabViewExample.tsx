import React from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import { TabView } from 'react-native-maui';

const { width, height } = Dimensions.get('window');

interface TabViewExampleProps {}

const TabList = ['Tab1', 'Tab2', 'Tab3', 'Tab4', 'Tab5', 'Tab6', 'Tab7'];
const TabListColor = [
  'orange',
  '#666',
  'cyan',
  '#e82c1c',
  'purple',
  'orange',
  '#666',
];

const TabViewExample: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;

  return (
    <View style={styles.container}>
      <TabView tabBar={TabList} initialPage={1}>
        {TabList.map((item, index) => {
          return (
            <ScrollView key={item}>
              <View
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor: TabListColor[index],
                  },
                ]}
              >
                {new Array(10).fill(0).map((_, index) => {
                  return <Text key={index}>{`Tab${index}`}</Text>;
                })}
              </View>
            </ScrollView>
          );
        })}
      </TabView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  itemContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabViewExample;
