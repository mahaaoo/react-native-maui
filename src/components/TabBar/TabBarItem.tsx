import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TabBarItemProps {
  index: number;
  title: string;
  onLayout: (index: number, layout: Layout) => void;
  onPress: (index: number) => void;
}

const TabBarItem: React.FC<TabBarItemProps> = (props) => {
  const { index, title, onLayout, onPress } = props;

  return (
    <TouchableOpacity
      onPress={() => onPress(index)}
      onLayout={(event) => onLayout(index, event.nativeEvent.layout)}
      style={{
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        paddingHorizontal: 10,
      }}
    >
      <Text style={{ fontSize: 20 }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TabBarItem;
