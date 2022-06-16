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
        title.length > 0 && (
          <View style={styles.titleContainer}>
            <Text style={{ color: 'white' }}>{title}</Text>
          </View>
        )
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
  },
  titleContainer: {
    position: 'absolute', 
    bottom: 10, 
    left: 0, 
    right: 0,  
    justifyContent: 'center', 
    alignItems: 'center'
  }
})

export default LoadingTitle;
