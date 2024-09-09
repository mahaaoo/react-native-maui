import React from 'react';
import { View } from 'react-native';
import { TabBar } from 'react-native-maui';

interface TabBarExampleProps {}

const tabs = ['tab1', 'tab2', 'this is tab3', 'tab5', '11', 'tab8', 'ta11'];

const TabBarExample: React.FC<TabBarExampleProps> = (props) => {
  const {} = props;

  return <TabBar tabs={tabs} />;
};

export default TabBarExample;
