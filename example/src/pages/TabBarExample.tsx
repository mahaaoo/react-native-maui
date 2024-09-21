import React from 'react';
import { View } from 'react-native';
import { TabBar } from 'react-native-maui';

interface TabBarExampleProps {}

const tabs = ['tab1', 'tab2', 'this is tab3', 'tab5', '11', 'tab8', 'ta11'];
const tabs2 = ['tab1', 'tab2'];
const tabs3 = ['tab1', 'tab2', 'this is tab3'];
const tabs4 = ['tab1', 'tab2', 'this is tab3', 'tab5', '11', 'tab8', 'ta11'];

const TabBarExample: React.FC<TabBarExampleProps> = (props) => {
  const {} = props;

  return (
    <>
      <TabBar
        tabs={tabs}
        spacing={20}
        showSeparator
        separatorComponent={() => (
          <View style={{ height: 18, width: 4, backgroundColor: '#000' }} />
        )}
        tabBarItemStyle={{
          height: 50,
          borderRadius: 25,
          paddingHorizontal: 30,
          paddingVertical: 10,
          backgroundColor: 'orange',
        }}
      />
      <TabBar
        tabs={tabs2}
        flex="equal-width"
        scrollEnabled={false}
        spacing={30}
        showSeparator
        separatorComponent={() => (
          <View style={{ height: 18, width: 30, backgroundColor: 'blue' }} />
        )}
        sliderComponent={() => (
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 5,
              backgroundColor: 'blue',
            }}
          />
        )}
        style={{ height: 80 }}
      />
      <TabBar
        tabs={tabs3}
        spacing={18}
        flex="equal-width"
        hideSlider
        tabBarItemTitleStyle={{
          fontSize: 20,
          color: 'grey',
          fontWeight: 'bold',
        }}
        activeTextColor='red'
        inactiveTextColor='green'
        tabBarItemStyle={{ backgroundColor: 'pink' }}
      />
      <TabBar
        style={{ width: 300 }}
        tabs={tabs4}
        initialTab={3}
        defaultSliderStyle={{ width: 50, height: 4, borderRadius: 4 }}
      />
    </>
  );
};

export default TabBarExample;
