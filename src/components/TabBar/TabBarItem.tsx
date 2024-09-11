import React from 'react';
import {
  DimensionValue,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface TabBarItemProps {
  index: number;
  title: string;
  style?: ViewStyle;
  width?: DimensionValue;
  onLayout: (index: number, layout: Layout) => void;
  onPress: (index: number) => void;
}

const TabBarItem: React.FC<TabBarItemProps> = (props) => {
  const { index, title, width = 'auto', style, onLayout, onPress } = props;

  return (
    <TouchableOpacity
      onPress={() => onPress(index)}
      onLayout={(event) => onLayout(index, event.nativeEvent.layout)}
      style={[
        {
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
          width: width,
          height: '100%',
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 20 }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TabBarItem;
