import React from 'react';
import { View, ViewStyle } from 'react-native';

interface TabBarSliderProps {
  style?: ViewStyle;
}

const TabBarSlider: React.FC<TabBarSliderProps> = (props) => {
  const { style } = props;

  return (
    <View style={[{ width: 20, height: 5, backgroundColor: 'red' }, style]} />
  );
};

export default TabBarSlider;
