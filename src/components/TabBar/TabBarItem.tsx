import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TabBarItemProps } from './type';

const TabBarItem: React.FC<TabBarItemProps> = (props) => {
  const {
    index,
    title,
    width = 'auto',
    style,
    titleStyle,
    onLayout,
    onPress,
  } = props;

  return (
    <TouchableOpacity
      onPress={() => onPress(index)}
      onLayout={(event) => onLayout(index, event.nativeEvent.layout)}
      style={[styles.container, { width: width }, style]}
    >
      <Text style={titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: '100%',
  },
});

export default TabBarItem;
