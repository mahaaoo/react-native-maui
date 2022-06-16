import React from 'react';
import {View, StyleSheet,Text, ViewStyle} from 'react-native';

interface ToastProps {
  title: string;
  style?: ViewStyle
};

const Toast: React.FC<ToastProps> = props => {
  const {title, style} = props;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mask} />
      <Text style={styles.title}>{title}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  mask: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: '#000',
    opacity: 0.3,
  },
  title: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: 'white',
    fontSize: 16,
  }
});

export default Toast;
