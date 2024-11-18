import React from 'react';
import { View, Text } from 'react-native';
import { NestedTabView } from 'react-native-maui';

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
    />
  );
};

export default HeadTabViewExample;
