import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {Segmented} from 'react-native-maui';
import Section from '../components/Section';

export default function SegmentedExample() {
  return (
    <View style={styles.container}>
      <Section title={"基础用法"}>
        <Segmented items={['option1', 'option2', 'option3', 'option4']} />
      </Section>
      <Section title={"自定义样式"} style={{ flexDirection: 'column', alignItems: 'flex-start'}}>
        <Segmented 
          items={['section1', 'section2', 'section3', 'section4']}
          style={{
            marginVertical: 10,
            height: 50,
            borderRadius: 12,
            backgroundColor: 'pink'
          }}
          itemStyle={{
            fontWeight: 'bold',
          }}
          inactiveTextColor={'grey'}
          activeTextColor={'green'}
          didChange={(item: string, index: number) => {
            console.log([item, index]);
          }}
        />
        <Segmented 
          items={['one', 'two']}
          style={{
            marginVertical: 10,
            height: 50,
            width: 200,
            borderRadius: 25,
          }}
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
