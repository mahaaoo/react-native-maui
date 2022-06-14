import React from 'react';
import {ActivityIndicator, View, StyleSheet, Text} from 'react-native';

interface LoadingTitleProps {
  color?: string;
  title?: string;
};

const LoadingTitle: React.FC<LoadingTitleProps> = props => {
  const {color = 'white', title = ''} = props;

  return (
    <View style={styles.loading}>
      <ActivityIndicator color={color} animating={true} />
      {
        title.length > 0 && <Text style={{ color: 'white', marginTop: 10 }}>{title}</Text>
      }
    </View>
  )
};

const styles = StyleSheet.create({
  loading: {
    width: 100,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)'
  }
})

export default LoadingTitle;
