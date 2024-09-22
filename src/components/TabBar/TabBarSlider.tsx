import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';

interface TabBarSliderProps {
  style?: StyleProp<ViewStyle>;
}

const TabBarSlider: React.FC<TabBarSliderProps> = (props) => {
  const { style } = props;

  return <View style={[styles.slider, style]} />;
};

const styles = StyleSheet.create({
  slider: {
    width: 20,
    height: 5,
    backgroundColor: 'red',
  },
});

export default TabBarSlider;
