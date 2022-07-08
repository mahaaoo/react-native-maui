import * as React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Divider } from 'react-native-maui';
import Section from '../components/Section';

const Width = Dimensions.get('window').width;

export default function DividerExample() {
  return (
    <View style={styles.container}>
      <Section title="水平分割线" style={styles.section1}>
        <Divider start={0} end={Width} width={1} />
        <View style={styles.horizontal} />
        <Divider start={0} end={Width} width={3} color={'red'} />
        <View style={styles.horizontal} />
        <Divider start={0} end={100} width={3} strokeDasharray={'5,5'} />
        <View style={styles.horizontal} />
        <Divider
          start={0}
          end={200}
          width={3}
          color={'#11659a'}
          strokeDasharray={'10,10'}
        />
      </Section>
      <Section title="竖直分割线" style={styles.section2}>
        <View style={styles.container2}>
          <Divider vertical start={0} end={100} width={3} />
          <View style={styles.vertical} />
          <Divider
            vertical
            start={0}
            end={100}
            width={3}
            strokeDasharray={'5,5'}
          />
          <View style={styles.vertical} />
          <Divider vertical start={0} end={100} width={3} color={'red'} />
          <View style={styles.vertical} />
          <Divider
            vertical
            start={0}
            end={100}
            width={3}
            color={'#11659a'}
            strokeDasharray={'10,10'}
          />
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section1: {
    flexDirection: 'column',
  },
  horizontal: {
    height: 20,
  },
  section2: {
    flexDirection: 'row',
  },
  vertical: {
    width: 20,
  },
  container2: {
    height: 100,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
