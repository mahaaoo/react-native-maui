import React from 'react';
import { View, Text } from 'react-native';
import { NestedTabView, Nested } from 'react-native-maui';

interface TabViewExampleProps {}

const HeadTabViewExample: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;

  return (
    <NestedTabView
      stickyHeight={55} //TabBar的高度
      renderHeader={() => (
        <View style={{ backgroundColor: 'lightblue', height: 200 }}>
          <Text>Header</Text>
        </View>
      )}
    >
      <Nested.ScrollView>
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
    </NestedTabView>
  );
};

export default HeadTabViewExample;
