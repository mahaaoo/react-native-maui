import React from 'react';
import { View, Text } from 'react-native';
import { TabBar } from '../TabBar';
import { PageView } from '../PageView';

interface TabViewProps {}

const tabs = ['tab1', 'tab2', 'this is tab3', 'tab5', '11', 'tab8', 'ta11'];

const TabView: React.FC<TabViewProps> = (props) => {
  const {} = props;

  return (
    <View style={{ flex: 1 }}>
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
      <PageView
        style={{ flex: 1 }}
        initialPage={1}
        onPageSelected={(currentPage) => {
          // console.log('currentPage:', currentPage);
        }}
        onPageScrollStateChanged={(state) => {
          // console.log('state:', state);
        }}
        onPageScroll={(translate) => {
          // console.log('translate', translate);
        }}
        scrollEnabled={true}
        bounces={true}
      >
        {tabs.map((tab, index) => {
          return (
            <View
              key={index}
              style={{
                flex: 1,
                backgroundColor: 'pink',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 25 }}>{tab} </Text>
            </View>
          );
        })}
      </PageView>
    </View>
  );
};

export default TabView;
