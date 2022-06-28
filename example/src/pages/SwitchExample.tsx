import React, {useState, useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import {Switch} from 'react-native-maui';
import Section from '../components/Section';

export default function SwitchExample() {
  const [on, setOn] = useState(true);
  useEffect(() => {

  })
  return (
    <View style={styles.container}>
      <Section title="基础用法">
        <Switch />
      </Section>
      <Section title="自定义样式">
        <Switch activeBackgroundColor={'cyan'} inactiveBackgroundColor={'pink'} />
      </Section>
      <Section title="默认属性及回调">
        <Switch value={on} onChange={(value) => {
          console.log('switch,',value);
        }} />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
