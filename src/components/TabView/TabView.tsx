import React from 'react';
import {View} from 'react-native';

interface TabViewProps {
};

const TabView: React.FC<TabViewProps> = props => {
  const {} = props;

  return (
    <View>
      <TabBar  />
    </View>
  )
};

export default TabView;
