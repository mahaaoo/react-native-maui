import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Shadow} from 'react-native-maui';
import Section from '../components/Section';

interface ShadowExampleProps {
};

const ShadowExample: React.FC<ShadowExampleProps> = props => {
  return (
    <View style={styles.container}>
      <Section title="基础用法">
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
      </Section>
      <Section title="自定义样式">
        <Shadow borderRadius={30} shadowWidth={15} color="#f7da94">
          <View style={{ 
            width: 100, height: 100, backgroundColor: '#f9d27d', borderRadius: 30,
          }} />
        </Shadow>
        <Shadow borderRadius={30} shadowWidth={30} color="#eea6b7">
          <View style={{ 
            width: 60, height: 60, backgroundColor: '#e9ccd3', borderRadius: 50,
          }} />
        </Shadow>
      </Section>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default ShadowExample;
