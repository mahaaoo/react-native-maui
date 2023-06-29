import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import { TabView, DefaultTabBar } from 'react-native-maui';

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
      <TabView
        ref={tabRef}
        tabBar={TabList}
        initialPage={0}
        renderTabBar={() => (
          <DefaultTabBar
            tabBarInactiveTextColor={'pink'}
            tabBarActiveTextColor={'red'}
            tabBarUnderlineStyle={{
              height: 4,
              backgroundColor: 'red',
            }}
          />
        )}
      >
        {TabList.map((_, index) => {
          return (
            <ScrollView key={index}>
              <View
                style={[
                  styles.itemContainer,
                  {
                    height: height * 2,
                  },
                  {
                    backgroundColor: TabListColor[index],
                  },
                ]}
              >
                <Text style={{ fontSize: 30 }} key={index}>{`Tab${
                  index + 1
                }`}</Text>
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
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabViewExample;
