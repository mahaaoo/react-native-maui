import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Shadow } from 'react-native-maui';
import Section from '../components/Section';

const { width } = Dimensions.get('window');

const SIZE = (width - 120) / 3;

interface ShadowExampleProps {}

const ShadowExample: React.FC<ShadowExampleProps> = () => {
  return (
    <View style={styles.container}>
      <Section title="基础用法">
        <Shadow shadowWidth={15}>
          <View style={styles.shadow1} />
        </Shadow>
        <Shadow borderRadius={30} shadowWidth={15}>
          <View style={styles.shadow2} />
        </Shadow>
        <Shadow borderRadius={50} shadowWidth={15}>
          <View style={styles.shadow3} />
        </Shadow>
      </Section>
      <Section title="自定义样式">
        <Shadow borderRadius={30} shadowWidth={15} color="#f7da94">
          <View style={styles.shadow4} />
        </Shadow>
        <Shadow borderRadius={30} shadowWidth={30} color="#eea6b7">
          <View style={styles.shadow5} />
        </Shadow>
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadow1: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'white',
  },
  shadow2: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  shadow3: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  shadow4: {
    width: 100,
    height: 100,
    backgroundColor: '#f9d27d',
    borderRadius: 30,
  },
  shadow5: {
    width: 60,
    height: 60,
    backgroundColor: '#e9ccd3',
    borderRadius: 50,
  },
});

export default ShadowExample;
