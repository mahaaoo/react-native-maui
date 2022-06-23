import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Shadow} from 'react-native-maui';

interface ShadowExampleProps {
};

const ShadowExample: React.FC<ShadowExampleProps> = props => {
  return (
    <View style={styles.container}>
      <Shadow shadowWidth={15}>
        <View style={{ 
          width: 100, height: 100, backgroundColor: 'white',
        }}>
          <Text></Text>
        </View>
      </Shadow>
      <Shadow borderRadius={30} shadowWidth={15}>
        <View style={{ 
          width: 100, height: 100, backgroundColor: 'white', borderRadius: 30,
        }} />
      </Shadow>
      <Shadow borderRadius={50} shadowWidth={15}>
        <View style={{ 
          width: 100, height: 100, backgroundColor: 'white', borderRadius: 50,
        }} />
      </Shadow>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
})

export default ShadowExample;
