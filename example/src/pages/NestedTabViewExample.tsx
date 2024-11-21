import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { NestedTabView, Nested } from 'react-native-maui';

interface TabViewExampleProps {}

const HeadTabViewExample: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;
  const ref = useRef();

  useEffect(() => {
    const autoScroll = () => {
      setTimeout(() => {
        console.log('定时滚动');
        ref.current?.scrollTo(300);
      }, 2000);
    };
    autoScroll();
  }, [])

  return (
    <NestedTabView
      ref={ref}
      style={{ flex: 1 }}
      stickyHeight={55} //TabBar的高度
      renderHeader={() => (
        <View
          style={{
            backgroundColor: 'lightblue',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Header</Text>
          <Text
            style={{ fontSize: 20 }}
            onPress={() => {
              console.log(ref.current?.getCurrentPage());
            }}
          >
            get.current
          </Text>
          <Text
            style={{ fontSize: 20 }}
            onPress={() => {
              ref.current?.setPage(2);
            }}
          >
            setPage
          </Text>
          <Text
            style={{ fontSize: 20 }}
            onPress={() => {
              ref.current?.scrollTo(100);
            }}
          >
            scrollTo
          </Text>
        </View>
      )}
      tabs={['tab1', 'tab2', '第三个tabs']}
      tabBarflex={'equal-width'}
    >
      <Nested.ScrollView contentContainerStyle={{ backgroundColor: 'orange' }}>
        {new Array(80).fill(0).map((item, index) => {
          return (
            <Text key={index} style={{ margin: 10, fontSize: 20 }}>
              {'ScrollView' + index}
            </Text>
          );
        })}
      </Nested.ScrollView>
      <Nested.FlatList
        data={new Array(80).fill(0)}
        renderItem={({ item, index }) => {
          return (
            <Text key={index} style={{ margin: 10, fontSize: 20 }}>
              {'flatlist' + index}
            </Text>
          );
        }}
      />
      <Nested.ScrollView>
        {new Array(80).fill(0).map((item, index) => {
          return (
            <Text key={index} style={{ margin: 10, fontSize: 20 }}>
              {'ScrollView' + index}
            </Text>
          );
        })}
      </Nested.ScrollView>
    </NestedTabView>
  );
};

export default HeadTabViewExample;
