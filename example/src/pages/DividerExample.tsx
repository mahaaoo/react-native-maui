import * as React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import {Divider} from 'react-native-maui';
import Section from '../components/Section';

const Width = Dimensions.get('window').width;

export default function DividerExample() {
  return (
    <View style={styles.container}>
      <Section title="水平分割线" style={{ flexDirection: 'column' }}>
        <Divider start={0} end={Width} width={1} />
        <View style={{ height: 20 }} />
        <Divider start={0} end={Width} width={3} color={'red'} />
        <View style={{ height: 20 }} />
        <Divider start={0} end={100} width={3} strokeDasharray={'5,5'} />
        <View style={{ height: 20 }} />
        <Divider start={0} end={200} width={3} color={'#11659a'} strokeDasharray={'10,10'}  />
      </Section>
      <Section title="竖直分割线" style={{ flexDirection: 'row' }}>
        <View style={{height: 100, justifyContent: 'center', flexDirection: 'row' }}>
          <Divider vertical start={0} end={100} width={3} />
          <View style={{ width: 20 }} />
          <Divider vertical start={0} end={100} width={3} strokeDasharray={'5,5'}  />
          <View style={{ width: 20 }} />
          <Divider vertical start={0} end={100} width={3} color={'red'} />
          <View style={{ width: 20 }} />
          <Divider vertical start={0} end={100} width={3} color={'#11659a'} strokeDasharray={'10,10'}  />

        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
