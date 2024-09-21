import React, { useRef } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { TabBar, TabBarRef } from '../TabBar';
import { PageView, PageViewRef } from '../PageView';
import { useSharedValue } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface TabViewProps {}

const tabs = ['tab1', 'tab2', 'this is tab3', 'tab5', '11', 'tab8', 'ta11'];

const TabView: React.FC<TabViewProps> = (props) => {
  const {} = props;
  // const contentSize = width;
  const currentIndex = useSharedValue(2);
  const pageRef = useRef<PageViewRef>(null);
  const tabRef = useRef<TabBarRef>(null);

  return (
    <View style={{ flex: 1 }}>
      <TabBar
        tabs={tabs}
        ref={tabRef}
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
        onPress={(index) => {
          pageRef.current && pageRef.current?.setPage(index);
        }}
        initialTab={0}
      />
      <PageView
        style={{ flex: 1 }}
        ref={pageRef}
        initialPage={0}
        onPageSelected={(currentPage) => {
          tabRef.current && tabRef.current?.keepScrollViewMiddle(currentPage);
        }}
        onPageScroll={(translate) => {
          tabRef.current && tabRef.current?.syncCurrentIndex(translate / width);
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
